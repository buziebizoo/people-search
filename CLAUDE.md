@AGENTS.md

## GitHub Authentication (run this first, every session)

Before doing anything, set the authenticated remote so pushes work:

```bash
git remote set-url origin https://<PAT>@github.com/buziebizoo/people-search.git
```

Replace `<PAT>` with the repo's personal access token (stored outside the repo to avoid secret scanning).

## Blog Post Publishing

IMPORTANT: Before writing the post, run the shell command: `date +%Y-%m-%d`
Use the exact output as the post's date field. Never guess or hardcode the date.

Always commit and push blog posts directly to the main branch. Do not create a new branch.
Use: `git push origin main`

### Git credentials setup (do once per session if push fails with 403)

The local proxy may block pushes. If `git push origin main` returns 403, run:

```bash
git config --global credential.helper store
git remote set-url origin https://github.com/buziebizoo/people-search.git
```

Credentials are pre-stored in `~/.git-credentials`. Then push again.
If the remote is ahead, run `git pull origin main --rebase` first.

### Commit author (required — stop hook enforces this)

Before committing, ensure:
```bash
git config user.email noreply@anthropic.com
git config user.name Claude
```

If the tip commit has the wrong author, fix it with:
```bash
git commit --amend --no-edit --reset-author
```

### Blog post process

1. Read `lib/blog.ts` to get all existing slugs and topics.
2. Pick a topic NOT already covered from: online dating safety, people search, background checks, catfishing, reverse phone lookup, verifying identity, dating app safety by state, infidelity, catching a cheater, signs of cheating, checking if someone is married, secret dating profiles, hidden social media accounts.
3. Write 600–800 words, SEO-optimized, targeting long-tail keywords.
4. Add the post to the `BLOG_POSTS` array in `lib/blog.ts` with: slug, title, date (from `date +%Y-%m-%d`), category, excerpt, content (HTML).
5. Commit: `git commit -m "Auto blog post: [title]"`
6. Push: `git push origin main`

### Topics already published (do not repeat)

- how-to-verify-tinder-date
- background-check-hinge-match
- reverse-phone-lookup-guide
- online-dating-safety-tips
- how-to-find-someones-address
- catfishing-how-to-spot-it
- check-sex-offender-registry-before-date
- how-to-verify-bumble-date
- how-to-verify-match-com-date
- background-check-texas-date
- how-to-check-if-someone-is-married
- find-secret-dating-profile
- signs-partner-is-cheating
