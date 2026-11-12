import { useEffect, useRef, useState } from 'react';
import { useStudentState } from '../state/StudentState.jsx';

export default function CourseResetButton({ className = '' }) {
  const { resetCourse } = useStudentState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (dialogOpen) cancelButtonRef.current?.focus();
  }, [dialogOpen]);

  function closeDialog() {
    setDialogOpen(false);
    triggerRef.current?.focus();
  }

  function confirmReset() {
    resetCourse();
    closeDialog();
  }

  return (
    <>
      <button
        ref={triggerRef}
        className={`course-reset-button${className ? ` ${className}` : ''}`}
        type="button"
        aria-haspopup="dialog"
        onClick={() => setDialogOpen(true)}
      >
        Start course over
      </button>
      {dialogOpen && (
        <div className="course-reset-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}>
          <section
            className="course-reset-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-reset-title"
            aria-describedby="course-reset-description"
            onKeyDown={(event) => {
              if (event.key === 'Escape') closeDialog();
            }}
          >
            <p className="eyebrow">COURSE RESET</p>
            <h2 id="course-reset-title">Start the whole course over?</h2>
            <p id="course-reset-description">
              Your lesson progress, quiz scores, and earned banners will be cleared. Your accessibility preferences will stay.
            </p>
            <div className="course-reset-dialog-actions">
              <button ref={cancelButtonRef} type="button" onClick={closeDialog}>Keep my progress</button>
              <button className="is-destructive" type="button" onClick={confirmReset}>Start over</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
