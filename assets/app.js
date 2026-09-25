/* =====================================================================
 *  APP LOGIC
 *  ---------------------------------------------------------------------
 *  Reads all rules from NAMING_CONFIG (see config.js). No hard-coded
 *  naming rules here — change config.js to change behaviour.
 * ===================================================================== */
(function () {
  "use strict";

  const CFG = window.NAMING_CONFIG;
  const $ = (id) => document.getElementById(id);

  // An explicit choice wins over the browser preference; otherwise CSS handles the preference.
  const themeToggle = $("theme-toggle");
  const themeIcon = themeToggle.querySelector(".theme-icon");
  const themeLabel = themeToggle.querySelector(".theme-label");
  const storedTheme = localStorage.getItem("naming-builder-theme");

  function updateThemeToggle(isDark) {
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeIcon.textContent = isDark ? "☀" : "☾";
    themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
  }

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    updateThemeToggle(theme === "dark");
  }

  const browserThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const hasStoredTheme = storedTheme === "dark" || storedTheme === "light";
  if (hasStoredTheme) {
    applyTheme(storedTheme);
  } else {
    updateThemeToggle(browserThemeQuery.matches);
    browserThemeQuery.addEventListener("change", (event) => {
      if (!localStorage.getItem("naming-builder-theme")) updateThemeToggle(event.matches);
    });
  }
  themeToggle.addEventListener("click", () => {
    const nextTheme = (document.documentElement.dataset.theme || (browserThemeQuery.matches ? "dark" : "light")) === "dark" ? "light" : "dark";
    localStorage.setItem("naming-builder-theme", nextTheme);
    applyTheme(nextTheme);
  });

  // -------------------------------------------------------------------
  // Populate static selects / lists from config
  // -------------------------------------------------------------------
  function populateEnvironments() {
    const sel = $("env");
    CFG.environments.forEach((e) => {
      const opt = document.createElement("option");
      opt.value = e.value;
      opt.textContent = `${e.value}`;
      sel.appendChild(opt);
    });
  }

  function populateRegions() {
    const sel = $("region");
    CFG.regions.forEach((r) => {
      const opt = document.createElement("option");
      opt.value = r.value;
      opt.textContent = `${r.label} (${r.value})`;
      sel.appendChild(opt);
    });
  }

  function populateRules() {
    $("format-display").textContent = CFG.format;
    $("instance-rule-note").textContent = CFG.instanceRule;

    const rulesList = $("general-rules");
    CFG.generalRules.forEach((rule) => {
      const li = document.createElement("li");
      li.textContent = rule;
      rulesList.appendChild(li);
    });

    const body = $("components-body");
    CFG.components.forEach((c) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td><strong>${c.name}</strong></td><td>${c.description}</td><td><code>${c.examples}</code></td>`;
      body.appendChild(tr);
    });
  }

  // -------------------------------------------------------------------
  // Resource-type autocomplete / search
  // -------------------------------------------------------------------
  let selectedResource = null;

  const searchInput = $("resource-search");
  const listEl = $("resource-list");
  let currentItems = [];

  function renderList(query) {
    const q = query.trim().toLowerCase();
    let items = CFG.resources;
    if (q) {
      items = items.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.abbr.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          (r.namespace && r.namespace.toLowerCase().includes(q))
      );
    }
    // Group by category for readability
    currentItems = items;
    listEl.innerHTML = "";
    if (items.length === 0) {
      const li = document.createElement("li");
      li.className = "empty";
      li.textContent = "No matching resources";
      listEl.appendChild(li);
    } else {
      const byCat = {};
      items.forEach((r) => {
        (byCat[r.category] = byCat[r.category] || []).push(r);
      });
      Object.keys(byCat).forEach((cat) => {
        const header = document.createElement("li");
        header.className = "group-header";
        header.textContent = cat;
        listEl.appendChild(header);
        byCat[cat].forEach((r) => {
          const li = document.createElement("li");
          li.className = "item";
          li.innerHTML = `<span class="item-name">${r.name}</span>
                          <span class="item-abbr">${r.abbr}</span>`;
          li.addEventListener("mousedown", (ev) => {
            ev.preventDefault();
            selectResource(r);
          });
          listEl.appendChild(li);
        });
      });
    }
    listEl.hidden = false;
  }

  function selectResource(r) {
    selectedResource = r;
    searchInput.value = `${r.name} (${r.abbr})`;
    $("prefix").value = r.abbr;
    $("prefix-source").textContent = r.namespace
      ? `Microsoft recommended: ${r.abbr} — ${r.namespace}`
      : `Microsoft recommended: ${r.abbr}`;

    $("condensed").checked = CFG.condensedResources.includes(r.abbr);

    listEl.hidden = true;
    update();
  }

  // Resolve from the editable prefix so the UI and generated format agree.
  function syncResourceFields() {
    const prefix = $("prefix").value.trim().toLowerCase();
    const resource = selectedResource && selectedResource.abbr === prefix
      ? selectedResource : CFG.resources.find((r) => r.abbr === prefix);
    const special = Object.hasOwn(CFG.resourceFormats, prefix) ? CFG.resourceFormats[prefix] : null;
    const format = special ? special.format : ($("condensed").checked ? CFG.condensedFormat : CFG.format);
    ["app-name", "region", "instance", "source", "destination"].forEach((id) => {
      const token = id === "app-name" ? "appName" : id;
      const used = format.includes(`{${token}}`);
      $(id + "-field").hidden = !used;
      $(id).disabled = !used;
      $(id).required = used && ["app-name", "source", "destination"].includes(id);
    });
    if (resource && (!resource.multiInstance || CFG.uniqueResources.includes(prefix))) {
      $("instance").disabled = true;
    }
    $("instance-hint").textContent = $("instance").disabled
      ? "Instance number not required for this resource."
      : "Multiple instances possible — add an instance number (10.4).";
    ["condensed", "no-dashes"].forEach((id) => {
      $(id + "-field").hidden = Boolean(special);
      $(id).disabled = Boolean(special);
    });
    $("app-name-label").textContent = special?.appLabel || "App name";
    $("app-name").placeholder = special?.appPlaceholder || "web, api, auth...";
    $("format-display").textContent = format;
    $("instance-rule-note").textContent = special?.note || CFG.instanceRule;
    return resource;
  }

  function renderSuggestions(resource) {
    const section = $("suggestions");
    const list = $("suggestion-list");
    const related = resource && resource.relatedResources;
    list.innerHTML = "";
    if (!related || related.length === 0) {
      section.hidden = true;
      return;
    }

    related
      .map((abbr) => CFG.resources.find((resourceItem) => resourceItem.abbr === abbr))
      .filter(Boolean)
      .forEach((relatedResource) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "suggestion";
        button.innerHTML = `<span>${relatedResource.name}</span><code>${relatedResource.abbr}</code>`;
        button.title = `Use ${relatedResource.name} in the name builder`;
        button.addEventListener("click", () => selectResource(relatedResource));
        list.appendChild(button);
      });
    section.hidden = list.children.length === 0;
  }

  searchInput.addEventListener("focus", () => renderList(searchInput.value));
  searchInput.addEventListener("input", () => {
    selectedResource = null;
    $("prefix").value = "";
    $("prefix-source").textContent = "";
    $("condensed").checked = false;
    update();
    renderList(searchInput.value);
  });
  searchInput.addEventListener("blur", () => {
    // delay so click on item registers
    setTimeout(() => {
      listEl.hidden = true;
    }, 150);
  });
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      listEl.hidden = true;
    }
  });

  // -------------------------------------------------------------------
  // Name generation
  // -------------------------------------------------------------------
  function generate() {
    const prefix = $("prefix").value.trim().toLowerCase();
    const envVal = $("env").value;
    const env = CFG.environments.find((e) => e.value === envVal) || CFG.environments[0];
    const region = $("region").disabled ? "" : $("region").value;
    const appName = $("app-name").disabled ? "" : $("app-name").value.trim().toLowerCase();
    const instance = $("instance").disabled ? "" : $("instance").value.trim();
    const source = $("source").disabled ? "" : $("source").value.trim().toLowerCase();
    const destination = $("destination").disabled ? "" : $("destination").value.trim().toLowerCase();
    const special = Object.hasOwn(CFG.resourceFormats, prefix) ? CFG.resourceFormats[prefix] : null;
    const condensed = !special && $("condensed").checked;
    const noDashes = !special && $("no-dashes").checked;

    const envToken = condensed ? env.condensed : env.short;
    const format = special ? special.format : (condensed ? CFG.condensedFormat : CFG.format);

    // App name abbreviation suggestion for condensed mode (10.5)
    // e.g. 'book' -> 'bk' is a human decision; we just keep the user input.
    const tokens = { resourceType: prefix, env: envToken, appName, region, instance, source, destination };
    let name = format.replace(/\{(\w+)\}/g, (_, token) => tokens[token] ?? "");

    // Collapse stray dashes from empty tokens
    name = name.replace(/-{2,}/g, "-").replace(/^-|-$/g, "");

    if (noDashes) {
      name = name.replace(/-/g, "");
    }

    const azureRule = Object.hasOwn(CFG.azureNameRules, prefix) ? CFG.azureNameRules[prefix] : null;
    const originalName = name;
    const corrections = [];
    if (azureRule) {
      const invalidCharacters = new RegExp(`[^${azureRule.allowed || "a-z0-9"}]`, "g");
      const corrected = name.replace(invalidCharacters, azureRule.replacement).replace(/-{2,}/g, "-");
      if (corrected !== name) corrections.push(`${azureRule.label} names cannot use those characters; removed or replaced them.`);
      name = corrected.replace(/^-+|-+$/g, "");
      if (name.length > 0 && name.length < azureRule.min) corrections.push(`Azure requires at least ${azureRule.min} characters.`);
    }

    return { name, originalName, corrections, azureRule, prefix, env: envToken, appName, region, instance, source, destination, format, condensed, noDashes };
  }

  function validate(result) {
    const warnings = [];
    if (!result.prefix) warnings.push("Resource prefix is empty — pick a resource type.");
    if (result.format.includes("{appName}") && !result.appName) warnings.push(`${$("app-name-label").textContent} is empty.`);
    for (const field of ["source", "destination"]) {
      if (!result.format.includes(`{${field}}`)) continue;
      if (!result[field]) warnings.push(`${field === "source" ? "Source" : "Destination"} VNet is required.`);
      else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result[field])) {
        warnings.push(`${field === "source" ? "Source" : "Destination"} VNet must use letters, numbers, and single separating dashes.`);
      }
    }
    if (result.instance && !/^\d+$/.test(result.instance)) warnings.push("Instance must contain digits only.");
    if (!/^[a-z0-9-]*$/.test(result.name)) {
      warnings.push("Name contains characters other than lowercase letters, digits, and dashes.");
    }
    if (result.name && result.name !== result.name.toLowerCase()) {
      warnings.push("Names must be lowercase (10.3).");
    }
    if (result.condensed && result.name.length > CFG.condensedCharLimit) {
      warnings.push(
        `Condensed name exceeds the ${CFG.condensedCharLimit}-character limit (currently ${result.name.length}). Shorten the app name.`
      );
    }
    if (result.azureRule && (result.name.length < result.azureRule.min || result.name.length > result.azureRule.max || !result.azureRule.pattern.test(result.name))) {
      warnings.push(`${result.azureRule.label}: ${result.azureRule.reason}`);
    }
    return warnings;
  }

  function update() {
    const resource = syncResourceFields();
    const result = generate();
    const warnings = validate(result);
    const isValid = warnings.length === 0 && Boolean(result.name);

    const preview = $("preview");
    preview.textContent = result.name || "—";
    preview.classList.toggle("invalid", !isValid);
    preview.setAttribute("aria-disabled", String(!isValid));
    $("copy-btn").disabled = !isValid;
    $("preview-meta").textContent = [
      result.prefix && `prefix: ${result.prefix}`,
      result.env && `env: ${result.env}`,
      result.appName && `app: ${result.appName}`,
      result.region && `region: ${result.region}`,
      result.instance && `instance: ${result.instance}`,
      result.source && `source: ${result.source}`,
      result.destination && `destination: ${result.destination}`,
      result.condensed && "condensed",
      result.noDashes && "no-dashes",
    ].filter(Boolean).join("  •  ");
    $("azure-rule-note").textContent = result.azureRule
      ? `${result.azureRule.label}: ${result.azureRule.reason}`
      : "";
    renderSuggestions(resource);

    const wEl = $("warnings");
    wEl.innerHTML = "";
    if (isValid) {
      result.corrections.forEach((correction) => {
        const li = document.createElement("li");
        li.className = "corrected";
        li.textContent = `Auto-corrected: ${correction}`;
        wEl.appendChild(li);
      });
      const li = document.createElement("li");
      li.className = "ok";
      li.textContent = result.azureRule ? `${result.azureRule.label} rules satisfied.` : "Name looks good.";
      wEl.appendChild(li);
    } else {
      warnings.forEach((w) => {
        const li = document.createElement("li");
        li.textContent = w;
        wEl.appendChild(li);
      });
    }
  }

  // -------------------------------------------------------------------
  // Wire up
  // -------------------------------------------------------------------
  [
    "source",
    "destination",
    "env",
    "region",
    "app-name",
    "instance",
    "condensed",
    "no-dashes",
  ].forEach((id) => $(id).addEventListener("input", update));

  $("prefix").addEventListener("input", () => {
    selectedResource = null;
    searchInput.value = "";
    $("prefix-source").textContent = "";
    $("condensed").checked = CFG.condensedResources.includes($("prefix").value.trim().toLowerCase());
    update();
  });

  $("copy-btn").addEventListener("click", async () => {
    if ($("copy-btn").disabled) return;
    const name = $("preview").textContent;
    if (!name || name === "—") return;
    try {
      await navigator.clipboard.writeText(name);
      const btn = $("copy-btn");
      const original = btn.textContent;
      btn.textContent = "Copied!";
      setTimeout(() => (btn.textContent = original), 1200);
    } catch {
      alert(name);
    }
  });

  $("reset-btn").addEventListener("click", () => {
    searchInput.value = "";
    $("prefix").value = "";
    $("prefix-source").textContent = "";
    $("app-name").value = "";
    $("source").value = "";
    $("destination").value = "";
    $("instance").value = "";
    $("instance").disabled = false;
    $("instance-hint").textContent = "";
    $("condensed").checked = false;
    $("no-dashes").checked = false;
    selectedResource = null;
    if (CFG.environments[0]) $("env").value = CFG.environments[0].value;
    if (CFG.regions[0]) $("region").value = CFG.regions[0].value;
    update();
  });

  // Init
  populateEnvironments();
  populateRegions();
  populateRules();
  update();
})();
