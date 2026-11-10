# COS212 BST Tutor

COS212 BST Tutor is a browser-based learning application designed to help students understand binary search trees (BSTs), depth-first traversals, insertion/search logic, and tree-shape reasoning. It combines structured lesson content, interactive visualisation, and short mastery checks in a single learning flow that is intended to support both pre-lecture preparation and in-class reinforcement.

The project is built as a lightweight React app with Vite, using plain JavaScript modules and custom CSS for the interface. The app is not only a visual demo; it models the algorithmic steps behind BST behaviour and uses those same step snapshots to drive narration, highlighting, and quiz feedback. This makes the teaching experience coherent: the learner sees the tree, hears the explanation, and follows the same underlying logic in the code engine.

## Project goals

The app is designed around a clear educational goal:

- make BST concepts visible and interactive instead of purely theoretical;
- guide learners through a structured progression rather than a single static page;
- provide activities to reinforce algorithm understanding at multiple levels;
- support self-paced mastery with reminders, retry logic, and lesson locking;
- maintain a consistent learner experience across content pages, videos, practice tasks, and quizzes.

## Technology stack

The application is implemented with the following core technologies:

- React 18 for UI composition and component-driven page architecture.
- Vite for fast frontend development, bundling, and local preview.
- Vanilla JavaScript / ES modules for the algorithm engine and state logic.
- CSS custom properties and a single theme stylesheet for layout, visual consistency, and responsiveness.
- JSON content files for lessons, questions, hints, and supporting materials.
- Vitest for automated testing of engine logic, quiz behaviour, and tree challenge rules.

This stack keeps the app simple and performant while allowing a robust teaching interface with rich interactions.

## Application architecture

The application follows a route-based structure driven by hash navigation in `src/App.jsx`:

- `#welcome` displays the course landing screen.
- `#lesson?lesson=n` shows the selected lesson content page.
- `#visualizer?lesson=n` opens the BST lab and interactive visualiser.
- `#video?lesson=n` shows the lesson-specific explanatory video page.
- `#build-tree?lesson=n` opens the tree-building challenge activity.
- `#quiz?lesson=n` opens the quick mastery quiz for that lesson.

This structure keeps each learning mode separate while preserving a consistent course flow and cross-page navigation. Student progress is stored in browser state so quiz attempts, mastered lessons, and earned rewards persist across sessions.

## Page-by-page overview

### 1. Welcome page

The welcome screen introduces the app and frames the learning experience as a short, self-paced tutor. It includes:

- a welcoming hero section;
- a simple BST illustration as a visual anchor;
- a clear “Start the first lesson” call to action;
- a note that progress is saved in the browser.

This page is intentionally calm and minimal. It reduces cognitive load and makes the learner feel that they are beginning a guided course rather than encountering a raw technical demo.

### 2. Lesson pages

Each lesson page is built around content sections that combine narrative explanation with visual tree diagrams and summary tables. The page structure includes:

- a lesson header and breadcrumb/navigation;
- course progress tracking;
- lesson-specific learning objectives;
- explanatory sections such as definitions, examples, traces, traversal patterns, and tree comparisons;
- action links to the visualiser, video, activity, and quiz.

The lesson content is data-driven from JSON. This keeps information modular and makes it easier to adapt or extend the curriculum without rewriting interface components. The lesson component also checks learner progress and locks content until the required quiz performance has been met.

### 3. BST visualiser

The visualiser is the heart of the app. It combines:

- a tree editor that allows the user to build a BST from input values;
- operation selection for insert/search/traversal actions;
- step-by-step playback controls (back, play/pause, next, reset);
- narration that explains what the algorithm is doing at each step;
- pseudocode highlighting that matches the current operation and snapshot;
- live node statistics such as size and height.

The visualiser uses immutable snapshot data for each algorithm step. This is a key design choice: the tree is not just rendered as a static picture; each state transition is represented as a recorded step that can be replayed, reasoned over, and used to coordinate the narration and pseudocode highlight. This keeps the educational story consistent and traceable.

### 4. Video guidance pages

Each lesson includes a corresponding video-focused page. These pages provide:

- a lesson-specific explanation or support video link;
- page-level context for when to watch the material;
- a structured “try another way” learning approach that complements the main lesson content.

The video pages sit beside the main lesson flow rather than replacing it. They are explicitly optional practice and support different learning preferences. This is an important design choice: the app does not assume every learner needs the same route through the material.

### 5. Tree-building challenge pages

The “Try another way” activity pages are designed to reinforce concepts with active problem solving. They include tasks such as:

- identifying tree parts and repairing invalid BST structure;
- tracing search and insertion paths;
- constructing traversal outputs from a tree;
- comparing insertion orders and evaluating search cost or tree height.

The challenge logic is built from the core engine and includes feedback, reset controls, and completion guidance. This makes the exercises more than static worksheets; they are interactive problem-solving environments connected directly to the underlying data structures.

### 6. Quiz pages

Each lesson ends with a quiz that tests understanding without requiring full course completion. The quiz system includes:

- question selection based on lesson topic;
- feedback on answer correctness;
- hints and retry attempts;
- result scoring and mastery thresholds;
- unlocking of later lessons once the learner passes.

A passing score unlocks the next lesson, while activities and videos remain optional. This helps reinforce a key educational principle: the learner is encouraged to practise, but the required mastery gate is clear and measurable.

## Design approach and UI methods

The project follows a pedagogically-driven UI design process rather than a generic dashboard aesthetic. The visual language is intentionally calm and instructional, with a focus on readability, hierarchy, and learning flow.

### Visual design direction

The styling is defined in `src/styles/theme.css` and uses a consistent palette built around:

- muted green/earth tones for structure and progress cues;
- warm accents for focus, current states, and action elements;
- clear borders and spacing for information separation;
- serif headlines paired with monospace labels to distinguish conceptual content from data/logic cues.

This combination creates a teaching tool that feels academic without becoming visually heavy or cluttered.

### Layout principles

The interface is organised into learning “shells” that allow a consistent page frame across lessons and activities:

- a top-level header with strong brand identity;
- breadcrumb navigation for spatial orientation;
- progress bars to show mastery and completion;
- content panels that isolate reading, interaction, and review tasks;
- responsive layouts that adapt to smaller screens.

The design makes each screen feel part of the same product while still allowing special-purpose pages like the visualiser and quiz to occupy more focused layouts.

### Reusable UI components

The UI is built from reusable components in `src/components/`:

- `LearningHeader.jsx` for consistent page framing and navigation;
- `TreeView.jsx` for BST rendering and node state display;
- `PlaybackControls.jsx` for stepping and animation control;
- `PseudocodePanel.jsx` for code highlighting and algorithm explanation;
- `TreeControls.jsx` for tree input and operation setup;
- `AccessibilityMenu.jsx`, `HintPanel.jsx`, and related components for supportive UX features.

This modular design reduces duplication and keeps the logic and presentation tidy.

### Wireframes as UI guides

The project includes a set of wireframe assets in `data/wireframes/`, which were used as a design guide for the screen flow. These wireframes helped shape the app’s overall structure, particularly for:

- the home screen;
- lesson navigation and content flow;
- the visualiser and tree workbench;
- video and activity transitions;
- quiz and progress-oriented layouts.

Rather than treating the wireframes as static mockups, they informed the actual page composition and content hierarchy. The result is a design that respects the intended user journey while still allowing the interactive logic to become more advanced than the initial placeholders.

## Content and state model

The app’s learning content is separated from the interface logic, which is central to maintainability:

- `src/content/lessons.json` stores the lesson instructional content.
- `src/content/questions.json` stores quiz question data.
- `src/content/hints.json` and `src/content/misconceptions.json` support learner guidance and feedback.
- `src/content/videos.json` stores lesson-specific video metadata.

The learner state is managed through a React context provider and stored in browser storage. This allows the app to remember:

- mastered lessons;
- quiz attempts and earned banners;
- active quiz state;
- course reset behaviour.

This is important for a tutor-like experience: the system behaves more like a learning tool than a one-off demo.

## Engine and algorithm logic

The learning experience rests on a custom algorithm engine in `src/engine/`:

- `bst.js` handles tree creation, insertion, search, size, and height.
- `traversals.js` provides pre-order, in-order, and post-order traversal logic.
- `snapshots.js` stores immutable tree snapshots and step metadata.
- `learningChallenges.js` and `treeChallenge.js` support activity logic and challenge evaluation.

The strongest educational design principle in the project is that the interface and the engine share the same underlying state. This means the narrations, visited sequences, highlighted pseudocode, and tree visuals all derive from the same step metadata. The user is therefore not just looking at a graphic; they are observing the tree algorithm evolve in a consistent and explainable way.

## Testing and validation

The project includes automated tests in `tests/` covering the engine and learning logic. These include:

- BST operations and edge cases;
- quiz scoring and progression rules;
- challenge correctness and decision logic;
- traversal and tree behaviour assertions.

The app also includes build validation through Vite and project scripts for local development and production build checks.

## Intended user experience

The app is intended for students who need to understand BST concepts at a conceptual and operational level. A typical learning session could follow this flow:

1. open the welcome screen;
2. read a lesson and inspect the visual examples;
3. try the BST visualiser to manipulate and replay operations;
4. optionally watch the lesson video or complete a tree-building challenge;
5. take the quick quiz to validate understanding;
6. unlock the next lesson once the mastery threshold is reached.

This structure makes the product feel like a guided study companion rather than a single static prototype.

## Local development

Requirements:

- Node.js 20.19+ or 22.12+
- npm

Run the project locally:

```powershell
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

Useful commands:

```powershell
npm test
npm run build
```

## Summary

COS212 BST Tutor is a full learning workflow built around a small but solid structure: lessons, guided activities, an algorithmic visualiser, and mastery checks. It uses React and Vite for implementation, a custom engine for algorithm logic, and wireframes as design guides to shape an interactive teaching application that is clear, responsive, and educationally focused.

The project is intentionally more than a tree simulation. It is a teaching platform that connects explanation, representation, and algorithmic reasoning into one coherent learning experience.
