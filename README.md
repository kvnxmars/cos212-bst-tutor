# COS212 BST Tutor

COS212 BST Tutor is a browser-based learning application that prepares students for a lecture on binary search trees (BSTs). It teaches tree terminology and the BST ordering rule, search and insertion, depth-first traversals, tree shape and search cost, and choosing between a BST and a sorted array.

The app combines four data-driven lessons, a step-by-step algorithm visualiser, optional video and interactive activities, lesson quizzes, and a final mastery check. Its intended use is self-paced preparation and reinforcement: learners can inspect an explanation, predict an outcome, see an algorithm unfold, and then check their understanding.

This README describes the current implementation, project structure, learning design, supporting documentation, and development workflow. Source files remain the implementation reference for exact behaviour; keep this guide aligned when those behaviours or project assets change.

## At a glance

| Area | Current implementation |
| --- | --- |
| Frontend | React 18 with JSX and JavaScript ES modules |
| Development and build | Vite 8 |
| Styling | Custom responsive CSS and CSS variables in `src/styles/theme.css` |
| Content | JSON lesson, question, outcome, misconception, video, and reward data |
| Student persistence | Browser `localStorage`; no account or server-side database |
| Testing | Vitest |
| Main course | Four lessons, four-question lesson quizzes, and a ten-question final mastery check |
| Deployment workflow | Manually triggered GitHub Pages workflow |

## Learning outcomes and course flow

The course has ten outcomes, grouped across four lessons:

1. **Recognise a BST:** name root, parent, child, leaf, and subtree; apply the ordering rule to an entire subtree.
2. **Search and insert:** trace successful and unsuccessful searches, insert a value, and build a BST from values in their given order.
3. **Traverse a BST:** produce pre-order, in-order, and post-order sequences and explain why in-order traversal of a BST is sorted.
4. **Reason about shape and cost:** connect insertion order and tree height to search comparisons and choose between a BST and a sorted array for a workload.

The normal learner journey is:

1. Start at the welcome page. A returning learner can continue at the first unmastered lesson; after passing the final mastery check, the welcome action opens the lecture-ready card.
2. Read a lesson and inspect its diagrams, traces, terms, and examples.
3. Use the BST visualiser to construct a tree and replay an operation.
4. Optionally watch the lesson video or complete its interactive activity.
5. Take the lesson's four-question quiz. At least **3 of 4 correct (75%)** passes and unlocks the next lesson.
6. After mastering all four lesson quizzes, take the final mastery check: one question for each of the ten outcomes, with **8 of 10 correct** required to pass.
7. On passing the final check, view the lecture-ready card and unlock the wallpaper reward.

Videos and activities are optional practice; the lesson quiz is the progression gate. Failed quizzes can be retried without a penalty. Retakes use fresh questions when the question pool allows it. A failed retake does not revoke a lesson banner or a previously earned final-check pass.

## Pages and routes

Navigation uses the URL hash, parsed in `src/App.jsx`; it does not use a routing package. The optional `lesson` query value is limited to lesson IDs 1–4.

| Page | Hash route | Purpose and behaviour |
| --- | --- | --- |
| Welcome | `#welcome` (also the default) | Introduces the tutor and starts or resumes the course. |
| Lesson | `#lesson?lesson=1` through `#lesson?lesson=4` | Presents objectives and data-driven instructional sections; links to the visualiser, video, activity, and quiz. |
| BST visualiser | `#visualizer?lesson=1` through `#visualizer?lesson=4` | Builds trees, runs operations, and plays their step snapshots. |
| Video | `#video?lesson=1` through `#video?lesson=4` | Shows the video and viewing guidance associated with the lesson. |
| Practice activity | `#build-tree?lesson=1` through `#build-tree?lesson=4` | Loads a lesson-specific interactive challenge. |
| Quick quiz | `#quiz?lesson=1` through `#quiz?lesson=4` | Runs the lesson quiz, feedback, retry, and progression flow. |
| Final mastery check | `#mastery` | Runs after all four lesson quizzes are mastered. |
| Lecture-ready card | `#lecture-ready` | Shows achieved outcomes and score comparisons; offers wallpaper and misconception CSV downloads. |
| Rewards | `#rewards` | Displays earned and locked banners and the final-check wallpaper. |

Lesson pages show locked lessons as unavailable. The application also blocks direct access to a locked lesson's visualiser, video, or activity. The quiz and final mastery page perform their own access checks.

## Page details

### Welcome

`src/pages/Welcome.jsx` presents the course introduction, a small inline SVG tree, and the course call to action. It sends a new learner to Lesson 1, a returning learner to their first unmastered lesson, and a learner who has passed the final mastery check to the lecture-ready card.

### Lesson

`src/pages/Lesson.jsx` renders the four lessons from `src/content/lessons.json`. Supported section forms include terminology lists, BST diagrams, step traces, traversal examples, tree-shape comparisons, and comparison cards. Lesson status, progress, navigation, and access are shown with the relevant course state.

### BST visualiser

`src/pages/Visualizer.jsx` is the interactive lab. Learners can enter comma-separated values in insertion order, start from an empty tree, and run insertion, search, pre-order, in-order, or post-order traversal. The page renders the relevant tree snapshot, current/visited nodes, narration, visited path or output, matching pseudocode, and node-count/height statistics.

Playback supports Back, Play/Pause, Next, Reset, and speed cycling (0.5x, 1x, 1.5x, and 2x). Left and right arrow keys step through snapshots unless focus is in a form control. Input is validated with inline error messages. Tree state is immutable in the algorithm engine; a successful insert creates a new tree rather than modifying the original.

### Video and activity

`src/pages/Video.jsx` loads the lesson-specific video metadata. The `VideoEmbed` component embeds YouTube's privacy-enhanced domain and requests English captions by default; a separate link opens the video on YouTube. Playback requires network access and may be restricted by browser, network, or YouTube settings.

`src/pages/TreeBuilder.jsx` selects one of four activities:

| Lesson | Activity component | Practice |
| --- | --- | --- |
| 1 | `TreePartsChallenge` | Identify tree terminology, spot a whole-subtree BST violation, and repair the structure. |
| 2 | `SearchInsertionChallenge` | Follow the comparisons for a search and place the new key at the resulting empty link. |
| 3 | `TraversalChallenge` | Choose a traversal order and build its node-visit sequence. |
| 4 | `ComplexityChallenge` | Compare insertion orders, tree height, average search comparisons, and data-structure choices. |

These are practice activities, not required progression steps. Most sequence placement interaction is shared through `DragSequenceChallenge`, which supports both drag-and-drop and click-to-place, tutoring feedback, reset, and completion handling.

### Quick quiz and mastery check

`src/pages/Quiz.jsx` selects four questions from the current lesson's pool. Learners can select an option, submit it to receive feedback, then move to the next question; submitted answers cannot be changed. Each lesson quiz has three lesson-specific hints that are consumed only when requested and carry over to a retry. First-attempt percentages are retained for the lecture-ready card.

`src/pages/MasteryCheck.jsx` selects one question for each outcome. It records missed outcomes, provides links to lessons covering them, allows unlimited retakes with fresh questions where available, and records the best percentage. Passing is retained across later failed attempts.

### Lecture-ready card and rewards

`src/pages/LectureReady.jsx` requires a passed final mastery check. The card summarises mastered and recently missed outcomes, compares first-attempt lesson quiz performance with the best mastery-check result, and suggests questions to bring to the lecture. It can download an SVG wallpaper and export recorded misconception hits as CSV for a lecturer.

`src/pages/Rewards.jsx` displays the four lesson banners and final wallpaper as earned or locked. Lesson banners are earned by passing their lesson quizzes; the wallpaper is earned by passing the final mastery check. Reward artwork is generated as SVG by `src/components/rewardArt.js`, not loaded from image assets.

## Design and instructional approach

### Instructional design

The course is organised around explicit outcomes and uses a sequence of explanation, worked examples, guided practice, feedback, and assessment. Lesson content aims to connect each concept to a visible tree or trace. Quizzes sample the lesson's outcomes, while the final check samples all ten outcomes. Wrong answer options are tagged with likely misconceptions so feedback can address the particular mix-up rather than only mark an answer incorrect.

The app uses progressive scaffolding: each lesson quiz provides three lesson-specific hints that decrease only when requested, and a failed quiz leads to a worked example and a lesson review route. Learners select and submit an answer to receive feedback; after submission, the answer is locked until they move to the next question. Optional videos and activities provide alternate ways to practise without obscuring the quiz-based mastery requirement.

### Wireframes and visual design

The UI wireframes are in the sibling workspace folder `../data/wireframes/`. They are visual guides for screen hierarchy and the learner journey, not a separate runtime dependency:

- [Page 1](../data/wireframes/page%201.png)
- [Page 2](../data/wireframes/page%202.png)
- [Page 3](../data/wireframes/page%203.png)
- [Page 4](../data/wireframes/page%204.png)
- [Page 5](../data/wireframes/page%205.png)
- [Page 6](../data/wireframes/page%206.png)
- [Page 7](../data/wireframes/page%207.png)

The implementation follows those guides while adapting the screens for live content, interaction, and responsive use. The default visual theme uses warm cream surfaces, forest-green text and borders, amber emphasis, rounded panels, and serif headings. DM Sans, DM Mono, and Playfair Display are requested from Google Fonts, with system fallbacks. Lesson banner rewards provide optional green, blue, pink, and amber themes; the selected theme applies across routes.

### Accessibility and responsive behaviour

The UI uses semantic headings, landmarks, labels, status regions, and accessible names for interactive tree and quiz content. Keyboard users can operate standard controls, use arrow keys to step the visualiser, and press Escape to close the course menu or reset dialog. The activity sequence also supports click-to-place as an alternative to drag-and-drop. Focus indicators, progress values, feedback states, and selected states provide context beyond colour alone.

The saved **Reduce motion** setting adds a root CSS class, and the stylesheet also honours the operating system's reduced-motion preference. The app layout is responsive down to narrow mobile widths; browser checks are recorded in `changes.md`.

## Technology and runtime

- **React 18** (`react`, `react-dom`) renders the pages and reusable components.
- **Vite 8** (`vite`, `@vitejs/plugin-react`) provides the development server and production bundler.
- **JavaScript ES modules and JSX** implement the engine, route selection, content rendering, and interaction logic; there is no TypeScript or backend API.
- **CSS** provides the visual system and responsive layouts. The global stylesheet is imported once from `src/main.jsx`.
- **JSON** keeps lessons, questions, outcomes, misconceptions, video metadata, and rewards separate from rendering code.
- **Vitest 5** runs the unit and content tests.
- **Browser `localStorage`** stores course state locally under `cos212-bst-tutor-state-v1`. Progress is not synchronised to another browser or device.
- **YouTube** and **Google Fonts** are external resources; the app's local pages and core tree engine do not require a backend.

The HTML entry point is `index.html`; `src/main.jsx` mounts the React application in `#root` and wraps it in `StrictMode`.

## Source structure and module responsibilities

### Application and state

| Path | Responsibility |
| --- | --- |
| `src/App.jsx` | Reads the hash route and lesson query, handles hash changes, applies access gates, and selects the page. |
| `src/main.jsx` | Mounts the app and imports the global stylesheet. |
| `src/state/StudentState.jsx` | Owns the student state context, validates saved values on load, persists state, applies the theme/reduced-motion classes, and resets course progress while retaining accessibility preferences. |
| `src/styles/theme.css` | Global design tokens, component/page styles, responsive breakpoints, theme variants, and reduced-motion behaviour. |

### Pages

| Path | Responsibility |
| --- | --- |
| `src/pages/Welcome.jsx` | Landing page and resume-aware course entry. |
| `src/pages/Lesson.jsx` | Data-driven lesson content, mastery progress, lesson access, and learning-resource links. |
| `src/pages/Visualizer.jsx` | Tree construction, operations, step playback, validation, narration, pseudocode, and statistics. |
| `src/pages/Video.jsx` | Lesson-specific video and related practice links. |
| `src/pages/TreeBuilder.jsx` | Selects and frames the activity for a lesson. |
| `src/pages/Quiz.jsx` | Four-question lesson quiz, submit-for-feedback flow, lesson hints, retries, score recording, and lesson mastery. |
| `src/pages/MasteryCheck.jsx` | Ten-outcome final assessment, retakes, and missed-outcome feedback. |
| `src/pages/LectureReady.jsx` | Final outcome/score summary and wallpaper/CSV exports. |
| `src/pages/Rewards.jsx` | Earned/locked reward gallery and wallpaper download. |

### Shared components

| Path | Responsibility |
| --- | --- |
| `src/components/AccessibilityMenu.jsx` | Saved reduced-motion switch. |
| `src/components/AnswerFeedback.jsx` | Correct/incorrect explanation and misconception-specific feedback. |
| `src/components/CourseNavigation.jsx` | Hamburger menu, unlocked lesson/resource links, course tools, settings, and earned-theme selection. |
| `src/components/CourseResetButton.jsx` | Confirmation dialog for resetting the course; cancel keeps progress, reset preserves accessibility preferences. |
| `src/components/DefaultThemeButton.jsx` | Restores the default palette from the rewards gallery. |
| `src/components/HintPanel.jsx` | Provides three lesson-specific hints and the exhausted-hints response. |
| `src/components/LearningHeader.jsx` | Shared course header with navigation, active reward banner, and reset action. |
| `src/components/LessonAccessNotice.jsx` | Explains why a directly requested locked lesson resource is unavailable. |
| `src/components/PlaybackControls.jsx` | Visualiser step navigation, playback, reset, and speed control. |
| `src/components/PseudocodePanel.jsx` | Displays operation pseudocode, active line, and current path/output. |
| `src/components/QuestionCard.jsx` | Displays answer choices and an optional tree diagram. |
| `src/components/TreeControls.jsx` | Tree input, operation selection, value input, validation feedback, and tree statistics. |
| `src/components/TreeView.jsx` | SVG tree layout, edges, nodes, and current/visited visual states. |
| `src/components/VideoEmbed.jsx` | Responsive privacy-enhanced YouTube iframe with captions requested by default. |
| `src/components/rewardArt.js` | Generates banner/wallpaper SVG, data URLs, and browser downloads. |

### Activity components

| Path | Responsibility |
| --- | --- |
| `src/components/activities/DragSequenceChallenge.jsx` | Reusable accessible sequence challenge: drag or click to place, tutor feedback, reset, and completion. |
| `src/components/activities/TreePartsChallenge.jsx` | Tree vocabulary, whole-subtree rule, and tree-repair practice. |
| `src/components/activities/SearchInsertionChallenge.jsx` | Search path and insertion-position practice. |
| `src/components/activities/TraversalChallenge.jsx` | Stepwise pre-order, in-order, and post-order practice. |
| `src/components/activities/ComplexityChallenge.jsx` | Insertion order, tree shape, comparison counts, and structure-choice practice. |

### Algorithm engine

The engine is plain JavaScript with no React imports. Operations return immutable step snapshots, so rendered trees, visited paths, narration, sound cue identifiers, and pseudocode positions stay tied to the same algorithm state.

| Path | Responsibility |
| --- | --- |
| `src/engine/bst.js` | Immutable BST node creation/building, insertion, search, size, height, validity checks, and insert/search pseudocode. Duplicate keys are ignored. |
| `src/engine/traversals.js` | Pre-order, in-order, and post-order traversal snapshots and output sequences. |
| `src/engine/snapshots.js` | Frozen tree nodes, frozen step snapshots, and sound cue identifiers. |
| `src/engine/learningChallenges.js` | Expected feedback and evaluation for search/insertion, traversal, and tree-complexity challenges. |
| `src/engine/treeChallenge.js` | Tree-placement challenge nodes, slots, and rule-based placement feedback. |

### Assessment and progression logic

| Path | Responsibility |
| --- | --- |
| `src/assessment/quiz.js` | Lesson question selection/scoring and final mastery question selection/scoring. |
| `src/assessment/progress.js` | Lesson unlock checks and returning-student resume route. |
| `src/assessment/rules.js` | Hint budget, pass/fail destination rule, missed outcomes, and outcome-to-lesson mapping. |
| `src/assessment/scoring.js` | Chosen-option misconception lookup and CSV generation for misconception hits. |
| `src/assessment/rewards.js` | Banner assignment, active theme, and reward eligibility. |

### Content data

| Path | Responsibility |
| --- | --- |
| `src/content/lessons.json` | Four lessons: goals, outcomes, duration, introductory copy, and typed content sections. |
| `src/content/questions.json` | Lesson and mastery question bank, outcomes, options, explanations, skill levels, misconception tags, and selection flags. |
| `src/content/outcomes.json` | Learner-facing wording for the ten learning outcomes. |
| `src/content/misconceptions.json` | Misconception labels and targeted feedback referenced by tagged answer options. |
| `src/content/videos.json` | Per-lesson video IDs, titles, and viewing focus. |
| `src/content/rewards.json` | Banner/wallpaper unlock rules, titles, and theme colours. |
| `src/content/quizDiagrams.js` | Tree structures used alongside quiz and mastery questions, including deliberately invalid trees. |

### Project configuration and static assets

| Path | Responsibility |
| --- | --- |
| `index.html` | Vite HTML entry point and React mount element. |
| `package.json` | Project metadata, dependencies, and npm scripts. |
| `package-lock.json` | Locked dependency graph used by reproducible installs and CI. |
| `vite.config.js` | React plugin, Vitest configuration, and GitHub Pages base path (`/cos750-exam/`). |
| `.github/workflows/ci.yml` | Runs install, tests, and production build on pushes to `main` and pull requests. |
| `.github/workflows/deploy.yml` | Manually triggered GitHub Pages build and deployment. |
| `public/sounds/.gitkeep` | Keeps the currently empty sounds directory in the project; no sound files or audio playback are currently wired into the UI. |
| `dist/` | Generated production output from `npm run build`; do not edit it as source. |

## State and persistence

`StudentStateProvider` wraps the application. Its `localStorage` record includes:

- mastered lesson IDs and earned banner IDs;
- quiz attempts, first-attempt scores, and the currently active quiz;
- misconception hits captured from incorrect tagged answers;
- final mastery attempts, pass status, best percentage, missed outcomes, and active check;
- selected banner theme and reduced-motion preference.

The course reset dialog explains what will be cleared. Resetting removes course progress, quiz records, and rewards, returns the learner to Lesson 1, and retains the reduced-motion preference. If browser storage cannot be read or written, the app logs the error and displays a learner-facing warning; progress may then only last for the current visit.

## Design and course reference documents

The project has implementation, instructional-design, software-engineering, and course-material references. These inform the content and design; they are not loaded by the application at runtime.

| Location | Contents |
| --- | --- |
| `docs/ID/COS212_App_Instructional_Design_Document.docx` | Instructional design reference, learning outcomes, and scaffolding requirements. |
| `docs/ID/genai-prompt-log.md` | Record of generative-AI use for learner-facing content and code. |
| `docs/SE/COS212 App Software Engineering Document BST.docx` | Software engineering requirements and implementation reference. |
| `docs/sprint-log.md` | Dated development notes. |
| `docs/presentation/Binary Search Trees – COS212 App Presentation.pptx` | Project presentation and visual design reference. |
| `../data/materials/data.md` | Source reading material for the four lessons. |
| `../data/materials/objectives.md` | Learning outcomes O1–O10 and lesson mapping. |
| `../data/materials/quiz-questions.md` | Assessment question source and alignment reference. |
| `../data/wireframes/page 1.png`–`page 7.png` | UI wireframes used as layout and journey guides. |

When adapting course materials, keep the content data, assessment alignment, relevant reference documents, and this README consistent.

## Tests and quality checks

Automated tests are in `tests/` and run in Node through Vitest:

| Test file | Coverage |
| --- | --- |
| `tests/engine.test.js` | BST operations, edge cases, and traversal output/snapshots. |
| `tests/learningChallenges.test.js` | Challenge feedback and analysis rules. |
| `tests/treeChallenge.test.js` | Tree placement validation and feedback. |
| `tests/quiz.test.js` | Question selection, outcome coverage, scoring, and mastery assessment rules. |
| `tests/rules.test.js` | Hint budget, pass/fail routing, and outcome review mapping. |
| `tests/scoring.test.js` | Misconception lookup and CSV formatting. |
| `tests/mastery-and-rewards.test.js` | Mastery persistence and reward eligibility/retention. |
| `tests/content.test.js` | Content shape and alignment checks. |
| `tests/se-document-cases.test.js` | Cases traced to the software-engineering requirements. |

Run the same unit tests and production build used by CI:

```powershell
npm test
npm run build
```

GitHub Actions workflow `.github/workflows/ci.yml` runs `npm ci`, the tests, and the build for pushes to `main` and pull requests.

## Local development

### Requirements

- Node.js **20.19+** or **22.12+** (Vite requirement; CI uses Node 22)
- npm

### Install and run

Run these commands from the `cos750-exam` project directory:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite. The app uses hash routes, so pages can be opened through the course navigation or directly with the route examples above.

### Available npm scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm test` | Run the Vitest suite once. |
| `npm run test:watch` | Run Vitest in watch mode. |
| `npm run build` | Create the production bundle in `dist/`. |
| `npm run preview` | Serve the built bundle locally for preview. |

## Deployment

`.github/workflows/deploy.yml` publishes the `dist/` build to GitHub Pages when manually started from the GitHub Actions tab. It installs dependencies with `npm ci`, runs tests, builds the app, uploads the Pages artifact, and deploys it. Before the first deployment, configure the repository's Pages source to **GitHub Actions** and ensure Pages is available for that repository.

`vite.config.js` sets the base path to `/cos750-exam/`, which must match the published repository path. If the deployment path changes, update the Vite base and verify the production build and deployed routes.

## Known boundaries

- There is no sign-in, backend, database, or cross-device progress sync. Student data stays in the current browser's local storage.
- Videos and Google Fonts are third-party network resources; embed playback and font loading depend on network and browser policy.
- Learner progress and quiz results are study aids, not a remotely verified gradebook.
- The engine handles unique numeric keys for the teaching examples; duplicate insertions do not change the tree.
- A conventional unbalanced BST is used to demonstrate shape-dependent cost; the app does not rebalance trees.
- Snapshot sound cue identifiers are metadata only; no audio playback is currently implemented.
- The deployment workflow is manual, not an automatic production release on every push.

## Evidence log

| date | what we tested | WHo | Findings | change made |
| --- | --- | --- | --- | --- |
| 2026-11-12 | Automated tests and production build for the updated app themes, navigation, settings, and reset confirmation. | Kevin Mbolongwe | 87 tests passed across 9 files and the production build passed; browser checks were not run. | Updated the default palette, added earned-banner themes and theme selection, added the hamburger navigation and settings, and introduced a themed reset confirmation. |
| 2026-11-12 | Targeted tests and production build for lesson hint budgets and quiz answer submission/locking. | Kevin | Both validations were attempted but stopped by environment-level native memory-allocation failures, so no passing result was recorded. | Made hints decrease only when requested and required quiz answers to be submitted before feedback, locking submitted answers until the next question. |
| 2026-11-11 | Automated tests, production build, and browser checks for assessment, rewards, course progression, and responsive layouts. | Ishe Allen Chihobo  | 86 tests passed across 9 files and the build passed; browser checks covered the main assessment, reward, resume, visualiser, and 390px page flows. | Aligned the course with the SE and ID documents, including the final mastery check, misconception feedback, lecture-ready card, rewards, scaffolding, and visualiser fixes. |
| 2026-11-10 | Automated tests, production build, and browser checks for the four lesson-specific videos and activities. | Letlhogonolo Magano | 37 tests passed; the build passed and browser checks exercised all four activities. YouTube embeds could not be verified because external requests were redirected. | Added distinct lesson videos and algorithm-aligned activities with drag-and-drop and click-to-place interactions, feedback, and reset controls. |

## Changelog

See [`changes.md`](./changes.md) for dated feature changes, design updates, and validation notes.
