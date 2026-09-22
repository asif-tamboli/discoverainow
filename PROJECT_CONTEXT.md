# DiscoverAINow.com — Project Context

_Last updated: 2026-09-22. This file is the durable handoff/source of truth for continuing the project across ChatGPT conversations. Newer verified repo state and later dated updates override older notes._

## Product
DiscoverAINow.com is an AI decision-and-utility product. Its simplest explanation is:

> You tell it what you want to do with AI, and it helps you choose the right AI tool, gives you a prompt to use, and helps you check the result.

Core journey:

**Task → right AI → prompt → workflow → result → verify**

Positioning: **Useful AI. Without the noise.**

The site should feel like one connected product, not a directory of unrelated AI pages.

## Product principles
- Revenue is important, but recommendations must not become pay-to-win.
- Original useful utility and decision support beat generic AI news/content.
- Use first-party behavior data to choose what to build.
- Broad AI utility: images, coding, research, writing, productivity, presentations, automation, video. QA/testing is a specialty cluster, not the whole identity.
- Utility over filler.
- Do not fabricate benchmark results, scores, provider outputs, evidence, or usage.
- Most current utilities are deterministic/rule-based. Do not market them as live LLM reasoning.
- Consolidate, prove, and connect before adding more standalone features.

## Infrastructure
- Live site: https://discoverainow.com
- GitHub: asif-tamboli/discoverainow
- Default branch: main
- GitHub main auto-deploys to Cloudflare.
- Cloudflare Worker/service: ancient-recipe-44f0
- Supabase project ID: wtbaosegszmousraqfnw
- Supabase URL: https://wtbaosegszmousraqfnw.supabase.co
- Resend/newsletter infrastructure configured.
- Stack: HTML5, CSS3, vanilla JavaScript, Supabase/PostgreSQL + Edge Functions, Cloudflare Workers, GitHub deployment, Resend, localStorage for Workspace.

## UX direction
Design: clean, minimalist, premium/product/editorial; white/off-white; restrained blue; typography-first; thin borders; generous whitespace; dark-mode ready. Avoid generic decorative AI art and pastel-directory aesthetics.

Primary UX rule:

**Less explaining → more choosing → immediate result → deeper detail only when wanted.**

Also: **Choose → See → Compare → Act**, not **Read → Read → Read → Click**.

A new visitor should understand the product in ~5 seconds, start a task in ~10 seconds, and ideally get useful value in under 2 minutes.

## Homepage — current direction
Homepage was converted to action-first.

Hero:
- “What do you want AI to do?”
- “Tell us the job. We build the path.”
- Promise: Choose a task → Get the AI → Get the prompt → Verify it
- Search CTA: “Show me how”
- Quick tasks: create image, research, debug code, meeting → actions, create slides
- Right-side product demo shows: Best-fit AI → Ready prompt → Workflow → Checks
- Start actions: Which AI? / Build my prompt / Show the steps / Verify my result
- Buyer guides/tools/tutorials are visually secondary.

Important commits from this phase include:
- 4c383dc83a5f1b357f42492fca3d8338549847e9 — action-first homepage HTML
- 523b13ae5c50992125ca48c8f21d408481ba7782 — action-first homepage styles
- aa96ad7cfdfba2a3f95239468e382c87981b2f3b — scan-first homepage copy
- e536971fb8a56f7282826c54c16b94f959301bd1 — scan-first homepage CSS
- 20d127587d41fda45fb68cc65c8dd74ae03dd8ce — content density pass

## Hub pages
Shared action-first Quick Start pattern added to major hubs:
- /tools/
- /prompts/
- /workflows/
- /compare/
- /use-cases/
- /tutorials/
- /benchmarks/

Shared CSS commit: f31feb24d8b56c66b7c3f1502b9b7cf6225a8210.

Hub commits:
- tools: cd2d31660d370847554658b6b412c68f5782bbae
- prompts: 06ec85e62485571b0f8c3869029d9a7fe35d019e
- workflows: 83186100331a2e80f9077c32579bb9d4adf8844a
- compare: c64af694e92432a67b865e49c58e736f1a401f6f
- use-cases: 695f16baccc8cc93cb68ea7ea2394e4190c404f5
- tutorials: 73f9472909092be61c2575c3ba680a1dde1a00b9
- benchmarks: abb1cbbeb38b68306dad0b129181faa24789f44e

Known cleanup: benchmark hub had two quick-start placeholders (research accuracy and code debugging) pointing to #. They should be marked Planned/non-clickable or routed to a request mechanism until real pages exist.

## Core interactive product

### Decision Engine
Homepage deterministic task router in app.js. Detects task plus signals such as privacy, traceability, speed, budget, beginner/low-code and expected output.

Path displayed:
**1 Tool → 2 Prompt → 3 Workflow → 4 Verify**

Commit associated with Decision Engine V2: c33366fc36a4e810403ca416a44a3e4d594912ba.

### Tool Finder
Path: /tool-finder/

Profiles include Cursor, Copilot, Claude Code, ChatGPT, Claude, Gemini, Perplexity, NotebookLM, Midjourney, Runway, Firefly, Gamma, Otter, Lovable, Bolt, Replit, n8n, Make, Zapier.

Latest UX change: made it guided and progressive:
- H1: “What do you want AI to do?”
- Pick a task or describe it.
- Advanced skill/budget/priority/privacy controls moved under “Refine recommendation · Optional”.
- CTA: “Show my best starting point”.

Recent commit: 012fb010be18a75340a503672a6d2438344b97d0.

Tool Finder is deterministic/editorial task-fit guidance, not a measured benchmark or sponsored ranking.

### Prompt Builder
Path: /prompt-builder/

Task types:
- image
- coding
- research
- writing
- marketing

Latest UX:
- H1: “What do you want AI to create?”
- Quick job buttons: Image / Code / Research / Writing / Marketing
- Main required question: “What do you need?”
- Context, output format, tone/style, constraints are hidden under optional progressive disclosure.
- Quick task buttons are wired to existing builder logic.

Recent commits:
- e7f4e7ed1eaf126afabb525b13d9dcb563f83080 — outcome-first HTML
- 66772f1c76d154349a9fc923df4cb959faa40104 — quick-choice JS
- 2e4c7791a1e1d76eb47f1511e2161158a97f0cc1 — guided utility styles

Analytics:
- prompt_builder_generate
- prompt_builder_copy

### Prompt Lab
Path: /prompt-lab/

Cross-tool image prompt comparison for:
- ChatGPT Image
- Midjourney
- Ideogram
- Adobe Firefly
- FLUX

Inputs include image goal, use case, style, priority, aspect ratio, text requirement, revision needs, reference fidelity, constraints.

Important trust change: numeric-looking public scores were replaced by qualitative labels (Excellent / Strong / Good / Conditional). Internal deterministic values remain for ranking/display mechanics.

Commits:
- 14f4e3808cb93502942a83143219245a36b5fc8f
- fd4f93867d9a5a4ad350a644a16946d792042e51

Label: “Editorial tool-fit model — qualitative guidance, not a measured benchmark.”

Analytics:
- prompt_lab_compare
- prompt_lab_copy

### AI Result Judge
Path: /verify-ai-output/

V2 is deterministic lexical/text-overlap analysis, not semantic LLM analysis.

It:
- compares original requirements/source context with AI result
- splits up to 12 requirement statements
- marks Likely addressed / Needs review / Not evident
- shows type-specific human verification checks
- flags simple structural risks
- generates a corrective prompt
- supports Judge → Fix → Judge again

Explicit caveat is required: text overlap is not proof of semantic correctness.

Commits:
- 71511303e52d970419b23364860c7208ec0b926f
- 1d823672eb72c58ad6344ef23d4a29cdd06ff35b

Analytics:
- output_verifier_run
- output_verifier_correction_copy
- output_verifier_copy

Do not build V3/paid semantic analysis until usage demonstrates demand.

## Prompt ecosystem
Paths:
- /prompts/
- /prompt-builder/
- /prompt-lab/
- /prompt-evaluator/
- /prompt-compare/

Treat these as a Prompt Suite rather than adding random prompt utilities:
1. Build
2. Improve
3. Compare
4. Cross-tool

Prompt Suite commit: e03e5225b7013b68136312c7a6f26cb54d273678.

## Other utilities
- /workflow-generator/
- /ai-stack-builder/
- /replace-ai-tool/
- /ai-cost-calculator/
- /workspace/

Strategic assessment:
- Stack Builder: commercially strong
- Replacement Finder: high purchase intent
- Cost Calculator: supporting utility
- Workspace: retention foundation but currently shallow
- Result Judge: strategic differentiator

Authentication/Supabase Auth should remain delayed until repeat usage justifies it.

## Workflows
Hub: /workflows/

Notable paths:
- /workflows/research-to-brief/
- /workflows/meeting-notes-to-actions/
- /workflows/jira-story-to-test-cases/
- /workflows/ai-pr-regression-audit/
- /workflows/persistent-ai-context/
- /guides/ai-presentations/

Workflow Generator: /workflow-generator/

## Use cases
Hub: /use-cases/

Dedicated pages include:
- /use-cases/build-website/
- /use-cases/summarize-pdfs/
- /use-cases/create-ai-video/
- /use-cases/ai-product-photography/
- /use-cases/ai-portraits-reference-fidelity/
- /use-cases/ai-poster-text/
- /use-cases/ai-youtube-thumbnail/

## Organic image-intent cluster
First focused acquisition cluster targets high-intent image jobs rather than mass thin SEO pages.

Commits:
- product photography: 176e77f05b0b86383b93b71ab2ae3e4f35208d9b
- portrait/reference fidelity: 2708f51090b2b79060f17b920879068e4e267614
- poster/text: a226332e424ecb4a46809d432dc13850373f5864
- YouTube thumbnail: ecabde21cc74649da4f2461ff2939b08042cde1f
- image buyer guide integration: 7840b4961528501d50d27df1107fe539763906cb
- sitemap: 0b5d1d9b453ffdfaebc366777bf1036a12d203db

These pages use the loop:
**Define → Choose → Generate → Verify**

Event: image_intent_to_prompt_lab.

Organic strategy:
**Own specific AI tasks in search, then convert search traffic into product users.**

Do not create dozens of pages until data shows which intent converts.

## Benchmarks
Image benchmark protocol:
- /benchmarks/ai-image-generation/

Commit: 954ef553083219d4a5d42d5eb25c29c168f315fd

Planned tools:
- ChatGPT Image
- Midjourney
- Ideogram
- Adobe Firefly
- FLUX

Planned tasks:
1. Product advertisement
2. Text-heavy poster
3. Photorealistic scene
4. Reference fidelity
5. Controlled revision

Dimensions:
- instruction adherence
- text handling
- visual coherence
- reference fidelity
- revision control
- cleanup burden

Critical state: **actual benchmark runs have NOT been performed.** No winner or benchmark score may be claimed until controlled runs and evidence exist.

Need preserve when runs occur:
- outputs
- exact prompt
- tool/model/version
- settings
- run date
- revision attempts
- failure notes
- evaluation evidence

Benchmark hub commit: f35d7bc77482f88f56f5151c711652e26eab83cf.
Prompt Lab bridge: b1071576fecae98f7ec21f5669579d874db85bf5.
Image guide bridge: a22b51c7f25f6d91cbdd328a49c25a918cf39174.
Sitemap: b5b303c42f7dd48974c19488d530d1c657920cae.

## Analytics
Custom first-party analytics use Supabase.

Privacy-conscious context collected:
- anonymous browser/device ID
- session/page activity
- coarse device class
- OS
- browser language
- acquisition/referrer
- UTM source/medium/campaign
- new/return behavior
- landing path
- engagement
- voluntarily submitted search/task intent after basic redaction

Do not intentionally collect/infer sensitive demographics such as age, gender, ethnicity, income, religion, political views, exact address, or precise location.

analytics.js audience-context commit: d07f39601d36eca459e143f4c606beaa0cde03ea.

Redaction currently covers basic email, phone, and US SSN-like patterns but is not comprehensive DLP.

Supabase views:
- public.internal_audience_intelligence
- public.internal_intent_funnel

Relevant events include:
- search
- tool_finder_result
- prompt_builder_generate
- prompt_builder_copy
- prompt_lab_compare
- prompt_lab_copy
- recommendation_click
- output_verifier_run
- output_verifier_correction_copy
- engaged_session
- session_exit
- outbound_click
- image_intent_to_prompt_lab
- benchmark bridge events

track-event deployed ACTIVE; known version at prior checkpoint: 12; verify_jwt=false for public analytics endpoint.

## Analytics snapshot from prior checkpoint
A 30-day query showed:
- page_view 518
- return_pageview 471
- session_start 42
- search 17
- tool_finder_result 4
- prompt_builder_generate 4
- prompt_builder_copy 3
- outbound_click 3
- prompt_evaluator_run 2
- benchmark_to_comparison 2
- tool_click 2
- workflow_open 1
- comparison_open 1

Search terms included:
- image 6
- coding 3
- presentation 3
- ai agents 1
- meeting 1
- tools 1
- research 1

At that checkpoint:
- observed sessions: 45
- anonymous browser/device IDs: 28
- apparent single-page/no-action sessions: 31
- repeat users across multiple sessions: 2
- Result Judge runs: 0
- prompt generations: 4
- prompt copies: 3

Do NOT call 31/45 a definitive bounce rate. Instrumentation cannot perfectly distinguish engaged reading, bots, testing and abandonment.

The unusually high pageview/session depth may contain internal testing, bots/crawlers or repeated instrumentation. Analytics quality/bot/internal filtering remains a priority.

Strongest directional interest cluster at that checkpoint:
**Images → Prompts → Tool discovery → Use cases/workflows → Research/benchmarks**

Do not overinterpret tiny samples.

## Newsletter
Tables:
- newsletter_subscribers
- newsletter_campaigns
- newsletter_sends

Functions:
- newsletter-signup (verify_jwt=false)
- newsletter-unsubscribe (verify_jwt=false)
- send-newsletter (verify_jwt=true)

Resend domain configured and verified. Sender:
Discover AI Now <newsletter@discoverainow.com>

Secrets are stored outside the repo. Never expose or commit them.

No weekly cron intentionally yet.

## Monetization
Preferred model:
**Need → recommendation → workflow → tool → contextual affiliate conversion**

Best commercial moments:
- tool choice
- replacement decision
- stack decision

Future B2B concept:
**AI Stack Audit for Teams**

Avoid:
- early display-ad clutter
- pay-to-win rankings
- sponsored influence over benchmark results
- fake benchmark scores
- generic scraped directories
- generic daily AI news

## Deliberate non-priorities
Do not prioritize yet:
- Workspace V2
- user accounts/authentication
- Result Judge V3 / paid semantic LLM analysis
- more standalone utilities
- mass SEO page generation
- generic AI detector/content-authorship checker

The AI detector idea was explicitly rejected for now.

## Testing state
A regression review was started after the latest Tool Finder/Prompt Builder UX changes.

Code inspected:
- homepage/app.js
- Tool Finder
- Prompt Builder
- Prompt Lab
- Result Judge

Structural wiring looked generally correct in that inspection. The broader regression pass was not completed before the conversation moved on.

Required test journey:
**Homepage task → Tool Finder → recommendation → Prompt Builder → copy prompt → Result Judge → corrective prompt**

Also test:
- Workflow Generator
- Prompt Evaluator
- Prompt A/B Compare
- Stack Builder
- Replacement Finder
- Cost Calculator
- newsletter signup
- dark mode
- responsive/mobile
- broken/dead links
- empty inputs
- copy/reset buttons
- analytics events

Fix reproducible defects directly rather than only reporting them.

## Current roadmap / what to do next
1. **Finish full regression testing before building new features.**
2. Fix benchmark hub placeholder # actions.
3. Improve analytics quality: bot/internal-test filtering and real-vs-engaged visitor distinction.
4. Test the new action-first Tool Finder and Prompt Builder in production behavior.
5. Simplify Result Judge UX next if testing is clean.
6. Simplify Prompt Lab progressively; keep evidence/trust labels.
7. Make the end-to-end journey feel connected: task → recommendation → prompt → workflow → verify.
8. Connect image Tool Finder recommendations to image benchmark protocol with “protocol published / results pending” wording.
9. Perform real image benchmark runs before publishing benchmark conclusions.
10. Build a private funnel/dashboard after analytics reliability improves.
11. Let observed usage choose the next vertical.
12. Retention/Workspace/auth later, after repeat behavior is demonstrated.
13. Add contextual monetization only at proven high-intent decision moments.

## Important files
Core:
- index.html
- styles.css
- content.css
- app.js
- analytics.js
- newsletter.js
- tool-finder.js
- prompt-builder.js
- prompt-lab.js
- output-verifier.js
- workflow-generator.js
- robots.txt
- sitemap.xml

Hubs/utilities:
- tools/index.html
- prompts/index.html
- workflows/index.html
- compare/index.html
- tutorials/index.html
- tool-finder/index.html
- prompt-builder/index.html
- prompt-lab/index.html
- use-cases/index.html
- benchmarks/index.html
- verify-ai-output/index.html
- workflow-generator/index.html
- ai-stack-builder/index.html
- replace-ai-tool/index.html
- ai-cost-calculator/index.html
- workspace/index.html
- prompt-evaluator/index.html
- prompt-compare/index.html

Supabase functions:
- newsletter-signup
- newsletter-unsubscribe
- send-newsletter
- track-event
- ingest-content
- public-feed
- content-opportunities

## Continuation instructions for future ChatGPT sessions
When continuing this project:
1. Read this file first.
2. Inspect current repo state before assuming an older commit still represents production.
3. Treat newer dated repo changes and explicit user decisions as authoritative.
4. Do not revert the action-first design without explicit reason.
5. When the user says “implement”, prefer making the repo change directly through available GitHub/Supabase tools rather than merely describing it.
6. Never fabricate benchmark evidence or claim deterministic tools are live LLM reasoning.
7. Prefer fixing/consolidating existing product paths over adding another feature.
8. Keep the product explanation simple: **tell us the task → get the AI → get the prompt → verify the result.**
