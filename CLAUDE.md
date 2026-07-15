# Rules

1. Ask, don't assume. If something is unclear, ask before writing a single line. Never make silent assumptions about intent, architecture, or requirements.
2. Don't touch unrelated code. If a file or function is not directly part of the current task, do not modify it, even if you think it could be improved.
3. If you see a clearly better approach, say so before implementing. Explain the tradeoff in 2-4 bullets. If the current request is still reasonable, proceed unless the alternative avoids serious risk or wasted work.
4. Flag uncertainty explicitly. If you are not confident about an approach or technical detail, say so before proceeding. Confidence without certainty causes more damage than admitting a gap.

# Repository

This is a monorepo of small, self-contained tools. Each tool lives in its own top-level folder with its own README, source, and tests.

- Work only inside the tool folder relevant to the current task.
- Do not modify other tools unless explicitly asked.
- Prefer tool-local README and SPEC over guessing behavior.