# Documentation review: ID and SE documents


The main improvement is to distinguish clearly between **what the team intended or specified** and **what the current prototype actually does**. A few requirements and implementation details are described as completed even though the app differs from them. Updating these passages will make the documents more credible and help the reviewers understand the delivered project.

## Highest-priority corrections

### ID document

1. **Correct the question-bank size (Development, section 5).** The document says there is a bank of “25 questions per lesson.” The app has 25 general-bank entries total (Q1–Q25), not 25 for each lesson. Q5 is marked non-selectable. The selectable counts are 4, 8, 5, and 7 for Lessons 1–4. There are also 10 separate mastery-only questions (M1–M10). Suggested replacement: state the actual counts and distinguish the lesson bank from the mastery set.

2. **Qualify the claim that quiz retakes get fresh questions (sections 4.7.2–4.7.3, 5, and the evidence/assessment descriptions).** Fresh questions are selected only while there are unused questions in that lesson's pool. Lesson 1 has exactly four selectable questions for a four-question quiz, so every attempt uses the same set. The other pools also have limited capacity, and can repeat questions as soon as the remaining unused pool is too small to fill the quiz. Either expand the bank to meet the intended fresh-retry behavior, or describe retakes as using unused questions where available and repeating questions when the pool runs out.

3. **Describe hints as they currently work (sections 4.4, 4.7.3–4.7.4, 4.8, and Appendix B).** The app offers up to three ordered, prewritten hints when the student requests them. It does not currently change hint level based on correct answers, a streak, or a wrong answer. Replace “hints fade as answers improve” and the rule about two correct answers with the implemented behavior, unless that adaptive behavior is added to the app.

4. **Clarify pass-mark configurability (section 4.7.2).** The document says the mastery pass mark is configurable without changing logic. The quick-quiz pass threshold and mastery pass count are currently constants in `src/assessment/quiz.js`, not values editable in a content file. Say that the values are defined in the assessment logic, or move them to configuration if editability is a requirement.

5. **Update the mastery-check retake description.** The app has one fixed mastery question for each outcome. Retaking the check presents the same 10 questions; there are no alternate mastery questions to rotate in. State this plainly or add alternate questions if fresh retakes are intended.

6. **Be precise about audio coverage (sections 4.5 and 4.8).** The general question-bank questions have recordings, but the 10 mastery-only questions do not currently have audio recordings, so they do not show the read-aloud button. Change “a sound button on each question” to identify which questions have recordings, or add recordings for the mastery set. Also verify the accessibility claim about captions/transcripts for the externally hosted videos and describe only what has been checked.

7. **Separate course duration from assessment time (sections 3.3 and 4.2).** The four lesson estimates add up to 24 minutes, while the document estimates 25–30 minutes for the whole self-paced app. Clarify whether that estimate includes only lesson reading/demonstrations or also quizzes, the final mastery check, and optional activities/videos; otherwise give separate estimates.

### SE document

1. **Make the stack table match the checked-in project (section 4.10).** The app uses React, Vite, plain CSS, SVG rendered in React, and Vitest. The current package does not include CSS Modules, Tailwind, dnd-kit, React Testing Library, or ESLint. In particular, change the explanation that ESLint runs in CI: the workflow runs `npm test` and `npm run build`, not linting. Describe the actual drag-and-click/button interaction rather than attributing it to dnd-kit.

2. **Align hint and retry requirements with current behavior (FR12, sections 4.5 and 5, and traceability).** The specification promises fresh retry questions and hints that fade as answers improve. The current app has a finite set of lesson questions and three manually requested ordered hints; it does not adapt hints to answer performance. Record the implemented behavior and any known limits, or identify these as remaining work rather than completed behavior.

3. **Clarify reward application (FR17 and sections 4.7 and 4.8).** Students can select an earned banner/theme and download the earned wallpaper. The app does not set the wallpaper as its own background. Adjust “apply one as the app banner or background” to describe banner/theme selection and wallpaper download separately.

4. **Distinguish targets from verified results (NFR1–NFR5 and Testing Strategy).** Statements such as “under 3 seconds,” works across four browsers, and full keyboard accessibility are measurable targets, not proof by themselves. Add a concise results table with the browsers/devices actually tested, the date and outcome, and any untested items. Keep unverified targets labelled as targets.

5. **Update test evidence before submission.** The ID evidence log contains entries with different test totals and one entry that says validation stopped because of memory-allocation failures. Add the final test/build result and date once the team has rerun them successfully, and retain failed or incomplete runs as such rather than presenting them as passing evidence.

## Specific edits to make, by document

The wording below is a suggested edit, not a request to claim unimplemented behavior. Where an item offers two choices, the documentation owners and developers should first decide whether to update the prototype or describe its current limits.

### ID document: `COS212_App_Instructional_Design_Document.docx`

| Where | Specific change | Suggested wording or content |
|---|---|---|
| **3.3 Context** | Explain what the 25–30-minute estimate includes. The four lesson durations in 4.2 total 24 minutes, before quizzes, the final check, and optional practice/videos. | “The four lesson sections are estimated at 24 minutes in total. Quiz, mastery-check, and optional activity/video time is additional and depends on the student.” Adjust the estimate if the team has timed the full experience. |
| **4.4 Learning theories applied** and **4.6 Motivation** | Remove claims that students predict before a visualiser step is revealed, unless that interaction is implemented. | Describe the current behavior: “The visualiser lets students step through a precomputed operation trace, move backward and forward, and replay it.” If predict-then-reveal remains a design goal, label it a planned enhancement rather than a delivered feature. |
| **4.4 Learning theories applied**, **4.7.3 Routing rule**, **4.7.4 Hint levels**, **4.8 Inclusion**, and **Appendix B** | Replace the answer-adaptive hint claims with the implemented hint behavior. | “Students can request up to three ordered, prewritten hints during a lesson’s quiz/retry sequence. The hints do not currently adapt to correct-answer streaks or change automatically after an incorrect answer.” Update every summary that says hints fade as answers improve. |
| **4.7.2 Quick checks** and **4.7.3 Routing rule** | Explain the limited fresh-question pool and the mastery retake behavior. | “A four-question lesson quiz prefers unused questions on retakes, but repeats questions when fewer than four unused questions remain. The mastery check uses one fixed question per outcome, so a retake repeats the same ten-question set.” |
| **4.7.2 Quick checks** | Remove the claim that the mastery pass mark is configurable without logic changes, unless the code is changed to support that. | “The quick-quiz threshold is 3 of 4 and the mastery threshold is 8 of 10; these values are defined in the assessment logic.” |
| **4.5 Learning styles** and **4.8 Inclusion** | Qualify the claim that every quiz question has read-aloud audio. | “Read-aloud recordings are available for the general lesson question bank. The current mastery-only questions do not have recordings.” Alternatively, add the missing recordings and then document the broader coverage. Confirm YouTube captions/transcripts before describing them as verified accessibility support. |
| **5 Development** | Replace “a bank of 25 questions per lesson” with the actual inventory. | “The content includes 25 general-bank entries (Q1–Q25), of which 24 are selectable for lesson quizzes, plus 10 mastery-only questions (M1–M10). The selectable lesson pools contain 4, 8, 5, and 7 questions respectively.” |
| **7 Evaluation: Evidence log** | Add the final validation run and distinguish successful results from failed or incomplete attempts. | Record the run date, exact test/build commands, pass counts, and any untested manual/browser checks. Do not remove the earlier memory-allocation failure; mark it as an unsuccessful attempt and add the later successful run separately. |
| **Appendix B: Where Each Spec Requirement Is Covered** and **Appendix C: Link to the SE Document’s ID Item Numbers** | Recheck mappings after revising the feature descriptions. | Keep an item marked “covered” only if the cited section describes the delivered feature; otherwise mark it “planned,” “partial,” or “not implemented in this prototype.” |

### SE document: `COS212 App Software Engineering Document BST.docx`

| Where | Specific change | Suggested wording or content |
|---|---|---|
| **3.2 Functional requirements, FR6**; **4.1/4.2 System Design**; **4.4 Playback**; **4.8 Use cases**; **4.9 UI design**; **7 Traceability** | Identify predict-then-reveal as not implemented, or implement it before calling it complete. | If documenting the current prototype: “FR6 (Should): deferred. The visualiser plays a precomputed trace with manual playback controls; it does not pause for a student prediction before revealing a step.” Update the traceability row so it does not claim a test or component covers prediction. |
| **3.2 FR12**, **4.5 Quiz and scaffolding**, **5 Testing Strategy**, and **7 Traceability** | Specify actual retake and hint limits rather than promising a fresh quiz or answer-adaptive hints. | State that the four-question quiz prefers unused items but can repeat them when the remaining pool is too small; Lesson 1 has exactly four selectable questions, so its retake repeats the same set. State that hints are manually requested from a three-hint ordered sequence carried across that quiz/retry sequence, not adjusted from answer performance. |
| **3.2 FR17**, **4.7 Rewards**, and **4.8 Use case summary** | Correct the description of wallpaper behavior. | “Students can select an earned banner/theme in the app and download the earned wallpaper. The wallpaper is not applied as the app background.” |
| **3.3 NFR1–NFR5** and **5 Testing Strategy** | Label performance, browser compatibility, responsive, and accessibility statements as requirements/targets unless there is recorded verification. | Add a short verification table: target, test method/device/browser, date, result, and status (pass/fail/not tested). Keep unverified targets separate from verified results. |
| **4.2 Main components** and **4.10 Technology stack** | Replace proposed tools and component labels with the tools and structure in the delivered code. | Suggested stack entries: JavaScript ES modules; React with Vite; React-rendered SVG; plain CSS; Vitest; GitHub Actions running tests and build; GitHub Pages deployment workflow. The current app does not use dnd-kit, CSS Modules, Tailwind, React Testing Library, or ESLint. Describe its drag-and-click/button alternatives without attributing them to dnd-kit. |
| **4.3 Data design** | Align the Question description with the JSON schema and where content actually lives. | Describe fields such as `id`, `lesson`, `outcome`, `skillLevel`, `stem`, `options`, `correctAnswer`, and `explanation`; note that hints live in a separate content file, and that mastery-only entries are flagged separately. Avoid implying that pass thresholds or question-level hint arrays are editable in the question JSON. |
| **4.5 Quiz and scaffolding** | Correct pass-mark configurability. | “The 75% quick-quiz threshold and 8/10 mastery threshold are constants in the assessment module.” If the team makes them configurable, name the configuration file and update the code/data design accordingly. |
| **4.10 Technology stack: Testing and CI** | Make the CI description verifiable. | “GitHub Actions runs `npm test` and `npm run build` on pushes to `main` and pull requests.” Do not state that CI runs ESLint unless a lint command and dependency are added. |
| **7 Traceability** | Update rows whose requirements are partial or deferred, and point to real tests. | For each requirement, record one of: implemented and tested, implemented but not yet verified, partial, deferred, or out of scope. Link each “tested” claim to the relevant automated test or dated manual-check result. |



