# DiscoverAINow.com — Project Context

_Last updated from the primary project conversation: 2026-09-22_

> This document is the handoff/source-of-truth for continuing DiscoverAINow work in another ChatGPT conversation. Newer verified repository state overrides older notes here.

## Growth implementation — September 22, 2026

- Shared task context carries goals and constraints between Home, Tool Finder, Prompt Builder, Prompt Lab, Workflows and Result Judge using session storage. Clear and opt-out controls are included; source documents and AI results are not stored by this feature. Existing form entries win over saved context.
- Outcome feedback now records worked/partly/failed/not tried, optional tool, and an improvement category. It acknowledges only successful HTTP saves and supports retry.
- Two original before/after prompt examples on Summarize PDFs and Build Website show actual deterministic Prompt Builder outputs. They are explicitly not external-provider results or benchmarks; further paid/free model evaluation remains separate work.
- Affiliate configuration is implemented but empty: no approved partner links were available. Activation requires genuine approval, exact HTTPS destination and affiliate URL, and visible commission disclosure. No invented links or revenue claims.
- `private/funnel.py` generates a local aggregate dashboard from an events JSON export or local server-side Supabase credentials. The private folder is excluded from deployment; credentials and reports must never be committed. See `private/README.md`.
- `?traffic=internal` marks the owner’s browser until `?traffic=public` is used. Suspected bots are tagged heuristically. The report filters marked sessions and explicitly identifies unclassified historical traffic. Stage counts show reach, not sequential conversion or revenue.
- Core analytics omit free-text query/goal/intent/prompt/source/output/constraints/message fields and handle blocked storage. No database schema changes or paid dependencies introduced.
- Verification: Node behavior tests and Python dashboard tests are in `tests/`. Browser visual verification and external-provider output benchmarks must not be inferred from these tests.

## Product
DiscoverAINow.com is evolving from a generic AI directory/content site into an **AI decision-and-verification product**.

Simple explanation:
> You tell it what you want to do with AI, and it helps you choose the right AI tool, gives you a prompt to use, and helps you check the result.

Core promise:
**Task → Right AI → Right prompt → Workflow → Verify**

Product thesis:
**DiscoverAINow helps you decide which AI to use, gives you the right way to use it, and shows you how to verify the result.**

Primary priorities:
1. Revenue
2. Original/useful content and utilities
3. Measure first-party behavior and market demand, then adapt
4. Broad AI usefulness; QA/testing is a specialty cluster, not the whole identity
5. Utility over filler
6. Avoid generic/AI-generated-looking design

## Infrastructure
- Live: https://discoverainow.com
- GitHub: asif-tamboli/discoverainow
- Branch: main
- Cloudflare Worker/service: ancient-recipe-44f0
- GitHub → Cloudflare automatic deployment is working
- Supabase project ID: wtbaosegszmousraqfnw
- Supabase URL: https://wtbaosegszmousraqfnw.supabase.co
- Resend newsletter infrastructure configured
- Frontend: HTML5 + CSS3 + vanilla JavaScript
- Backend/data: Supabase/PostgreSQL + Edge Functions
- Hosting: Cloudflare Workers

## Design / UX direction
Keep the existing visual identity:
- clean, minimalist, premium/product/editorial
- white/off-white surfaces
- restrained blue
- typography-first
- subtle borders
- generous whitespace
- simple functional icons
- dark-mode ready
- no decorative AI-art clutter
- no pastel directory aesthetic

UX rule:
**Less explaining → more choosing → immediate result → deeper detail only when wanted.**

Preferred interaction:
**Choose → See → Compare → Act**
not
**Read → Read → Read → Click**

New visitors should understand the portal in ~5 seconds, begin a task in ~10 seconds, and get useful value in under ~2 minutes.

## Homepage — current direction
Homepage is action-first.

Hero:
- eyebrow: “Tell us the job. We build the path.”
- H1: “What do you want AI to do?”
- promise: Choose a task → Get the AI → Get the prompt → Verify it
- search CTA: “Show me how”
- quick tasks include Create image, Research, Debug code, Meeting → actions, Create slides

Right-side preview explains:
1. Best-fit AI
2. Ready prompt
3. Workflow
4. Checks

Start actions:
- CHOOSE — Which AI?
- CREATE — Build my prompt
- DO — Show the steps
- CHECK — Verify my result

Secondary buyer guides/tools/tutorials are visually de-emphasized.

## Hub pages
Action-first Quick Start blocks were added to:
- /tools/
- /prompts/
- /workflows/
- /compare/
- /use-cases/
- /tutorials/
- /benchmarks/

The benchmark hub currently has two planned benchmark choices that historically used placeholder # links (Research accuracy and Code debugging). Do not leave misleading dead interactions; mark planned/non-clickable or route to a legitimate request path.

## Tool Finder — latest state
Path: /tool-finder/

Recently simplified from a configuration-heavy form into a guided interaction.

Current first impression:
**What do you want AI to do?**
“Pick a task or describe it. We’ll show a clear starting point.”

Quick examples:
- Build website
- Generate video
- Summarize PDFs
- Automate work
- Research

Advanced controls are preserved behind:
**Refine recommendation · Optional**

Controls:
- experience level
- budget
- priority
- privacy

CTA:
**Show my best starting point**

Recommendations are deterministic/editorial task-fit guidance, not live-LLM reasoning and not sponsored rankings.

Current profiles include website, video, documents, research, automation, image, presentation, meeting, coding, writing.

## Prompt Builder — latest state
Path: /prompt-builder/

Recently changed to outcome-first progressive disclosure.

Hero:
**What do you want AI to create?**
“Give us the outcome. Add details only when they matter.”

Quick choices:
- Image
- Code
- Research
- Writing
- Marketing

Main question:
**What do you need?**

Optional details are under:
**Add context & constraints · Optional**

Optional inputs:
- context/source material
- output format
- tone/style
- constraints

CTA:
**Build my prompt**

Quick task buttons are wired to the existing task-type select.

Generated result includes tool fit, structured prompt, copy action, and related prompt collection.

## Decision Engine V2
Homepage deterministic task router.

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

Detects contextual signals such as privacy, traceability, speed, budget and low-code preference.

Result path:
**1 Tool → 2 Prompt → 3 Workflow → 4 Verify**

Unknown tasks route to Tool Finder.

Do not describe this as a live LLM semantic recommendation engine.

## Prompt Lab
Path: /prompt-lab/

Cross-tool image prompt comparison for:
- ChatGPT Image
- Midjourney
- Ideogram
- Adobe Firefly
- FLUX

Inputs include image goal, use case, visual style, priority, aspect ratio, visible text, revision needs, reference fidelity and constraints.

Numeric-looking public scores were removed in favor of qualitative labels:
- Excellent
- Strong
- Good
- Conditional

Important label:
**Editorial tool-fit model — qualitative guidance, not a measured benchmark**

Do not imply its rankings are controlled benchmark results.

## AI Result Judge V2
Path: /verify-ai-output/

Purpose:
Compare an AI result against original requirements/source context and identify areas requiring human review.

Current implementation is deterministic lexical/text-overlap analysis, not semantic LLM analysis.

Statuses:
- Likely addressed
- Needs review
- Not evident

It provides type-specific human verification checks and a corrective prompt.

Loop:
**Judge → Fix → Judge again**

Do not claim this proves correctness.

Do not invest heavily in V3/paid semantic analysis until usage demonstrates demand.

## Prompt ecosystem
- /prompts/
- /prompt-builder/
- /prompt-lab/
- /prompt-evaluator/
- /prompt-compare/

Treat these as a unified Prompt Suite rather than adding random prompt utilities.

## Workflows
Hub: /workflows/

Important workflows include:
- Research → sourced brief
- Meeting notes → actions
- Research → presentation
- Image creation → usable asset
- Coding → verified change
- Requirement → test coverage
- AI-generated PR → production-risk audit
- Scattered project context → durable AI rules

Other workflow-related pages:
- /workflows/research-to-brief/
- /workflows/meeting-notes-to-actions/
- /workflows/jira-story-to-test-cases/
- /workflows/ai-pr-regression-audit/
- /workflows/persistent-ai-context/
- /guides/ai-presentations/
- /workflow-generator/

## Use cases
Hub: /use-cases/

Dedicated high-intent image acquisition cluster:
- /use-cases/ai-product-photography/
- /use-cases/ai-portraits-reference-fidelity/
- /use-cases/ai-poster-text/
- /use-cases/ai-youtube-thumbnail/

Also:
- /use-cases/build-website/
- /use-cases/summarize-pdfs/
- /use-cases/create-ai-video/

Image pages use the loop:
**Define → Choose → Generate → Verify**

They must not fabricate benchmark evidence.

## Buyer guides / Compare
Important:
- /compare/
- /best/ai-research-tools/
- /best/ai-image-generators/
- /best/ai-coding-tools/
- /best/ai-video-tools/
- /best/ai-coding-assistants-for-test-engineers/
- /best/ai-tools-for-qa-automation/
- /comparisons/chatgpt-vs-claude-vs-gemini-qa/

Commercial philosophy:
**Need → recommendation → workflow → tool → contextual affiliate conversion**

Affiliate economics must never determine editorial recommendations.

## AI Image Benchmark
Path: /benchmarks/ai-image-generation/

Protocol is published, but controlled benchmark runs have NOT been performed.

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

Evaluation dimensions:
- instruction adherence
- text handling
- visual coherence
- reference fidelity
- revision control
- cleanup burden

Critical rule:
**Never fabricate outputs, scores, winners or benchmark findings.**

When real runs happen preserve:
- outputs
- prompt
- tool/model/version
- settings
- run date
- revision attempts
- failure notes
- evaluation evidence

## Other utilities
Existing:
- /ai-stack-builder/
- /replace-ai-tool/
- /ai-cost-calculator/
- /workspace/
- /workflow-generator/
- /verify-ai-output/

Assessment:
- Stack Builder: commercially strong
- Replacement Finder: strong/high purchase intent
- Cost Calculator: supporting utility
- Workspace: retention foundation but currently shallow
- Result Judge: strategic differentiator

Authentication recommendation remains:
**Delay user accounts/Supabase Auth until the core journey is proven.**

## Analytics
First-party analytics use Supabase events.

Recent 30-day snapshot from the project conversation:
- page_view: 518
- return_pageview: 471
- session_start: 42
- search: 17
- tool_finder_result: 4
- prompt_builder_generate: 4
- prompt_builder_copy: 3
- outbound_click: 3
- prompt_evaluator_run: 2
- tool_click: 2
- workflow_open: 1
- comparison_open: 1

Search terms:
- image: 6
- coding: 3
- presentation: 3
- ai agents: 1
- meeting: 1
- tools: 1
- research: 1
- one empty

Observed sessions: 45
Anonymous browser/device IDs: 28
Repeat users with multiple sessions: 2
Result Judge recorded runs in that snapshot: 0

Caveats:
- anonymous_id is browser/device-based, not a guaranteed human count
- raw traffic may contain internal testing/bots/crawlers
- 31/45 apparent single-page/no-action sessions must not be called a definitive bounce rate
- sample is small

Strongest observed interest cluster:
**Images → Prompts → Tool discovery → Use cases/workflows → Research/benchmarks**

## Analytics instrumentation
analytics.js collects privacy-conscious context:
- device class
- OS
- browser language
- source/referrer
- UTM source/medium/campaign
- landing path
- engagement/session exit

User-entered intent is redacted with basic patterns for email/phone/SSN-style data before analytics where wired.

This is basic pattern redaction, not comprehensive DLP.

Useful events include:
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
- benchmark bridge events
- image_intent_to_prompt_lab

Internal Supabase views:
- public.internal_audience_intelligence
- public.internal_intent_funnel

Next analytics priority:
**filter bots/internal testing and distinguish raw visitors from engaged genuine traffic.**

## Newsletter
Supabase tables:
- newsletter_subscribers
- newsletter_campaigns
- newsletter_sends

Functions:
- newsletter-signup
- newsletter-unsubscribe
- send-newsletter

Resend domain is configured for discoverainow.com.

Sender:
Discover AI Now <newsletter@discoverainow.com>

Do not expose or commit API keys/secrets.
No weekly cron was intentionally scheduled yet.

## SEO / organic strategy
Do not mass-produce thin pages.

Strategy:
**Own specific AI tasks in search, then convert search traffic into product users.**

Current first cluster is high-intent image jobs.

Let measured search/usage/conversion data choose the next vertical.

## Monetization
Preferred:
- contextual affiliate conversion at high-intent decision moments
- replacement decisions
- stack decisions
- tool-choice decisions

Potential B2B:
**AI Stack Audit for Teams**

Avoid:
- early display ads
- pay-to-win rankings
- fake benchmarks
- generic scraped directories
- generic daily AI news
- filler content

Sponsored placement must never alter benchmark findings.

## Important product boundaries
- Most utilities are deterministic/rule-based and do not call an LLM for every interaction.
- Do not market deterministic utilities as live AI reasoning.
- Do not fabricate benchmark results.
- User explicitly decided NOT to add an AI-content/authorship detector; do not revive it unless requested.
- Do not add features indiscriminately.
- Consolidate, prove, connect.
- Do not build Workspace/Auth prematurely.
- Do not shrink fonts to solve text-density problems.

## Current architecture
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
RESULT JUDGE
   ↙         ↘
Problems?    Good?
   ↓          ↓
Corrective   Verify
Prompt        ↓
   ↓       Workspace (later)
Try again
    ↓
Benchmark evidence
```

Strategic differentiator:
**Decision intelligence + verification + original evidence.**

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

## Recent important commits from this project conversation
Action-first homepage:
- 4c383dc83a5f1b357f42492fca3d8338549847e9 — homepage self-explanatory/action-first
- 523b13ae5c50992125ca48c8f21d408481ba7782 — visual action-first homepage interactions

Action-first hubs:
- f31feb24d8b56c66b7c3f1502b9b7cf6225a8210 — shared hub interaction CSS
- cd2d31660d370847554658b6b412c68f5782bbae — tools
- 06ec85e62485571b0f8c3869029d9a7fe35d019e — prompts
- 83186100331a2e80f9077c32579bb9d4adf8844a — workflows
- c64af694e92432a67b865e49c58e736f1a401f6f — compare
- 695f16baccc8cc93cb68ea7ea2394e4190c404f5 — use cases
- 73f9472909092be61c2575c3ba680a1dde1a00b9 — tutorials
- abb1cbbeb38b68306dad0b129181faa24789f44e — benchmarks

Latest core utility simplification:
- 012fb010be18a75340a503672a6d2438344b97d0 — Tool Finder guided two-step interaction
- e7f4e7ed1eaf126afabb525b13d9dcb563f83080 — Prompt Builder outcome-first
- 66772f1c76d154349a9fc923df4cb959faa40104 — Prompt Builder quick task wiring
- 2e4c7791a1e1d76eb47f1511e2161158a97f0cc1 — guided utility CSS

Image organic cluster:
- 176e77f05b0b86383b93b71ab2ae3e4f35208d9b — product photography
- 2708f51090b2b79060f17b920879068e4e267614 — portrait/reference fidelity
- a226332e424ecb4a46809d432dc13850373f5864 — poster/text
- ecabde21cc74649da4f2461ff2939b08042cde1f — YouTube thumbnail
- 7840b4961528501d50d27df1107fe539763906cb — connect image buyer guide
- 0b5d1d9b453ffdfaebc366777bf1036a12d203db — sitemap image cluster

Benchmark:
- 954ef553083219d4a5d42d5eb25c29c168f315fd — image benchmark protocol
- f35d7bc77482f88f56f5151c711652e26eab83cf — benchmark hub status
- b1071576fecae98f7ec21f5669579d874db85bf5 — Prompt Lab evidence bridge
- a22b51c7f25f6d91cbdd328a49c25a918cf39174 — image guide evidence bridge

Result Judge:
- 71511303e52d970419b23364860c7208ec0b926f — Result Judge V2 page
- 1d823672eb72c58ad6344ef23d4a29cdd06ff35b — deterministic judge logic

Analytics:
- d07f39601d36eca459e143f4c606beaa0cde03ea — audience/acquisition context
- 0053a649444c43cea3a7eb8f24c226d8afc3efbe — redacted Decision Engine search intent
- b363008bcf9fa8cf21492f686ccd6a19ffe5ff67 — Tool Finder intent
- 28499ba6bd4eb49d23b8f7757a61dc7c7b8751d7 — Prompt Builder intent
- 50556f4a2d99bb61beb942df7b1997a3d68f05dc — image-intent conversion event

## Current testing status
A regression/testing pass was started after the Tool Finder and Prompt Builder redesign.

Code-level inspection covered:
- homepage/Decision Engine
- Tool Finder
- Prompt Builder
- Prompt Lab
- Result Judge

No comprehensive browser-level end-to-end pass has yet been completed in this conversation.

The critical end-to-end journey to test is:
**Homepage task → Tool Finder → recommendation → Prompt Builder → copy prompt → Result Judge → corrective prompt**

Then test:
- Workflow Generator
- Prompt Evaluator
- Prompt A/B Compare
- Stack Builder
- Replacement Finder
- Cost Calculator
- newsletter
- mobile/responsive behavior
- dark mode
- empty/invalid inputs
- copy/reset buttons
- broken internal links
- analytics events

Fix reproducible defects directly in the repository.

## Immediate roadmap
Do not add another major feature yet.

1. Finish regression/end-to-end testing and fix defects.
2. Verify production deployment after fixes.
3. Fix benchmark hub placeholder interactions.
4. Improve analytics reliability (bot/internal-test filtering).
5. Connect Tool Finder → Prompt Builder → Workflow → Result Judge more tightly so the site feels like one product.
6. Simplify Prompt Lab and Result Judge interactions only where testing/behavior shows friction.
7. Run actual image benchmark experiments; never invent results.
8. Feed real evidence into Tool Finder, Prompt Lab and image buyer guide.
9. Build a private analytics/funnel view after data quality improves.
10. Let actual behavior choose the next content/product vertical.
11. Add retention/auth/Workspace only after repeat use is demonstrated.
12. Add monetization at proven high-intent decision moments.

## Continuation instruction
When starting a new ChatGPT conversation, say:

> Read PROJECT_CONTEXT.md in the asif-tamboli/discoverainow repository and treat it as the project handoff. Inspect the current repository before making changes because newer commits may supersede parts of the document. Continue from the Immediate roadmap and preserve the product/design boundaries documented there.
