# GenAI prompt log

Record every use of generative AI that produced lesson content, questions, hints or other learner-facing text.

| Date | Tool / model | Prompt (summary or verbatim) | Output used in | Reviewed by |
|------|--------------|------------------------------|----------------|-------------|
| 2026-11-05 | Claude Code (Claude Opus 5.5) | "Scaffold the project … implement src/engine/bst.js and src/engine/traversals.js so that insert, search and the three depth-first traversals return step snapshots, and write tests/engine.test.js." | Step narration strings and pseudocode lines in `src/engine/bst.js` and `src/engine/traversals.js` | _pending_ |
| 2026-11-11 | Claude (Claude Opus 5.5) | "Look through the current main branch, check the code matches the SE and ID documentation, fix what does not match and build tests." Output included: misconception tags and targeted feedback text for every wrong option (`src/content/misconceptions.json`, `misconception` fields in `questions.json`), learning-outcome wording (`src/content/outcomes.json`, taken from ID document 4.1), lecture-ready questions 2 and 3 (`src/pages/LectureReady.jsx`), and reward titles (`src/content/rewards.json`). | Misconception feedback, lecture questions and reward titles | _pending: ID team to check each tag and feedback line against the outcomes_ |
