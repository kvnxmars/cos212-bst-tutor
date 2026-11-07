import { useState } from 'react';

export default function LearningHeader() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <header className="learning-header">
      <a href="#welcome">COS212 BST Tutor</a>
      <button type="button" aria-expanded={settingsOpen} onClick={() => setSettingsOpen((open) => !open)}>Settings</button>
      <div className="reward-banner">Banner (earned reward)</div>
      {settingsOpen && <p className="settings-placeholder" role="status">Settings will be available in a later version.</p>}
    </header>
  );
}
