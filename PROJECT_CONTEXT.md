# DiscoverAINow — Project Context

> **Purpose:** Durable handoff/source-of-truth for continuing the DiscoverAINow project in a new ChatGPT conversation.
>
> **State captured:** September 21, 2026, from the current project conversation.
>
> **Precedence rule:** Newer verified repository state and explicitly documented later decisions override older notes in this file. Do not assume a feature is live merely because it appears in a roadmap.

## 1. Product in one sentence

**You tell DiscoverAINow what you want to do with AI; it helps you choose the right AI tool, gives you a prompt and practical path, and helps you check the result.**

Short mental model:

**Your task → Right AI → Right prompt → Workflow → Check the result**

Core thesis:

**DiscoverAINow is an AI decision-and-verification product, not a generic AI directory or AI-news site.**

Primary positioning:

**Useful AI. Without the noise.**

## 2. Product principles

1. Revenue generation.
2. Original, useful content and utilities.
3. Use first-party behavior plus market evidence to decide what to build next.
4. Support broad AI jobs: images, coding, research, writing, productivity, presentations, automation, video, etc.
5. QA/testing is a specialty cluster, not the entire identity.
6. Utility over filler.
7. Do not fabricate benchmark evidence, scores, results, or tool capabilities.
8. Recommendations should not become pay-to-win.
9. Prefer integration and proof over adding more standalone utilities.
10. **Less explaining → more choosing → immediate result → deeper detail only when wanted.**
11. Simple by default; advanced controls through progressive disclosure.
12. Do not market deterministic/rule-based utilities as if a live LLM reasons over every interaction.

## 3. Infrastructure

- Domain: **discoverainow.com**
- Production: **https://discoverainow.com**
- GitHub: **asif-tamboli/discoverainow**
- Main branch: **main**
- Cloudflare domain/DNS
- Cloudflare Worker/service: **ancient-recipe-44f0**
- GitHub main → Cloudflare auto-deploy is configured.
- Supabase project ID: **wtbaosegszmousraqfnw**
- Supabase URL: **https://wtbaosegszmousraqfnw.supabase.co**
- Resend domain for newsletter is configured/verified.
- Sender: **Discover AI Now <newsletter@discoverainow.com>**

Tech stack:
- HTML5
- CSS3
- Vanilla JavaScript
- Supabase/PostgreSQL
- Supabase Edge Functions
- Cloudflare Workers
- GitHub
- Resend
- localStorage for Workspace

## 4. UX/design direction

Keep the current visual identity:
- clean
- minimalist
- premium/product/editorial
- white/off-white surfaces
- restrained blue accent
- typography-first
- subtle borders
- generous but controlled whitespace
- simple functional icons
- dark-mode ready
- responsive

Avoid:
- pastel directory clutter
- generic decorative AI artwork
- “AI-generated-looking” visuals
- text walls
- shrinking fonts to solve density
- unexplained product jargon

Desired interaction pattern:

**Choose → See → Compare → Act**

not:

**Read → Read → Read → Click**

User feedback that drove this direction: the site previously felt too text-heavy and required visitors to learn what the portal was before getting value.

## 5. Homepage — current direction

Homepage hero is action-first.

Hero:
- eyebrow: **Tell us the job. We build the path.**
- H1: **What do you want AI to do?**
- promise: **Choose a task → Get the AI → Get the prompt → Verify it**
- search CTA: **Show me how**
- placeholder gives concrete examples.

Quick tasks:
- Create image
- Research
- Debug code
- Meeting → actions
- Create slides

Right-side product preview explains:
- Best-fit AI
- Ready prompt
- Workflow
- Checks

Primary “Start here” actions:
- **CHOOSE — Which AI?** → Tool Finder
- **CREATE — Build my prompt** → Prompt Builder
- **DO — Show the steps** → Workflows
- **CHECK — Verify my result** → Result Judge

Buyer guides/tools/tutorials are intentionally visually secondary.

Key homepage action-first commits:
- `4c383dc83a5f1b357f42492fca3d8338549847e9` — action-first homepage
- `523b13ae5c50992125ca48c8f21d408481ba7782` — visual action-first interactions

Earlier scan-first work:
- `aa96ad7cfdfba2a3f95239468e382c87981b2f3b`
- `e536971fb8a56f7282826c54c16b94f959301bd1`
- `20d127587d41fda45fb68cc65c8dd74ae03dd8ce`

## 6. Action-first hubs

Shared Quick Start interaction added to major hubs. Shared CSS commit:
- `f31feb24d8b56c66b7c3f1502b9b7cf6225a8210`

Hub commits:
- Tools: `cd2d31660d370847554658b6b412c68f5782bbae`
- Prompts: `06ec85e62485571b0f8c3869029d9a7fe35d019e`
- Workflows: `83186100331a2e80f9077c32579bb9d4adf8844a`
- Compare: `c64af694e92432a67b865e49c58e736f1a401f6f`
- Use Cases: `695f16baccc8cc93cb68ea7ea2394e4190c404f5`
- Tutorials: `73f9472909092be61c2575c3ba680a1dde1a00b9`
- Benchmarks: `abb1cbbeb38b68306dad0b129181faa24789f44e`

Known issue to preserve as follow-up:
- Benchmark hub has two placeholder quick-start destinations for Research accuracy and Code debugging that were linked to `#`.
- Do not fabricate benchmark pages/results. Mark these Planned/non-clickable or route to a legitimate request/roadmap destination.

## 7. Tool Finder — latest state

Path: **/tool-finder/**

The Tool Finder was simplified after the action-first redesign.

Current first impression:
**What do you want AI to do?**

Users can describe a task or choose examples. Advanced controls are retained but hidden behind:
**Refine recommendation · Optional**

Advanced dimensions:
- skill
- budget
- priority
- privacy

Primary CTA:
**Show my best starting point**

Latest commits:
- `012fb010be18a75340a503672a6d2438344b97d0` — guided two-step Tool Finder
- CSS for guided utilities: `2e4c7791a1e1d76eb47f1511e2161158a97f0cc1`

Tool Finder is deterministic/rule-based. It classifies tasks and applies transparent constraint weighting. It is not an LLM semantic recommender.

Current tool profiles include:
Cursor, GitHub Copilot, Claude Code, ChatGPT, Claude, Gemini, Perplexity, NotebookLM, Midjourney, Runway, Firefly, Gamma, Otter, Lovable, Bolt, Replit, n8n, Make, Zapier.

Analytics event:
- `tool_finder_result`

## 8. Prompt Builder — latest state

Path: **/prompt-builder/**

Latest interaction:
**What do you want AI to create?**

Quick job choices:
- Image
- Code
- Research
- Writing
- Marketing

Then:
**What do you need?**

Advanced context is hidden under:
**Add context & constraints · Optional**

Advanced fields remain:
- context/source material
- output format
- tone/style
- constraints

Latest commits:
- `e7f4e7ed1eaf126afabb525b13d9dcb563f83080` — outcome-first Prompt Builder
- `66772f1c76d154349a9fc923df4cb959faa40104` — quick-task wiring
- `2e4c7791a1e1d76eb47f1511e2161158a97f0cc1` — shared guided styling

Prompt generation is deterministic template construction, not a live LLM call.

Analytics:
- `prompt_builder_generate`
- `prompt_builder_copy`

## 9. Prompt Lab

Path: **/prompt-lab/**

Purpose:
Cross-tool image prompt comparison/adaptation.

Inputs include:
- image goal
- use case
- style
- priority
- aspect ratio
- text requirement
- revision needs
- reference fidelity
- constraints

Tools:
- ChatGPT Image
- Midjourney
- Ideogram
- Adobe Firefly
- FLUX

Important trust decision:
Numeric-looking public fit scores were replaced by qualitative labels:
- Excellent
- Strong
- Good
- Conditional

Commit:
- `14f4e3808cb93502942a83143219245a36b5fc8f`

Page explicitly labels the system:
**Editorial tool-fit model — qualitative guidance, not a measured benchmark**

Commit:
- `fd4f93867d9a5a4ad350a644a16946d792042e51`

Analytics:
- `prompt_lab_compare`
- `prompt_lab_copy`

Prompt Lab should be simplified visually next, but do not destroy the existing capability.

## 10. AI Result Judge V2

Path: **/verify-ai-output/**

Core question:
**Did the AI actually do what you asked?**

Inputs:
- output type
- original requirement/source context
- AI result

Behavior:
- deterministic lexical/text-overlap requirement review
- splits requirements
- maps likely textual coverage
- surfaces structural risk signals
- provides type-specific human verification checks
- builds a corrective prompt
- loop: **Judge → Fix → Judge again**

Coverage labels:
- Likely addressed
- Needs review
- Not evident

Important disclosure:
This is a deterministic text-overlap review, **not proof of semantic correctness**.

Analytics:
- `output_verifier_run`
- `output_verifier_correction_copy`
- `output_verifier_copy`

V2 implementation commits:
- page: `71511303e52d970419b23364860c7208ec0b926f`
- JS: `1d823672eb72c58ad6344ef23d4a29cdd06ff35b`

Do not build Result Judge V3/paid LLM semantic analysis until usage demonstrates demand.

## 11. Decision Engine V2

Homepage `app.js` contains deterministic task-first routing.

Profiles include:
- documents
- research
- image
- coding
- presentation
- meeting
- automation
- writing
- website

It detects constraints such as:
- privacy-sensitive wording
- evidence/traceability
- speed
- budget
- beginner/low-code
- expected output

Result path:
**1 Tool → 2 Prompt → 3 Workflow → 4 Verify**

Unknown tasks route to:
`/tool-finder/?q=<query>`

Decision Engine commit:
- `c33366fc36a4e810403ca416a44a3e4d594912ba`

Tool Finder query-prefill commit:
- `9939967c659c12793bc79d0cfadb55d46c46489e`

## 12. Connected product architecture

Target user journey:

```text
USER TASK
    ↓
Decision Engine
    ↓
Recommended AI
    ↓
Prompt Builder
    ↓
Workflow
    ↓
AI Result
    ↓
Result Judge
   ↙         ↘
Problems?    Good?
   ↓          ↓
Corrective   Verify
Prompt        ↓
   ↓       Workspace
Try again
    ↓
Benchmark evidence
```

Strategic differentiator:
**Decision intelligence + verification + original evidence.**

The portal should increasingly feel like one connected product, not a collection of pages.

Example:
**Create product photo → recommended image AI → ready prompt → workflow → checks → benchmark evidence**

## 13. Prompt ecosystem

Current:
- `/prompts/`
- `/prompt-builder/`
- `/prompt-lab/`
- `/prompt-evaluator/`
- `/prompt-compare/`

Unified concept: **Prompt Suite**

1. Build → Prompt Builder
2. Improve → Prompt Evaluator
3. Compare → A/B Compare
4. Cross-tool → Prompt Lab

Prompt Suite commit:
- `e03e5225b7013b68136312c7a6f26cb54d273678`

Do not add random prompt utilities without evidence.

## 14. Workflows

Hub: `/workflows/`

Key workflows:
- Research → sourced brief
- Meeting notes → actions
- Research → presentation
- Image creation → usable asset
- Coding → verified change
- Requirement → test coverage
- AI-generated PR → production-risk audit
- Scattered project context → durable AI rules

Pages include:
- `/workflows/research-to-brief/`
- `/workflows/meeting-notes-to-actions/`
- `/workflows/jira-story-to-test-cases/`
- `/workflows/ai-pr-regression-audit/`
- `/workflows/persistent-ai-context/`
- `/guides/ai-presentations/`

Workflow Generator:
- `/workflow-generator/`

## 15. Use cases and organic acquisition

Hub:
- `/use-cases/`

Existing use cases include website/app building, research, presentations, image generation, PDF summaries, meetings, coding/debugging, automation, video, QA/test coverage.

High-intent image acquisition cluster:
- `/use-cases/ai-product-photography/`
- `/use-cases/ai-portraits-reference-fidelity/`
- `/use-cases/ai-poster-text/`
- `/use-cases/ai-youtube-thumbnail/`

Creation commits:
- Product photography: `176e77f05b0b86383b93b71ab2ae3e4f35208d9b`
- Portrait fidelity: `2708f51090b2b79060f17b920879068e4e267614`
- Poster text: `a226332e424ecb4a46809d432dc13850373f5864`
- YouTube thumbnail: `ecabde21cc74649da4f2461ff2939b08042cde1f`

Image buyer guide connected to this cluster:
- `7840b4961528501d50d27df1107fe539763906cb`

Sitemap cluster update:
- `0b5d1d9b453ffdfaebc366777bf1036a12d203db`

Organic philosophy:
**Own specific AI tasks in search, then convert search traffic into product users.**

Do not mass-produce thin SEO pages.

## 16. Benchmark Lab

Image benchmark protocol:
- `/benchmarks/ai-image-generation/`

Commit:
- `954ef553083219d4a5d42d5eb25c29c168f315fd`

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

Critical evidence boundary:
**No benchmark winner or measured result has been published because controlled provider runs have not yet been completed.**

Never fabricate benchmark outputs.

For a real benchmark preserve:
- generated output
- exact prompt
- tool/model/version
- settings
- run date
- revision attempts
- failure notes
- evaluation evidence

Benchmark hub status commit:
- `f35d7bc77482f88f56f5151c711652e26eab83cf`

Prompt Lab evidence bridge:
- `b1071576fecae98f7ec21f5669579d874db85bf5`

Image guide bridge:
- `a22b51c7f25f6d91cbdd328a49c25a918cf39174`

## 17. Buyer guides / comparisons

Existing:
- `/compare/`
- `/best/ai-research-tools/`
- `/best/ai-image-generators/`
- `/best/ai-coding-tools/`
- `/best/ai-video-tools/`
- `/best/ai-coding-assistants-for-test-engineers/`
- `/best/ai-tools-for-qa-automation/`
- `/comparisons/chatgpt-vs-claude-vs-gemini-qa/`

Principle:
Buyer guides should be decision-first:
- summary
- tradeoffs
- practical trial
- internal route to workflow/prompt
- evidence boundary
- newsletter

## 18. Tools

Hub: `/tools/`

Internal pages include:
- Cursor
- GitHub Copilot
- Claude Code
- Perplexity
- NotebookLM
- Midjourney
- ChatGPT
- Claude
- Gemini

Homepage uses recognizable favicons/logos for selected tools.

Logo commits:
- `544c9cc52149dbcf17521c13be1f22907568aa32`
- `6fc2192b0615ef9ce9a9eec1c230fb6e9e437a53`

## 19. Other utilities

Current:
- `/ai-stack-builder/`
- `/replace-ai-tool/`
- `/ai-cost-calculator/`
- `/workspace/`
- `/workflow-generator/`
- `/verify-ai-output/`

Commercial assessment:
- AI Stack Builder: strong commercial intent
- Replacement Finder: strong commercial intent
- Cost Calculator: supporting utility
- Workspace: retention foundation but currently shallow
- Result Judge: strategic differentiation

Workspace:
- localStorage
- no account required
- noindex

Authentication decision:
**Delay accounts/Supabase Auth until repeat behavior justifies it.**

## 20. Analytics — current architecture

Custom first-party analytics uses Supabase.

Audience context added:
- device class
- OS
- browser language
- acquisition/referrer source
- UTM source
- UTM medium
- UTM campaign
- landing path
- engagement
- session exit
- voluntarily entered task/search intent with basic redaction

Do not intentionally collect/infer sensitive demographics such as race, religion, political views, exact address, etc.

Basic free-text redaction handles obvious email, phone and U.S. SSN-like patterns, but it is not comprehensive DLP.

Audience analytics commit:
- `d07f39601d36eca459e143f4c606beaa0cde03ea`

Intent capture:
- Decision Engine: `0053a649444c43cea3a7eb8f24c226d8afc3efbe`
- Prompt Builder: `28499ba6bd4eb49d23b8f7757a61dc7c7b8751d7`

Engagement/exit tracking:
- `4b35a25511751100846f1f4774b3cd1e5851d212`

Server allowlist expansion:
- `55ae44994678c8cfca53101ac340fbf5e1c928c8`
- image intent event later added in `50556f4a2d99bb61beb942df7b1997a3d68f05dc`

Relevant events include:
- page_view
- return_pageview
- session_start
- search
- tool_finder_result
- prompt_builder_generate
- prompt_builder_copy
- prompt_lab_compare
- prompt_lab_copy
- recommendation_click
- engaged_session
- session_exit
- output_verifier_run
- output_verifier_correction_copy
- outbound_click
- image_intent_to_prompt_lab
- benchmark bridge events

Supabase views:
- `public.internal_audience_intelligence`
- `public.internal_intent_funnel`

Disclosure page:
- `fe64f09e9ddc62dfa4620a38dcbc1058b8a98992`

## 21. Analytics snapshot used for roadmap decisions

A prior 30-day query showed:
- page_view: 518
- return_pageview: 471
- session_start: 42
- search: 17
- tool_finder_result: 4
- prompt_builder_generate: 4
- prompt_builder_copy: 3
- outbound_click: 3
- prompt_evaluator_run: 2
- benchmark_to_comparison: 2
- tool_click: 2
- several other low-volume actions

Tracked search terms:
- image: 6
- coding: 3
- presentation: 3
- AI agents: 1
- meeting: 1
- tools: 1
- research: 1
- one empty query

Observed sessions: 45
Anonymous browser/device IDs: 28
Repeat IDs with multiple sessions: 2
Result Judge runs in that snapshot: 0
Prompt generations: 4
Prompt copies: 3

Interpretation:
- sample is small
- anonymous ID ≠ guaranteed unique human
- page-view depth looked unusually high and may include internal testing/bots/repeated instrumentation
- do not call the single-page number a definitive bounce rate
- image intent was the strongest visible first-party cluster
- do not over-invest in retention/auth or Result Judge V3 yet

A recent 7-day-style query also produced approximately:
- 28 anonymous users/devices
- 45 sessions
- 518 page views
- 46 tracked actions

Again: do not treat these as clean human-only metrics until bot/internal-test filtering is improved.

## 22. Newsletter

Tables:
- `newsletter_subscribers`
- `newsletter_campaigns`
- `newsletter_sends`

Functions:
- `newsletter-signup` — public
- `newsletter-unsubscribe` — public
- `send-newsletter` — authenticated

Resend secrets are configured server-side.

Never expose or commit API keys/secrets.

No weekly cron was intentionally enabled at the captured state.

## 23. Supabase event function

`track-event` was deployed ACTIVE, version 12 at the captured state.

Known function ID:
`cda1e7f0-0516-46d2-8f88-3ed235982108`

Public analytics endpoint configuration retained `verify_jwt=false`.

## 24. Tutorials

`/tutorials/` prefers official vendor learning sources such as:
- OpenAI Academy
- Anthropic docs
- Gemini prompting resources
- Midjourney docs
- Runway Academy
- Cursor Learn
- GitHub Copilot docs

Future direction:
Organize around user outcomes/tasks rather than becoming a vendor-link directory.

## 25. Monetization

Best model:
**Need → recommendation → workflow → tool → contextual affiliate conversion**

Natural commercial moments:
- tool choice
- replacement decision
- stack decision

Potential future B2B:
**AI Stack Audit for Teams**

Avoid:
- early display-ad clutter
- fake rankings
- sponsored benchmark winners
- affiliate economics controlling recommendations
- generic scraped directories
- generic daily AI news

## 26. Things explicitly not to build / not to prioritize now

Do not prioritize:
- Workspace V2
- authentication/Supabase Auth
- Result Judge V3
- paid semantic LLM analysis without usage evidence
- another standalone utility
- mass thin SEO pages
- AI authorship/content detector

The AI detector idea was explicitly rejected earlier. Do not reintroduce it unless the product owner revisits the decision.

## 27. Responsive/readability safeguards

Responsive/readability work:
- `641990eb502e07e86244412d75b449ab2b63d3dd`
- `bca21a6f09edaeee62294e510d0d13fc817abedf`

These addressed:
- mobile horizontal cropping
- Prompt Lab compression
- small form/comparison fonts
- responsive Prompt Lab card layouts
- wrapping/width protections

Do not regress these fixes.

## 28. QA/testing status at handoff

A regression/testing pass was started after the latest Tool Finder and Prompt Builder changes.

Code inspection covered at least:
- homepage / Decision Engine
- Tool Finder
- Prompt Builder
- Prompt Lab
- Result Judge

At the point this context was created, a complete browser-level end-to-end regression report had **not yet been completed**.

Important next QA path:

**Homepage task → Tool Finder → recommendation → Prompt Builder → copy prompt → Result Judge → corrective prompt**

Then cover:
- Workflow Generator
- Prompt Evaluator
- Prompt A/B Compare
- Stack Builder
- Replacement Finder
- Cost Calculator
- newsletter signup
- mobile/responsive behavior
- broken links
- empty inputs
- copy buttons
- reset buttons
- analytics events

When a reproducible defect is found, fix it directly in the repository and record:
- test
- expected
- actual
- root cause
- fix
- regression result

Do not claim browser/E2E validation when only static code inspection was performed.

## 29. Immediate roadmap

Current recommended sequence:

1. **Finish regression testing before adding new features.**
2. Fix any defects discovered in the connected core journey.
3. Fix benchmark hub placeholder `#` actions.
4. Improve analytics quality:
   - internal/test traffic filtering
   - bot filtering where feasible
   - genuine visitor vs engaged visitor vs conversion reporting
5. Simplify Prompt Lab interaction/results without losing capability.
6. Simplify Result Judge into a fast, visual verification flow.
7. Make Decision Engine result more compact/visual if production behavior supports it.
8. Connect image Tool Finder recommendations to benchmark protocol with honest “protocol/results pending” wording.
9. Perform real controlled image benchmark runs; never fake them.
10. Build a small private analytics/funnel view after data quality improves.
11. Let observed behavior choose the next vertical.
12. Add retention/Workspace/auth only after repeat behavior appears.
13. Add monetization at proven high-intent decision moments.

## 30. Core success criterion

A completely new visitor should be able to:

- understand the product in ~5 seconds
- begin a task in ~10 seconds
- receive useful direction quickly
- move naturally from tool choice → prompt → workflow → verification
- get deeper explanation only when requested

The product should increasingly feel like:

**“Tell us what you want AI to do. We’ll help you choose it, prompt it, use it and check it.”**

## 31. Important working rule for future ChatGPT sessions

When continuing this project:
- read this file first
- inspect the current repository before editing
- treat newer repository state as authoritative
- preserve current theme unless explicitly asked to redesign
- make requested implementation directly when tooling permits
- minimize unnecessary clarification
- never expose secrets
- never fabricate live usage, benchmark results, provider behavior, or test results
- distinguish static code review from actual runtime/browser testing
- prefer improving the connected core journey over adding another feature
