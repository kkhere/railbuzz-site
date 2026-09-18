# RailBuzz public site

Everything in this folder is **published to the open internet** at
<https://railbuzz.in>. Nothing else in the RailBuzz repository is.

It exists because Google Play requires two publicly reachable pages for an app
that creates accounts:

| Page | URL | Used for |
|---|---|---|
| `privacy/index.html` | `https://railbuzz.in/privacy` | Play listing + Data safety form |
| `delete-account/index.html` | `https://railbuzz.in/delete-account` | Data safety → account deletion |

## This folder lives in two repositories

It is tracked in the private RailBuzz repository (its canonical home, alongside
the app) **and** pushed to the public `railbuzz-site` repository, which is what
GitHub Pages actually serves.

That means a change here needs two pushes, and forgetting the second one leaves
the live site silently out of date:

```bash
git -C .. add site && git -C .. commit -m "..." && git -C .. push   # private repo
git add -A && git commit -m "..." && git push                       # published
```

## Why this is a separate repository

The app repository is private, and GitHub Pages does not serve private
repositories on the free plan. Publishing from here also keeps the app source,
the moderation runbook and internal notes out of public view.

## Publishing

```bash
# once, from this folder
git init -b main
git remote add origin https://github.com/kkhere/railbuzz-site.git
git add -A && git commit -m "RailBuzz policy pages"
git push -u origin main
```

Then in that repository: **Settings → Pages → Deploy from a branch → main →
/ (root) → Save**. The `CNAME` file in this folder tells Pages to serve the
site at `railbuzz.in`, so no custom-domain field needs filling in by hand.

Once DNS has propagated, tick **Enforce HTTPS** on the same page. It stays
greyed out until GitHub has issued the certificate, which can take up to an
hour after the records resolve.

## DNS records

Set these at the registrar (GoDaddy → My Products → railbuzz.in → DNS).

Apex domain — four A records, all with host `@`:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

And `www`, so both spellings work:

```
Type: CNAME    Host: www    Value: kkhere.github.io
```

Delete any parked-page A record GoDaddy added at `@` first, or it will fight
these. IPv6 (AAAA) records are optional; GitHub publishes those addresses too
if you want them. Verify the current addresses against GitHub's own docs before
relying on them — they have changed before.

## A note on file names

`.nojekyll` disables GitHub Pages' Jekyll build. These are plain static files
with nothing to compile, and Jekyll silently drops anything whose name starts
with an underscore -- which is how `_style.css` came to 404 and the pages
rendered unstyled. Keep the file, and avoid leading underscores here.

## Before submitting to Play

- **`support@railbuzz.in` must actually exist and be monitored.** It is the
  contact for data requests and for deletion-by-email, and Play reviewers do
  email it. A role address, not a personal one, so it survives you being away.
- Re-read the retention claims in both pages if the data model changes.

## Not here yet

`/.well-known/assetlinks.json`, for Android App Links — the thing that lets a
shared chat-room link open the app instead of a browser. It needs the SHA-256
fingerprint of the certificate Play signs with, which is **not** the upload
certificate, so it can only be written after the first upload to Play Console
(Release → Setup → App signing).
