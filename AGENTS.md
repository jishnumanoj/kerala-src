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

## Architecture rules
- Cost estimator: admin portal at /admin (under _authenticated, browser client + admin-only RLS via has_role); client page /estimate/$token uses server functions that validate token/expiry before using the admin client — keeps catalog private and links expirable.
- Estimate totals are recalculated server-side on submit from shared src/lib/estimate.ts — admin rates are the source of truth.
