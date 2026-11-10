import { useEffect, useMemo, useState } from 'react';
import HintPanel from '../components/HintPanel.jsx';
import LearningHeader from '../components/LearningHeader.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import questions from '../content/questions.json';
import lessons from '../content/lessons.json';
import { quizDiagrams } from '../content/quizDiagrams.js';
import { QUICK_QUIZ_SIZE, scoreQuiz, selectQuizQuestions } from '../assessment/quiz.js';
import { isLessonUnlocked } from '../assessment/progress.js';
import { useStudentState } from '../state/StudentState.jsx';

const WORKED_EXAMPLES = {
  1: 'At every node, check all keys in its left and right subtrees. One value deeper in a subtree can make the whole tree invalid.',
  2: 'Start at the root and compare at every node. Follow only the indicated child; an EMPTY link ends an unsuccessful search and is the insertion position.',
  3: 'Use the traversal rule consistently: pre-order is node-left-right, in-order is left-node-right, and post-order is left-right-node.',
  4: 'Count the nodes on a search path. A balanced tree is shallow; sorted insertions can make an ordinary BST a chain.',
};

function createQuiz(lessonId, previousQuestionIds = [], attempt = 1) {
  const lessonQuestions = selectQuizQuestions(questions, lessonId, { previousQuestionIds });

  return {
    lessonId,
    questionIds: lessonQuestions.map((question) => question.id),
    previousQuestionIds,
    index: 0,
    answers: {},
    hintLevel: 3,
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
      : createQuiz(lessonId, [], (studentState.quizAttempts[lessonId] ?? 0) + 1)
  ));
  const [answerNotice, setAnswerNotice] = useState('');
  const lesson = lessons.find((item) => item.id === lessonId) ?? lessons[0];
  const quizQuestions = useMemo(
    () => quiz.questionIds.map((id) => questions.find((question) => question.id === id)).filter(Boolean),
    [quiz.questionIds],
  );
  const currentQuestion = quizQuestions[quiz.index];
  const selectedAnswer = currentQuestion ? quiz.answers[currentQuestion.id] : undefined;
  const answerIsCorrect = currentQuestion && selectedAnswer === currentQuestion.correctAnswer;
  const questionPoolSize = questions.filter((question) => question.lesson === lessonId && question.selectable !== false).length;
  const result = quiz.phase === 'results' ? scoreQuiz(quizQuestions, quiz.answers) : null;

  useEffect(() => {
    if (quiz.lessonId !== lessonId) {
      setQuiz(createQuiz(lessonId, [], (studentState.quizAttempts[lessonId] ?? 0) + 1));
      setAnswerNotice('');
      return;
    }
    setStudentState((state) => (state.activeQuiz === quiz ? state : { ...state, activeQuiz: quiz }));
  }, [lessonId, quiz, setStudentState, studentState.quizAttempts]);

  function answerQuestion(optionId) {
    if (!currentQuestion || selectedAnswer !== undefined) return;
    const correct = optionId === currentQuestion.correctAnswer;
    const nextStreak = correct ? quiz.correctStreak + 1 : 0;
    const nextLevel = correct
      ? (nextStreak > 0 && nextStreak % 2 === 0 ? Math.max(0, quiz.hintLevel - 1) : quiz.hintLevel)
      : Math.min(3, quiz.hintLevel + 1);

    setQuiz((current) => ({
      ...current,
      answers: { ...current.answers, [currentQuestion.id]: optionId },
      hintLevel: nextLevel,
      correctStreak: nextStreak,
      hintVisible: false,
    }));
    setAnswerNotice(correct ? 'Correct.' : 'Not quite.');
  }

  function advanceQuestion() {
    if (!currentQuestion || selectedAnswer === undefined) return;
    if (quiz.index < quizQuestions.length - 1) {
      setQuiz((current) => ({ ...current, index: current.index + 1, hintVisible: false }));
      setAnswerNotice('');
    } else {
      const finalResult = scoreQuiz(quizQuestions, quiz.answers);
      setQuiz((current) => ({ ...current, phase: 'results', hintVisible: false }));
      setAnswerNotice('');
      setStudentState((state) => {
        const masteredLessons = finalResult.passed
          ? [...new Set([...state.masteredLessons, lessonId])].sort((a, b) => a - b)
          : state.masteredLessons;
        const earnedBanners = finalResult.passed
          ? [...new Set([...state.earnedBanners, `lesson-${lessonId}`])]
          : state.earnedBanners;
        return {
          ...state,
          masteredLessons,
          earnedBanners,
          quizAttempts: { ...state.quizAttempts, [lessonId]: (state.quizAttempts[lessonId] ?? 0) + 1 },
        };
      });
    }
  }

  function retryQuiz() {
    const oldIds = [...quiz.previousQuestionIds, ...quiz.questionIds];
    const nextQuiz = createQuiz(lessonId, oldIds, quiz.attempt + 1);
    setQuiz(nextQuiz);
    setAnswerNotice('');
    setStudentState((state) => ({ ...state, activeQuiz: nextQuiz }));
  }

  function continueAfterPass() {
    if (lessonId < lessons.length) {
      window.location.hash = `#lesson?lesson=${lessonId + 1}`;
    } else {
      setAnswerNotice('You have completed the four lesson quizzes. The final mastery check has not been supplied yet.');
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
                {lessonId < lessons.length ? 'Continue to next lesson' : 'Finish lessons'}
              </button>
            </>
          ) : (
            <>
              <p>You need at least 3 of 4 correct to unlock the next lesson. There is no penalty for retrying, and activities are optional.</p>
              <div className="quiz-scaffold">
                <h2>Worked example</h2>
                <p>{WORKED_EXAMPLES[lessonId]}</p>
                <h3>Review these outcomes</h3>
                <p>{[...new Set(quizQuestions.filter((item) => quiz.answers[item.id] !== item.correctAnswer).map((item) => item.outcome))].join(', ') || 'Review the lesson goal.'}</p>
              </div>
              {questionPoolSize < 8 && (
                <p className="pool-warning">The supplied pool has {questionPoolSize} usable questions; a retry may repeat questions.</p>
              )}
              <button type="button" className="learning-primary-button" onClick={retryQuiz}>Retry quiz</button>
            </>
          )}
          {answerNotice && <p className="lesson-notice" role="status">{answerNotice}</p>}
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
          {questionPoolSize < 8 && (
            <p className="pool-warning">This lesson has {questionPoolSize} usable questions in the supplied pool; retries may repeat questions.</p>
          )}
          <section className="quiz-question-layout" aria-labelledby={`question-${currentQuestion.id}`}>
            <div className="quiz-question-prompt">
              <div className="question-meta">
                <span>Question {currentQuestion.id.slice(1)}</span>
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
                <div className={`quiz-feedback${answerIsCorrect ? ' is-correct' : ' is-incorrect'}`} role="status">
                  <strong>{answerNotice}</strong>
                  <p>{currentQuestion.explanation}</p>
                </div>
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
      <span className="screen-caption">Screen 4: Quick quiz with feedback</span>
    </main>
  );
}
