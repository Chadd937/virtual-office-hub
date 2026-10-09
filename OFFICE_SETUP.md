# GetCryptoDomains.com — initial office foundation

## Available now
- Public, clearly labeled architectural office preview with moving, selectable people-like avatars.
- Email/password and Google owner accounts. Email signups require confirmation.
- Owner-scoped saved departments, projects, managers, employees and task records.
- Real model-backed manager planning and employee text composition, using Lovable AI credits.
- Explicit task approval, conditional execution claims, persisted deliverables, and owner review before completion.
- Task audit records, provider run IDs, token counts and failure messages.
- Pause controls block new execution. Already-running requests can finish; their output still requires review.

## Start your company
1. Sign in or create your owner account.
2. Create a department and project.
3. Hire a manager, then an employee reporting to that manager.
4. Give the manager a writing or analysis objective.
5. Review the proposed tasks in Approvals.
6. Approve a task, then select Run employee in Tasks.
7. Review the saved deliverable against its acceptance criteria before marking it complete.

Each registered owner has an isolated workspace. This is not shared company membership or delegated employee login.

## Not implemented or configured
- Cloudflare, GitHub, build runners, Google Play, domain changes and production deployments are **not connected or executable**.
- Cloudflare Pages/Workers hosting of this Lovable app is unsupported. Publish using Lovable, then connect GetCryptoDomains.com through Lovable domain settings. Cloudflare DNS can supply the required domain records after authorization.
- Avatars express presence, not a literal live location or proof of external work. Signed-out people are illustrative preview profiles.
- Background autonomy, durable queues, schedules, bounded retry recovery, task dependencies, workflow editing, code execution and artifacts are later phases. Current employee execution is an owner-triggered request. A disconnected request can leave a running task requiring operational recovery; do not use for long-running jobs.
- Budget hard caps, cost estimation, additional administrative roles, MFA enrollment screens, knowledge retrieval, notifications, release gates, and production security hardening are not yet shipped.
- Provider-reported cost is unknown. Token totals are recorded for successful employee writing, not an all-inclusive billing ledger.
- AI access/credit denials persist as an office block. Recovery requires restoring provider access and an explicit owner recovery action; a dedicated recovery control is not yet implemented.

## Verification performed
- Automated task transition, approval, pause, and provider-block rules.
- Browser checks: preview profile, signed-out hiring gate, department creation, manager and employee hiring, project persistence after reload, manager plan, task approval, employee writing, owner verification, and office pause.
- Desktop and mobile office screenshots, with no horizontal overflow in the mobile check.
- Actual AI Gateway planning and writing calls returned task content and provider-issued run IDs.
- Database linter returned no issues. Dedicated permission tests verify cross-owner insert denial, direct task update denial and anonymous project read denial when test credentials are supplied.

This is a usable vertical slice, not a production-ready autonomous company platform.