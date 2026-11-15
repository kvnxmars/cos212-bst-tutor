import { useEffect, useMemo, useState } from 'react';
import AnswerFeedback from '../components/AnswerFeedback.jsx';
import LearningHeader from '../components/LearningHeader.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import ReadAloudButton from '../components/ReadAloudButton.jsx';
import questions from '../content/questions.json';
import lessons from '../content/lessons.json';
import outcomes from '../content/outcomes.json';
import { quizDiagrams } from '../content/quizDiagrams.js';
import {
  MASTERY_OUTCOMES,
  MASTERY_PASS_COUNT,
  scoreMasteryCheck,
  selectMasteryQuestions,
} from '../assessment/quiz.js';
import { lessonsForOutcomes, missedOutcomes } from '../assessment/rules.js';
import { misconceptionFor } from '../assessment/scoring.js';
import { useStudentState } from '../state/StudentState.jsx';
import { playSound } from '../audio/sound.js';

function createCheck(previousQuestionIds = []) {
  return {
    questionIds: selectMasteryQuestions(questions, { previousQuestionIds }).map((question) => question.id),
    previousQuestionIds,
    index: 0,
    selections: {},
    answers: {},
    phase: 'questions',
  };
}

export default function MasteryCheck() {
  const { studentState, setStudentState } = useStudentState();
  const allLessonsMastered = lessons.every((lesson) => studentState.masteredLessons.includes(lesson.id));
  const [check, setCheck] = useState(() => (
    Array.isArray(studentState.activeMastery?.questionIds) ? studentState.activeMastery : createCheck()
  ));
  const checkQuestions = useMemo(
    () => check.questionIds.map((id) => questions.find((question) => question.id === id)).filter(Boolean),
    [check.questionIds],
  );
  const currentQuestion = checkQuestions[check.index];
  const submittedAnswer = currentQuestion ? check.answers[currentQuestion.id] : undefined;
  const selectedAnswer = currentQuestion
    ? check.selections?.[currentQuestion.id] ?? submittedAnswer
    : undefined;
  const result = check.phase === 'results' ? scoreMasteryCheck(checkQuestions, check.answers) : null;
  const missed = result ? missedOutcomes(checkQuestions, check.answers) : [];

  useEffect(() => {
    setStudentState((state) => (state.activeMastery === check ? state : { ...state, activeMastery: check }));
  }, [check, setStudentState]);

  function selectAnswer(optionId) {
    if (!currentQuestion || submittedAnswer !== undefined) return;
    setCheck((current) => ({
      ...current,
      selections: { ...current.selections, [currentQuestion.id]: optionId },
    }));
  }

  function submitAnswer() {
    if (!currentQuestion || selectedAnswer === undefined || submittedAnswer !== undefined) return;
    const tag = misconceptionFor(currentQuestion, selectedAnswer);
    playSound(selectedAnswer === currentQuestion.correctAnswer ? 'correct' : 'incorrect', { muted: !studentState.settings.soundOn });
    setCheck((current) => ({ ...current, answers: { ...current.answers, [currentQuestion.id]: selectedAnswer } }));
    if (tag) {
      setStudentState((state) => ({
        ...state,
        misconceptionsHit: [
          ...state.misconceptionsHit,
          { date: new Date().toISOString().slice(0, 10), lessonId: 'mastery', questionId: currentQuestion.id, tag },
        ],
      }));
    }
  }

  function advance() {
    if (submittedAnswer === undefined) return;
    if (check.index < checkQuestions.length - 1) {
      setCheck((current) => ({ ...current, index: current.index + 1 }));
      return;
    }
    const finalResult = scoreMasteryCheck(checkQuestions, check.answers);
    const finalMissed = missedOutcomes(checkQuestions, check.answers);
    if (finalResult.passed) playSound('cheer', { muted: !studentState.settings.soundOn });
    setCheck((current) => ({ ...current, phase: 'results' }));
    setStudentState((state) => ({
      ...state,
      masteryCheck: {
        attempts: state.masteryCheck.attempts + 1,
        // A failed retake never takes away a pass (or its wallpaper) already earned.
        passed: state.masteryCheck.passed || finalResult.passed,
        bestPercentage: Math.max(state.masteryCheck.bestPercentage ?? 0, finalResult.percentage),
        lastMissedOutcomes: finalMissed,
      },
    }));
  }

  function retake() {
    const next = createCheck([...check.previousQuestionIds, ...check.questionIds]);
    setCheck(next);
  }

  if (!allLessonsMastered) {
    return (
      <main className="learning-shell">
        <LearningHeader lessonId={4} />
        <section className="lesson-locked" role="status">
          <h1>The mastery check is locked</h1>
          <p>Pass all four lesson quizzes to unlock the final mastery check.</p>
          <a href="#welcome">Continue where you left off</a>
        </section>
      </main>
    );
  }

  const progress = check.phase === 'results' ? 100 : Math.round(((check.index + 1) / checkQuestions.length) * 100);

  return (
    <main className="learning-shell quiz-shell">
      <LearningHeader lessonId={4} />
      <div className="lesson-topline">
        <nav className="lesson-breadcrumb" aria-label="Breadcrumb">
          <a href="#welcome">Home</a><span>&gt;</span><span>Final mastery check</span>
        </nav>
        <div className="lesson-progress">
          <div className="progress-track" role="progressbar" aria-label="Mastery check progress" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
            <span style={{ width: `${progress}%` }} />
          </div>
          <span>{progress}% done</span>
        </div>
      </div>

      {check.phase === 'results' ? (
        <section className="quiz-results" aria-live="polite">
          <p className="eyebrow">FINAL MASTERY CHECK / ATTEMPT {studentState.masteryCheck.attempts}</p>
          <h1>{result.passed ? 'You are lecture-ready!' : 'Nearly there.'}</h1>
          <p className="quiz-score">{result.correctCount} of {result.total} correct <span>({result.percentage}%)</span></p>
          {result.passed ? (
            <>
              <p>You passed the mastery check ({MASTERY_PASS_COUNT} of {MASTERY_OUTCOMES.length} needed). Your lecture-ready card and wallpaper are unlocked.</p>
              <a className="learning-primary-button" href="#lecture-ready">Open your lecture-ready card</a>
            </>
          ) : (
            <>
              <p>You need {MASTERY_PASS_COUNT} of {MASTERY_OUTCOMES.length} correct. Review the outcomes below, then retake the check. There is no limit and no penalty.</p>
              <div className="quiz-scaffold">
                <h2>Outcomes to review</h2>
                <ul>{missed.map((outcome) => <li key={outcome}>{outcomes[outcome]}</li>)}</ul>
                <h3>Go back to</h3>
                <ul>
                  {lessonsForOutcomes(missed, lessons).map((lessonId) => (
                    <li key={lessonId}>
                      <a href={`#lesson?lesson=${lessonId}`}>Lesson {lessonId}: {lessons.find((lesson) => lesson.id === lessonId).title}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <button type="button" className="learning-primary-button" onClick={retake}>Retake the check</button>
            </>
          )}
        </section>
      ) : (
        <>
          <div className="quiz-heading">
            <div>
              <p className="eyebrow">FINAL MASTERY CHECK</p>
              <h1>One question per learning outcome</h1>
            </div>
            <div className="quiz-count">Question {check.index + 1} of {checkQuestions.length}</div>
          </div>
          <section className="quiz-question-layout" aria-labelledby={`question-${currentQuestion.id}`}>
            <div className="quiz-question-prompt">
              <div className="question-meta">
                <span>Question {check.index + 1}</span>
                <span>Skill level: {currentQuestion.skillLevel}</span>
              </div>
              <div className="question-stem-row">
                <h2 id={`question-${currentQuestion.id}`}>{currentQuestion.stem}</h2>
                <ReadAloudButton audio={currentQuestion.audio} />
              </div>
              <QuestionCard
                question={currentQuestion}
                tree={quizDiagrams[currentQuestion.id]}
                selectedAnswer={selectedAnswer}
                submitted={submittedAnswer !== undefined}
                onAnswer={selectAnswer}
              />
              {submittedAnswer !== undefined && (
                <AnswerFeedback question={currentQuestion} selectedAnswer={submittedAnswer} />
              )}
              <div className="quiz-question-footer">
                <span />
                <button
                  type="button"
                  className="learning-primary-button"
                  disabled={submittedAnswer === undefined ? selectedAnswer === undefined : false}
                  onClick={submittedAnswer === undefined ? submitAnswer : advance}
                >
                  {submittedAnswer === undefined
                    ? 'Submit answer'
                    : check.index === checkQuestions.length - 1 ? 'See results' : 'Next question'}
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
