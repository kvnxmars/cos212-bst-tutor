import { useState } from 'react';
import LearningHeader from '../components/LearningHeader.jsx';

const LEARNING_STYLES = [
  { id: 'visual', title: 'Visual', description: 'Watch animated videos of the tree', icon: '◉' },
  { id: 'auditory', title: 'Auditory', description: 'Listen to narrated videos and audio', icon: '◖' },
  { id: 'read-write', title: 'Read / Write', description: 'Read short text with pseudocode', icon: '≡' },
  { id: 'kinesthetic', title: 'Kinesthetic', description: 'Learn by dragging nodes into place', icon: '✣' },
];

export default function Welcome() {
  const [learningStyle, setLearningStyle] = useState('visual');

  return (
    <main className="learning-shell">
      <LearningHeader />
      <div className="welcome-breadcrumb">Welcome</div>
      <section className="welcome-content" aria-labelledby="welcome-title">
        <h1 id="welcome-title">How do you like to learn?</h1>
        <p>Pick one. It only changes how lessons are shown, and you can change it any time.</p>
        <fieldset className="learning-style-options">
          <legend className="visually-hidden">Choose a learning style</legend>
          {LEARNING_STYLES.map((style) => (
            <label className={`learning-style-card${learningStyle === style.id ? ' is-selected' : ''}`} key={style.id}>
              <input
                type="radio"
                name="learning-style"
                value={style.id}
                checked={learningStyle === style.id}
                onChange={() => setLearningStyle(style.id)}
              />
              <span className="learning-style-icon" aria-hidden="true">{style.icon}</span>
              <strong>{style.title}</strong>
              <span className="learning-style-description">{style.description}</span>
              <span className="learning-style-radio" aria-hidden="true" />
            </label>
          ))}
        </fieldset>
        <a className="learning-primary-button" href="#lesson">Continue</a>
        <p className="welcome-note">No test, no pre-quiz: just your choice.</p>
      </section>
      <span className="screen-caption">Screen 1: Learning-style selection</span>
    </main>
  );
}