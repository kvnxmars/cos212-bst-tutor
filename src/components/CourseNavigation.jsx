import { useState } from 'react';
import lessons from '../content/lessons.json';
import rewards from '../content/rewards.json';
import { isLessonUnlocked } from '../assessment/progress.js';
import { activeBannerIdFor, earnedThemeIds } from '../assessment/rewards.js';
import { useStudentState } from '../state/StudentState.jsx';
import AccessibilityMenu from './AccessibilityMenu.jsx';

const ACTIVITY_LABELS = {
  1: 'Tree parts & BST rules',
  2: 'Search & insert',
  3: 'Traversal challenge',
  4: 'Shape & search cost',
};

export default function CourseNavigation({ lessonId = 1 }) {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { studentState, setStudentState } = useStudentState();
  const allLessonsMastered = lessons.every((lesson) => studentState.masteredLessons.includes(lesson.id));
  const activeBannerId = activeBannerIdFor(studentState);
  // Every unlocked colour theme: lesson banners plus the mastery wallpaper once passed.
  const themeIds = earnedThemeIds(studentState);
  const earnedBanners = rewards.filter((reward) => themeIds.includes(reward.id));

  function closeMenu() {
    setOpen(false);
    setSettingsOpen(false);
  }

  return (
    <div className="course-navigation">
      <button
        className="course-navigation-trigger"
        type="button"
        aria-expanded={open}
        aria-controls="course-navigation-panel"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-label={open ? 'Close course menu' : 'Open course menu'}
      >
        <span className="hamburger-icon" aria-hidden="true"><span /><span /><span /></span>
      </button>
      {open && (
        <nav
          className="course-navigation-panel"
          id="course-navigation-panel"
          aria-label="Course navigation"
          onKeyDown={(event) => {
            if (event.key === 'Escape') closeMenu();
          }}
        >
          <a href="#welcome" onClick={closeMenu}>Course home</a>
          <div className="course-navigation-section">
            <span>Lessons</span>
            {lessons.map((lesson) => {
              const unlocked = isLessonUnlocked(lesson.id, studentState.masteredLessons);
              const mastered = studentState.masteredLessons.includes(lesson.id);
              return unlocked
                ? <a href={`#lesson?lesson=${lesson.id}`} key={lesson.id} onClick={closeMenu}>{lesson.id}. {lesson.title}{mastered ? ' · Mastered' : ''}</a>
                : <span className="course-navigation-locked" key={lesson.id}>{lesson.id}. {lesson.title} · Locked</span>;
            })}
          </div>
          <div className="course-navigation-section">
            <span>Lesson {lessonId}</span>
            {isLessonUnlocked(lessonId, studentState.masteredLessons) ? (
              <>
                <a href={`#lesson?lesson=${lessonId}`} onClick={closeMenu}>Lesson page</a>
                <a href={`#visualizer?lesson=${lessonId}`} onClick={closeMenu}>BST visualiser</a>
                <a href={`#video?lesson=${lessonId}`} onClick={closeMenu}>Watch a video</a>
                <a href={`#build-tree?lesson=${lessonId}`} onClick={closeMenu}>Practice activity: {ACTIVITY_LABELS[lessonId]}</a>
                <a href={`#quiz?lesson=${lessonId}`} onClick={closeMenu}>Quick quiz</a>
              </>
            ) : (
              <span className="course-navigation-locked">Complete the previous lesson quiz to unlock these pages.</span>
            )}
          </div>
          <div className="course-navigation-section">
            <span>Course tools</span>
            {allLessonsMastered
              ? <a href="#mastery" onClick={closeMenu}>Final mastery check</a>
              : <span className="course-navigation-locked">Final mastery check · Locked</span>}
            {studentState.masteryCheck.passed
              ? <a href="#lecture-ready" onClick={closeMenu}>Lecture-ready card</a>
              : <span className="course-navigation-locked">Lecture-ready card · Locked</span>}
            <a href="#rewards" onClick={closeMenu}>Rewards gallery</a>
          </div>
          <div className="course-navigation-section">
            <button
              className="course-navigation-settings-trigger"
              type="button"
              aria-expanded={settingsOpen}
              aria-controls="course-settings-panel"
              onClick={() => setSettingsOpen((isOpen) => !isOpen)}
            >
              <span>Settings</span><span aria-hidden="true">{settingsOpen ? '−' : '+'}</span>
            </button>
            {settingsOpen && (
              <div className="course-settings-panel" id="course-settings-panel">
                <AccessibilityMenu />
                <fieldset className="theme-setting-options">
                  <legend>App colour theme</legend>
                  <label>
                    <input
                      type="radio"
                      name="course-theme"
                      value="default"
                      checked={activeBannerId === null}
                      onChange={() => setStudentState((state) => ({ ...state, selectedBanner: 'default' }))}
                    />
                    Default cream and forest
                  </label>
                  {earnedBanners.map((banner) => (
                    <label key={banner.id}>
                      <input
                        type="radio"
                        name="course-theme"
                        value={banner.id}
                        checked={activeBannerId === banner.id}
                        onChange={() => setStudentState((state) => ({ ...state, selectedBanner: banner.id }))}
                      />
                      {banner.title}
                    </label>
                  ))}
                  {earnedBanners.length === 0 && (
                    <p className="theme-setting-note">Pass a lesson quiz to unlock more colour themes.</p>
                  )}
                </fieldset>
              </div>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
