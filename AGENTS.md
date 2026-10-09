<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application architecture
- Keep the public office preview and owner sign-in inline; private reads use authenticated RLS and task execution uses authenticated server functions, so public navigation never grants data access.
- Store each office and its entities under an authenticated owner ID; expanded organizational delegation requires a dedicated protected role table before implementation.
- Keep AI prompts and credentials in server-only modules, use streamed Responses calls, and persist task state and deliverables before displaying real activity.
- Require approval before writing execution and owner verification before completion; restrict this foundation to text planning and composition to avoid unauthorized external actions.
- Keep the avatar-led office scene independent from operational state; illustrative profiles must remain explicitly labeled and never count as real agents.
