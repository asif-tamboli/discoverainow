(() => {
 const examples={
 '/use-cases/summarize-pdfs/':{
  before:'Summarize these PDFs.',
  goal:'Summarize the supplied PDFs for a purchasing decision',
  explanation:'The generated prompt makes source attribution, conflicting evidence and unknowns explicit. Supply the real PDFs and check cited passages yourself.',
  after:`Research this question: Summarize the supplied PDFs for a purchasing decision.

SOURCE / SCOPE
[Provide sources, date range, market, population or scope]

OUTPUT
A sourced brief with facts, disagreements, implications and open questions

RULES
- Separate factual claims from interpretation.
- Preserve a source next to each consequential factual claim when sources are provided.
- Flag stale, conflicting or weak evidence.
- Do not turn uncertainty into certainty.
- Identify what evidence is missing before making a recommendation.

STYLE
clear, neutral and decision-oriented

CONSTRAINTS
Do not invent missing information.`},
 '/use-cases/build-website/':{
  before:'Build me a contact form.',
  goal:'Build an accessible contact form',
  explanation:'The generated prompt asks for a scoped plan and regression checks. Add your stack, fields, validation rules and accessibility requirements before running it; then test the actual form.',
  after:`You are helping with this engineering goal: Build an accessible contact form.

CONTEXT / CODE / ERROR
[Paste code, logs, requirement or stack trace]

FIRST
1. Separate verified observations from hypotheses.
2. Identify missing information that blocks a confident diagnosis.
3. Propose the smallest useful plan before editing code.

IMPLEMENTATION / OUTPUT
Format: reviewable steps with code only where needed
Style: concise and technical

VERIFY
- Explain regression risks.
- Add or identify a test that should fail before the fix and pass after it.
- Do not invent APIs, runtime behavior, repository structure or business rules.

CONSTRAINTS
Do not invent missing information.`}
 };
 const example=examples[location.pathname];if(!example)return;
 const root=document.createElement('section');root.className='worked-example';
 root.innerHTML='<h2>Worked example: a more useful prompt</h2><p class="provenance">Recorded September 22, 2026 using DiscoverAINow’s deterministic Prompt Builder. This is a prompt transformation, not a provider benchmark or a tested final AI answer.</p><h3>Before</h3><pre class="before"></pre><details><summary>After: inspect the generated prompt</summary><pre class="after"></pre></details><p class="explanation"></p><p><a href="/prompt-builder/">Build your own prompt →</a> · <a href="/verify-ai-output/">Check the result →</a></p>';
 root.querySelector('.before').textContent=example.before;
 root.querySelector('.after').textContent=example.after;
 root.querySelector('.explanation').textContent=example.explanation;
 document.querySelector('article')?.append(root);
})();
