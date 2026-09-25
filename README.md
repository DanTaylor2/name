# Azure Resource Name Builder

A static site that builds Azure resource names following the team naming standard. Deployable to GitHub Pages — no build step, no dependencies.

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

- `resourceFormats` — fixed formats for subscriptions (`sub-{env}-{appName}`) and VNet peerings (`peer-{env}-{region}-{source}-to-{destination}`). Peering shows source and destination fields; fields absent from the active format are hidden and ignored. These fixed formats retain full environment names and dashes.
- `format` / `condensedFormat` — the name templates (reorder tokens freely).
- `environments`, `regions` — allowed values (each environment has a `short` and `condensed` form per §10.5).
- `condensedResources` — abbreviations that use the condensed 15-char format (default: `vm`, `vmss`).
- `condensedCharLimit` — character limit for condensed names.
- `uniqueResources` / per-resource `multiInstance` — whether an instance number applies (§10.4).
- `azureNameRules` — service-specific Azure restrictions, including allowed characters and length limits. The builder auto-corrects unambiguous violations and explains every correction.
- `RESOURCE_RELATIONSHIPS` and `CATEGORY_RELATIONSHIPS` in `assets/config.js` — explicit and fallback resource relationship rules used for one-click companion suggestions.
- `generalRules`, `instanceRule`, `components` — text shown in the UI.
- `resources` — the full Azure abbreviation list, grouped by `category`. Each entry: `{ name, abbr, namespace, category, multiInstance }`.

The Azure abbreviations are sourced from the
[Microsoft CAF resource abbreviations page](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations).
Service restrictions are based on Microsoft's
[Azure resource naming rules and restrictions](https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-name-rules).

## File structure

```
index.html          # UI
assets/config.js    # ALL naming rules + resource abbreviations (edit me)
assets/app.js       # name generation + autocomplete logic
assets/styles.css   # styling
```


## Naming examples

- Subscription: production + workload `avs` → `sub-prod-avs` (no region or instance).
- VNet peering: production + UK South + source `hub` + destination `spoke-avs` → `peer-prod-uks-hub-to-spoke-avs`.
- Standard resources retain the existing format, e.g. `vnet-prod-avs-uks01`.

Both peering endpoints are required. Use VNet names or short identifiers with letters, digits, and separating dashes; input is trimmed and lowercased. Copy stays disabled until the inputs are valid.

## Checks

Run `node --test tests/naming.test.cjs` with Node.js 22 or later. These dependency-free tests execute the actual naming and tagging scripts against a small DOM stub. They cover the fixed formats, required endpoints, switching/reset, copy output, existing resource formats, validation, tag JSON, and theme toggling. They do not replace a visual browser check.
