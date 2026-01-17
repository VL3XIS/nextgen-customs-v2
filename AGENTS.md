# AI Agent Context & Rules

## 1. Context Loading
- **Skills Directory**: `.agent/skills/`
- **Workflows Directory**: `.agent/workflows/`
- **Global Rules**: Always adhere to the user's global memory rules (sanity checks, testing, no guessing).

## 2. Skills Usage
This project is equipped with the following skills. **Always** check specific skill instructions in `.agent/skills/<skill_name>/SKILL.md` before performing related tasks.

- **brainstorming**: Use before starting complex features.
- **brand-identity**: **CRITICAL**. YOU MUST READ `resources/design-tokens.json` and `resources/tech-stack.md` inside this skill folder before writing any frontend code.
- **creating-skills**: For generating new agent capabilities.
- **error-handling-patterns**: Reference for robust error logic.
- **planning**: Use for generating implementation plans.
- **scraping-reddit**: For gathering public sentiment.
