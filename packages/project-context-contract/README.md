# Project Context Contract

Specialized agents from alfred-agent-devkit are **project-agnostic**. Each consuming repo must provide local context files so agents understand the product without baking secrets into shared packages.

On install (when missing), starters may be written for:

- `CLAUDE.md`
- `.cursor/PROJECT_CONTEXT.md`
- `.cursor/DESIGN_PRINCIPLES.md`
