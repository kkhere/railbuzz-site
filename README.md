# RailBuzz public site

Everything in this folder is **published to the open internet** at
<https://railbuzz.in>. Nothing else in the RailBuzz repository is.

It started as the two pages Google Play requires for an app that creates
accounts. It is now also where RailBuzz meets India's IT Rules 2021 and DPDP
obligations, which are largely satisfied by publishing.

The design came from Lovable (18 October 2026). The code is ours and is hosted
here, on GitHub Pages; the domain is not connected to Lovable.

| Page text | URL | Used for |
|---|---|---|
| `src/content/terms.html` | `/terms/` | The "user agreement" IT Rules Rule 3(1)(a) requires |
| `src/content/privacy.html` | `/privacy/` | Play listing + Data safety form + DPDP notice |
| `src/content/community-guidelines.html` | `/community-guidelines/` | The "rules" Rule 3(1)(a) requires published |
| `src/content/grievance.html` | `/grievance/` | Rule 3(2) officer + DPDP Rule 14(3) timelines |
| `src/content/delete-account.html` | `/delete-account/` | Data safety → account deletion |
| `src/routes/room.tsx` | `/room/?t=<train>&d=<date>` | Landing page for a shared chat-room link |
| `src/routes/index.tsx` | `/` | Home page, with the "at a glance" charts |

The app links to `/privacy/`, `/terms/`, `/grievance/` and
`/room/?t=…&d=…` with these exact spellings. Keep them working.

## Editing the policies

The policy text lives **verbatim** in `src/content/*.html` and is shown as is.
Edit the words there; never paraphrase them into a component. They are legal
commitments, and copies of them exist in the app.

Change "Last updated" at the top of a page whenever its meaning changes, using
the date the change is **published**.

The home page charts (`src/components/at-a-glance.tsx`) and number cards
(`src/routes/index.tsx`) only show figures already published in these pages.
A retention or complaint-timeline change means updating them too. Never put an
invented statistic there.

## Two things here are copies, and copies drift

**The Community Guidelines are a copy.** The source of truth is
`englishGuidelines` in `SafetyRulesDialog`
(`app/src/main/java/com/example/railbuzz/ui/chat/ChatRoomScreen.kt`), shown to
every passenger on every room entry in seven languages. There is a second
in-app copy in `CommunityGuidelinesDialog`
(`ui/common/PrivacyAndLegalDialogs.kt`). **Editing a rule means editing three
places.**

**The retention and deletion claims are a copy** of what the database actually
does — `purge_expired_chat()`, `purge_deleted_accounts()` and the retention
tiers in `docs/moderation-runbook.md`. A migration that changes retention makes
these pages false, which is worse than them being vague.

## The minimum age is 18, deliberately

Set in `terms.html` §2 and `privacy.html`. DPDP s.9 requires verifiable
parental consent for anyone under 18, and RailBuzz operates no such mechanism.
Changing it means building consent machinery first, not editing a sentence.

## How it is built

TanStack Start, React and Tailwind. GitHub Pages serves files and runs no
server, so the build renders every page to plain HTML ahead of time
(`vite.config.ts`: `nitro: false`, `prerender`). The output is
`dist/client/<page>/index.html`. The pages read fine without JavaScript, which
is what Play reviewers and search engines see.

```bash
npm ci --ignore-scripts
npm run dev        # http://localhost:8080 while editing
npm test
npm run build      # writes dist/client
```

`404.html` is the `/not-found` route, rendered once. `sitemap.xml` and
`robots.txt` are generated and in `public/`.

## Publishing

Pushing `main` publishes. `.github/workflows/pages.yml` tests, builds and
deploys `dist/client` with GitHub Pages, live in about two minutes. Watch it in
the repository's **Actions** tab.

Once, in the repository: **Settings → Pages → Source: GitHub Actions**, and
check that **Custom domain** says `railbuzz.in` with **Enforce HTTPS** ticked.

## This folder lives in two repositories

It is tracked in the private RailBuzz repository (its canonical home, alongside
the app) **and** pushed to the public `railbuzz-site` repository, which is what
GitHub Pages serves. A change here needs two pushes, and forgetting the second
one leaves the live site silently out of date:

```bash
git -C .. add site && git -C .. commit -m "..." && git -C .. push   # private repo
git add -A && git commit -m "..." && git push                       # published
```

The app repository is private, and GitHub Pages does not serve private
repositories on the free plan. Publishing from here also keeps the app source,
the moderation runbook and internal notes out of public view. Nothing secret
belongs in this folder: no keys, and no data about passengers.

## DNS records

At the registrar (GoDaddy → My Products → railbuzz.in → DNS). Apex domain —
four A records, all with host `@`:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

And `www`: `CNAME www → kkhere.github.io`.

The same zone holds mail (Zoho MX, SPF, DMARC), the app's outgoing mail
(`send`) and the admin dashboard (`admin` → Vercel). A "connect your domain"
button from a site builder rewrites records here. Read what it changes first.

## Before submitting to Play

- **`support@railbuzz.in` must actually exist and be monitored.** It is the
  contact for data requests and for deletion-by-email, and Play reviewers do
  email it.
- Re-read the retention claims in both pages if the data model changes.

## Not here yet

`/.well-known/assetlinks.json` (it would go in `public/.well-known/`), for
Android App Links — the thing that lets a shared chat-room link open the app
instead of a browser. It needs the SHA-256 fingerprint of the certificate Play
signs with, which is **not** the upload certificate, so it can only be written
after the first upload to Play Console (Release → Setup → App signing).
