# Azure Resource Name Builder

A static site that builds Azure resource names following the team naming standard (see `naming conection.md`). Deployable to GitHub Pages — no build step, no dependencies.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Any static file server works (e.g. `npx serve`).

## Deploy to GitHub Pages

1. Push these files to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select the branch (e.g. `main`) and folder `/root`.
5. Save. The site will be published at `https://<user>.github.io/<repo>/`.

Alternatively, use the **GitHub Actions** deployment workflow for more control.

## Editing the rules

All naming rules live in **`assets/config.js`** — change them there, no other file needs editing:

- `format` / `condensedFormat` — the name templates (reorder tokens freely).
- `environments`, `regions` — allowed values (each environment has a `short` and `condensed` form per §10.5).
- `condensedResources` — abbreviations that use the condensed 15-char format (default: `vm`, `vmss`).
- `condensedCharLimit` — character limit for condensed names.
- `uniqueResources` / per-resource `multiInstance` — whether an instance number applies (§10.4).
- `generalRules`, `instanceRule`, `components` — text shown in the UI.
- `resources` — the full Azure abbreviation list, grouped by `category`. Each entry: `{ name, abbr, namespace, category, multiInstance }`.

The Azure abbreviations are sourced from the
[Microsoft CAF resource abbreviations page](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations).

## File structure

```
index.html          # UI
assets/config.js    # ALL naming rules + resource abbreviations (edit me)
assets/app.js       # name generation + autocomplete logic
assets/styles.css   # styling
```
