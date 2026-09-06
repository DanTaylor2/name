(function () {
  "use strict";

  const CFG = window.NAMING_CONFIG;
  const $ = (id) => document.getElementById(id);
  const root = document.documentElement;
  const themeToggle = $("theme-toggle");
  const themeIcon = themeToggle.querySelector(".theme-icon");
  const themeLabel = themeToggle.querySelector(".theme-label");
  const storedTheme = localStorage.getItem("naming-builder-theme");
  const browserThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function updateThemeToggle(isDark) {
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeIcon.textContent = isDark ? "☀" : "☾";
    themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    updateThemeToggle(theme === "dark");
  }

  if (storedTheme === "dark" || storedTheme === "light") {
    applyTheme(storedTheme);
  } else {
    updateThemeToggle(browserThemeQuery.matches);
    browserThemeQuery.addEventListener("change", (event) => {
      if (!localStorage.getItem("naming-builder-theme")) updateThemeToggle(event.matches);
    });
  }

  themeToggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("naming-builder-theme", nextTheme);
    applyTheme(nextTheme);
  });

  const selectedValues = new Map();
  const fields = $("tag-fields");

  function renderFields() {
    CFG.tags.forEach((tag) => {
      const field = document.createElement("div");
      field.className = "tag-field";
      field.innerHTML = `
        <label class="tag-checkbox">
          <input type="checkbox" data-tag-key="${tag.key}" />
          <span><strong>${tag.label}</strong><small>${tag.description}</small></span>
        </label>
        <div class="tag-control" data-control-for="${tag.key}" hidden></div>`;

      const checkbox = field.querySelector("input");
      const control = field.querySelector(".tag-control");
      let input;
      if (tag.values) {
        input = document.createElement("select");
        input.innerHTML = `<option value="">Choose a value...</option>${tag.values.map((value) => `<option value="${value}">${value}</option>`).join("")}`;
      } else {
        input = document.createElement("input");
        input.type = tag.type || "text";
        input.placeholder = tag.hint || "Enter a value";
      }
      input.dataset.tagInput = tag.key;
      control.appendChild(input);
      if (tag.hint) {
        const hint = document.createElement("small");
        hint.className = "hint";
        hint.textContent = tag.hint;
        control.appendChild(hint);
      }

      checkbox.addEventListener("change", () => {
        control.hidden = !checkbox.checked;
        if (!checkbox.checked) {
          input.value = "";
          selectedValues.delete(tag.key);
        }
        updateOutput();
      });
      input.addEventListener("input", () => {
        if (input.value) selectedValues.set(tag.key, input.value);
        else selectedValues.delete(tag.key);
        updateOutput();
      });
      fields.appendChild(field);
    });
  }

  function updateOutput() {
    const output = Object.fromEntries(selectedValues);
    $("tag-json").textContent = JSON.stringify(output, null, 2);
    $("tag-count").textContent = `${selectedValues.size} selected`;
  }

  $("copy-tags-btn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("tag-json").textContent);
      $("copy-status").textContent = "JSON copied to clipboard.";
    } catch {
      $("copy-status").textContent = "Copy unavailable. Select the JSON above manually.";
    }
  });

  $("reset-tags-btn").addEventListener("click", () => {
    selectedValues.clear();
    fields.querySelectorAll("input[type=checkbox]").forEach((checkbox) => {
      checkbox.checked = false;
    });
    fields.querySelectorAll(".tag-control").forEach((control) => {
      control.hidden = true;
    });
    fields.querySelectorAll("[data-tag-input]").forEach((input) => {
      input.value = "";
    });
    $("copy-status").textContent = "";
    updateOutput();
  });

  renderFields();
})();