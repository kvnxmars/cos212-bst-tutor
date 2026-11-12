import { useEffect, useMemo, useState } from 'react';
import AnswerFeedback from '../components/AnswerFeedback.jsx';
import HintPanel from '../components/HintPanel.jsx';
import LearningHeader from '../components/LearningHeader.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import questions from '../content/questions.json';
import lessons from '../content/lessons.json';
import outcomes from '../content/outcomes.json';
import { quizDiagrams } from '../content/quizDiagrams.js';
import { QUICK_QUIZ_SIZE, scoreQuiz, selectQuizQuestions } from '../assessment/quiz.js';
import { isLessonUnlocked } from '../assessment/progress.js';
import { missedOutcomes, nextHintLevel, startingHintLevel } from '../assessment/rules.js';
import { misconceptionFor } from '../assessment/scoring.js';
import { awardLessonBanner, bannerIdFor } from '../assessment/rewards.js';
import { useStudentState } from '../state/StudentState.jsx';

const WORKED_EXAMPLES = {
  1: 'At every node, check all keys in its left and right subtrees. One value deeper in a subtree can make the whole tree invalid.',
  2: 'Start at the root and compare at every node. Follow only the indicated child; an EMPTY link ends an unsuccessful search and is the insertion position.',
  3: 'Use the traversal rule consistently: pre-order is node-left-right, in-order is left-node-right, and post-order is left-right-node.',
  4: 'Count the nodes on a search path. A balanced tree is shallow; sorted insertions can make an ordinary BST a chain.',
};

function createQuiz(lessonId, previousQuestionIds = [], attempt = 1, hintLevel = 3) {
  const lessonQuestions = selectQuizQuestions(questions, lessonId, { previousQuestionIds });
  const poolSize = questions.filter((question) => question.lesson === lessonId && question.selectable !== false).length;
  if (poolSize < 8) {
    // Developer/ID-team note only: the ID document asks for at least 8 per lesson.
    console.warn(`Lesson ${lessonId} has ${poolSize} selectable questions; the ID document asks for at least 8 so retries are fresh.`);
  }

  return {
    lessonId,
    questionIds: lessonQuestions.map((question) => question.id),
    previousQuestionIds,
    index: 0,
    answers: {},
    hintLevel,
    correctStreak: 0,
    hintVisible: false,
    attempt,
    phase: 'questions',
  };
}

export default function QuizPage({ lessonId = 1 }) {
  const { studentState, setStudentState } = useStudentState();
  const lessonUnlocked = isLessonUnlocked(lessonId, studentState.masteredLessons);
  const savedQuiz = studentState.activeQuiz;
  const [quiz, setQuiz] = useState(() => (
    savedQuiz?.lessonId === lessonId && Array.isArray(savedQuiz.questionIds)
      ? savedQuiz
      : createQuiz(lessonId, [], (studentState.quizAttempts[lessonId] ?? 0) + 1, startingHintLevel(lessonId, studentState.masteredLessons))
  ));
  const lesson = lessons.find((item) => item.id === lessonId) ?? lessons[0];
  const quizQuestions = useMemo(
    () => quiz.questionIds.map((id) => questions.find((question) => question.id === id)).filter(Boolean),
    [quiz.questionIds],
  );
  const currentQuestion = quizQuestions[quiz.index];
  const selectedAnswer = currentQuestion ? quiz.answers[currentQuestion.id] : undefined;
  const result = quiz.phase === 'results' ? scoreQuiz(quizQuestions, quiz.answers) : null;

  useEffect(() => {
    if (quiz.lessonId !== lessonId) {
      setQuiz(createQuiz(lessonId, [], (studentState.quizAttempts[lessonId] ?? 0) + 1, startingHintLevel(lessonId, studentState.masteredLessons)));
      return;
    }
    setStudentState((state) => (state.activeQuiz === quiz ? state : { ...state, activeQuiz: quiz }));
  }, [lessonId, quiz, setStudentState, studentState.quizAttempts, studentState.masteredLessons]);

  function answerQuestion(optionId) {
    if (!currentQuestion || selectedAnswer !== undefined) return;
    const correct = optionId === currentQuestion.correctAnswer;
    const hints = nextHintLevel(quiz, correct);
    const tag = misconceptionFor(currentQuestion, optionId);

    setQuiz((current) => ({
      ...current,
      answers: { ...current.answers, [currentQuestion.id]: optionId },
      ...hints,
      hintVisible: false,
    }));
    if (tag) {
      setStudentState((state) => ({
        ...state,
        misconceptionsHit: [
          ...state.misconceptionsHit,
          { date: new Date().toISOString().slice(0, 10), lessonId, questionId: currentQuestion.id, tag },
        ],
      }));
    }
  }

  function advanceQuestion() {
    if (!currentQuestion || selectedAnswer === undefined) return;
    if (quiz.index < quizQuestions.length - 1) {
      setQuiz((current) => ({ ...current, index: current.index + 1, hintVisible: false }));
    } else {
      const finalResult = scoreQuiz(quizQuestions, quiz.answers);
      setQuiz((current) => ({ ...current, phase: 'results', hintVisible: false }));
      setStudentState((state) => {
        const masteredLessons = finalResult.passed
          ? [...new Set([...state.masteredLessons, lessonId])].sort((a, b) => a - b)
          : state.masteredLessons;
        const earnedBanners = finalResult.passed
          ? awardLessonBanner(state.earnedBanners, lessonId)
          : state.earnedBanners;
        return {
          ...state,
          masteredLessons,
          earnedBanners,
          selectedBanner: finalResult.passed ? bannerIdFor(lessonId) : state.selectedBanner,
          quizAttempts: { ...state.quizAttempts, [lessonId]: (state.quizAttempts[lessonId] ?? 0) + 1 },
          firstAttemptScores: lessonId in state.firstAttemptScores
            ? state.firstAttemptScores
            : { ...state.firstAttemptScores, [lessonId]: finalResult.percentage },
        };
      });
    }
  }

  function retryQuiz() {
    const oldIds = [...quiz.previousQuestionIds, ...quiz.questionIds];
    // Hints carry over into the retry, so a struggling student keeps the fuller hints.
    const nextQuiz = createQuiz(lessonId, oldIds, quiz.attempt + 1, Math.max(quiz.hintLevel, 1));
    setQuiz(nextQuiz);
    setStudentState((state) => ({ ...state, activeQuiz: nextQuiz }));
  }

  function continueAfterPass() {
    if (lessonId < lessons.length) {
      window.location.hash = `#lesson?lesson=${lessonId + 1}`;
    } else {
      window.location.hash = '#mastery';
    }
  }

  if (!currentQuestion && quiz.phase !== 'results') {
    return <main className="learning-shell"><LearningHeader lessonId={lessonId} /><p role="alert">No quiz questions are available for this lesson yet.</p></main>;
  }

  if (!lessonUnlocked) {
    return (
      <main className="learning-shell">
        <LearningHeader lessonId={lessonId} />
        <section className="lesson-locked" role="status">
          <h1>This quiz is locked</h1>
          <p>Pass the previous lesson’s quick quiz to unlock this quiz. The activity is optional; the quiz is required.</p>
          <a href={`#lesson?lesson=${lessonId - 1}`}>Return to the previous lesson</a>
        </section>
      </main>
    );
  }

  const progress = quiz.phase === 'results'
    ? 100
    : Math.round(((quiz.index + 1) / QUICK_QUIZ_SIZE) * 100);

  return (
    <main className="learning-shell quiz-shell">
      <LearningHeader lessonId={lessonId} />
      <div className="lesson-topline">
        <nav className="lesson-breadcrumb" aria-label="Breadcrumb">
          <a href="#welcome">Home</a><span>&gt;</span><a href={`#lesson?lesson=${lessonId}`}>Lesson {lessonId}</a><span>&gt;</span><span>Quick quiz</span>
        </nav>
        <div className="lesson-progress">
          <div className="progress-track" role="progressbar" aria-label="Quiz progress" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
            <span style={{ width: `${progress}%` }} />
          </div>
          <span>{progress}% done</span>
        </div>
      </div>

      {quiz.phase === 'results' ? (
        <section className="quiz-results" aria-live="polite">
          <p className="eyebrow">LESSON {lessonId} QUICK QUIZ / ATTEMPT {quiz.attempt}</p>
          <h1>{result.passed ? 'Lesson mastered!' : 'A little more practice will help.'}</h1>
          <p className="quiz-score">{result.correctCount} of {result.total} correct <span>({result.percentage}%)</span></p>
          {result.passed ? (
            <>
              <p>You passed the 75% mastery mark. The next lesson is now unlocked, and your lesson banner has been earned. Activities are optional; passing the quiz is what unlocks the next lesson.</p>
              <button type="button" className="learning-primary-button" onClick={continueAfterPass}>
                {lessonId < lessons.length ? 'Continue to next lesson' : 'Go to the final mastery check'}
              </button>
            </>
          ) : (
            <>
              <p>You need at least 3 of 4 correct to unlock the next lesson. There is no penalty for retrying, and activities are optional.</p>
              <div className="quiz-scaffold">
                <h2>Worked example</h2>
                <p>{WORKED_EXAMPLES[lessonId]}</p>
                <h3>Review these before you retry</h3>
                <ul>
                  {missedOutcomes(quizQuestions, quiz.answers).map((outcome) => <li key={outcome}>{outcomes[outcome]}</li>)}
                </ul>
                <a href={`#lesson?lesson=${lessonId}`}>Re-read the lesson</a>
              </div>
              <button type="button" className="learning-primary-button" onClick={retryQuiz}>Retry quiz</button>
            </>
          )}
        </section>
      ) : (
        <>
          <div className="quiz-heading">
            <div>
              <p className="eyebrow">LESSON {lessonId} / QUICK QUIZ</p>
              <h1>{lesson.title}</h1>
            </div>
            <div className="quiz-count">Question {quiz.index + 1} of {quizQuestions.length}</div>
          </div>
          <section className="quiz-question-layout" aria-labelledby={`question-${currentQuestion.id}`}>
            <div className="quiz-question-prompt">
              <div className="question-meta">
                <span>Question {quiz.index + 1}</span>
                <span>Skill level: {currentQuestion.skillLevel}</span>
              </div>
              <h2 id={`question-${currentQuestion.id}`}>{currentQuestion.stem}</h2>
              <QuestionCard
                question={currentQuestion}
                tree={quizDiagrams[currentQuestion.id]}
                selectedAnswer={selectedAnswer}
                onAnswer={answerQuestion}
              />
              {selectedAnswer !== undefined && (
                <AnswerFeedback question={currentQuestion} selectedAnswer={selectedAnswer} />
              )}
              <div className="quiz-question-footer">
                <HintPanel
                  level={quiz.hintLevel}
                  visible={quiz.hintVisible}
                  onToggle={() => setQuiz((current) => ({ ...current, hintVisible: !current.hintVisible }))}
                />
                <button type="button" className="learning-primary-button" disabled={selectedAnswer === undefined} onClick={advanceQuestion}>
                  {quiz.index === quizQuestions.length - 1 ? 'See results' : 'Next question'}
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
