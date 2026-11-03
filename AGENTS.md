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

- Use the Shopify Storefront API as the only storefront product and cart source; never retain fabricated catalog rows or invent supplier selling prices.
- Keep verified supplier category references separate from products and fitment tags, because taxonomy is not evidence of vehicle compatibility.
- Hydrate persistent cart state only after mounting to preserve SSR consistency.
