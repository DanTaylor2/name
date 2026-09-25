// Dependency-free integration checks: execute the actual scripts with a small DOM stub.
// Run: node --test tests/naming.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');

function app(script = 'app.js', dark = false) {
  class Element {
    constructor() {
      this.value = ''; this.textContent = ''; this.children = []; this.listeners = {};
      this.hidden = false; this.disabled = false; this.checked = false; this.dataset = {};
      this.attrs = {}; this.classes = new Set();
      this.classList = { toggle: (name, on) => on ? this.classes.add(name) : this.classes.delete(name) };
    }
    set innerHTML(value) {
      this.children = []; this.html = value;
      // The tag builder creates a checkbox and control in each field.
      if (value.includes('data-tag-key=')) {
        this.checkbox = new Element(); this.control = new Element(); this.control.hidden = true;
        this.children.push(this.checkbox, this.control);
      }
    }
    get innerHTML() { return this.html; }
    appendChild(el) { this.children.push(el); if (this.tag === 'select' && this.children.length === 1) this.value = el.value; }
    setAttribute(k, v) { this.attrs[k] = v; }
    addEventListener(k, fn) { (this.listeners[k] ||= []).push(fn); }
    querySelector(selector) {
      if (selector === 'input') return this.checkbox;
      if (selector === '.tag-control') return this.control;
      return (this.queries ||= {})[selector] ||= new Element();
    }
    querySelectorAll(selector) {
      if (selector === 'input[type=checkbox]') return this.children.map(e => e.checkbox);
      if (selector === '.tag-control') return this.children.map(e => e.control);
      if (selector === '[data-tag-input]') return this.children.map(e => e.control.children[0]);
      return [];
    }
    async fire(type) { for (const fn of this.listeners[type] || []) await fn({ preventDefault() {} }); }
  }
  const html = fs.readFileSync(path.join(root, script === 'app.js' ? 'index.html' : 'tagging.html'), 'utf8');
  const nodes = {};
  for (const match of html.matchAll(/<(\w+)\b[^>]*\bid="([^"]+)"[^>]*>/g)) {
    const node = nodes[match[2]] = new Element(); node.tag = match[1];
    node.hidden = /\bhidden\b/.test(match[0]); node.disabled = /\bdisabled\b/.test(match[0]);
  }
  const storage = new Map(); let copied;
  const ctx = vm.createContext({
    window: { matchMedia: () => ({ matches: dark, addEventListener() {} }) },
    document: { getElementById: id => { assert.ok(nodes[id], `Missing HTML element: ${id}`); return nodes[id]; }, documentElement: new Element(), createElement: () => new Element() },
    localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k,v) => storage.set(k,v) },
    navigator: { clipboard: { writeText: async text => { copied = text; } } },
    setTimeout() {}, alert() {},
  });
  vm.runInContext(fs.readFileSync(path.join(root, 'assets/config.js'), 'utf8'), ctx);
  vm.runInContext(fs.readFileSync(path.join(root, 'assets', script), 'utf8'), ctx);
  const input = async (id, value) => { nodes[id].value = value; await nodes[id].fire('input'); };
  const choose = async name => {
    await input('resource-search', name);
    const item = nodes['resource-list'].children.find(el => el.innerHTML?.includes(`<span class="item-name">${name}</span>`));
    assert.ok(item, `Resource exists: ${name}`); await item.fire('mousedown');
  };
  return { nodes, ctx, input, choose, copied: () => copied };
}

test('subscription ignores region, instance and formatting options; copy uses exact output', async () => {
  const a = app(); const n = a.nodes;
  await a.input('prefix', 'vm'); await a.input('instance', '02');
  n['no-dashes'].checked = true;
  await a.choose('Subscription'); await a.input('app-name', ' AVS ');
  assert.equal(n.preview.textContent, 'sub-prod-avs');
  assert.equal(n['copy-btn'].disabled, false);
  for (const id of ['region','instance','source','destination','condensed','no-dashes']) {
    assert.equal(n[id+'-field'].hidden, true, id); assert.equal(n[id].disabled, true, id);
  }
  await n['copy-btn'].fire('click'); assert.equal(a.copied(), 'sub-prod-avs');
  await a.input('app-name', ' '); assert.equal(n['copy-btn'].disabled, true);
});

test('peering needs both endpoints, uses direction and region, and validates identifiers', async () => {
  const a = app(); const n = a.nodes;
  await a.choose('Virtual network peering');
  assert.equal(n['source-field'].hidden, false); assert.equal(n['destination-field'].hidden, false);
  for (const id of ['app-name','instance','condensed','no-dashes']) assert.equal(n[id+'-field'].hidden, true);
  assert.equal(n['copy-btn'].disabled, true);
  await a.input('source', ' HUB '); assert.equal(n['copy-btn'].disabled, true);
  await a.input('destination', 'Spoke-AVS');
  assert.equal(n.preview.textContent, 'peer-prod-uks-hub-to-spoke-avs');
  assert.equal(n['copy-btn'].disabled, false);
  await a.input('env', 'dev'); await a.input('region', 'ukw');
  assert.equal(n.preview.textContent, 'peer-dev-ukw-hub-to-spoke-avs');
  for (const bad of [' ', 'bad name', 'bad/name', '-hub', 'hub--avs']) {
    await a.input('source', bad); assert.equal(n['copy-btn'].disabled, true, bad);
  }
});

test('switching, direct prefix edits, search edits, and reset keep field state consistent', async () => {
  const a = app(); const n = a.nodes;
  await a.choose('Virtual network peering'); await a.input('source','hub'); await a.input('destination','spoke');
  await a.choose('Virtual network'); await a.input('app-name','avs'); await a.input('instance','01');
  assert.equal(n.preview.textContent,'vnet-prod-avs-uks01');
  assert.equal(n['source-field'].hidden,true); assert.equal(n['app-name-field'].hidden,false);
  await a.input('prefix',' SUB '); assert.equal(n.preview.textContent,'sub-prod-avs');
  await a.input('prefix','peer'); assert.equal(n.preview.textContent,'peer-prod-uks-hub-to-spoke');
  await a.input('resource-search','Storage');
  assert.equal(n.prefix.value,''); assert.equal(n['copy-btn'].disabled,true); assert.equal(n['source-field'].hidden,true);
  await a.input('prefix','peer'); await n['reset-btn'].fire('click');
  for (const id of ['prefix','app-name','source','destination','instance']) assert.equal(n[id].value,'');
  assert.equal(n['source-field'].hidden,true); assert.equal(n['copy-btn'].disabled,true);
  for (const prefix of ['constructor','toString','__proto__']) await a.input('prefix',prefix);
});

test('standard resource rules, numeric instances, no-dashes validation and suggestions', async () => {
  const a = app(); const n = a.nodes;
  await a.choose('Virtual machine'); await a.input('app-name','web'); await a.input('instance','01');
  assert.equal(n.preview.textContent,'vm-p-web-uks01'); assert.equal(n['copy-btn'].disabled,false);
  await a.input('instance','abc'); assert.equal(n['copy-btn'].disabled,true);
  await a.choose('Resource group'); assert.equal(n.preview.textContent,'rg-prod-web-uks');
  await a.choose('Storage account'); await a.input('instance','01');
  assert.equal(n.preview.textContent,'stprodwebuks01'); assert.equal(n['copy-btn'].disabled,false);
  await a.input('prefix','custom'); n['no-dashes'].checked=true; await a.input('app-name','bad@name');
  assert.equal(n['copy-btn'].disabled,true);
  await a.choose('Virtual network');
  const suggestion = n['suggestion-list'].children.find(e => e.innerHTML.includes('<code>rg</code>'));
  assert.ok(suggestion); await suggestion.fire('click'); assert.equal(n.prefix.value,'rg');
});

test('every configured resource can be selected without runtime errors', async () => {
  const a = app();
  for (const resource of a.ctx.window.NAMING_CONFIG.resources) await a.choose(resource.name);
});

test('theme toggles from browser dark mode on first click on both pages', async () => {
  for (const script of ['app.js','tagging.js']) {
    const a = app(script,true); await a.nodes['theme-toggle'].fire('click');
    assert.equal(a.ctx.document.documentElement.dataset.theme,'light');
    await a.nodes['theme-toggle'].fire('click'); assert.equal(a.ctx.document.documentElement.dataset.theme,'dark');
  }
});

test('tag values appear in JSON, deselection removes them, and reset clears output', async () => {
  const a = app('tagging.js'); const n = a.nodes;
  const field = n['tag-fields'].children[0]; field.checkbox.checked=true; await field.checkbox.fire('change');
  const input = field.control.children[0]; input.value='FIN-01'; await input.fire('input');
  assert.deepEqual(JSON.parse(n['tag-json'].textContent), {'cost-centre':'FIN-01'});
  await n['copy-tags-btn'].fire('click'); assert.equal(a.copied(), n['tag-json'].textContent);
  field.checkbox.checked=false; await field.checkbox.fire('change'); assert.equal(n['tag-json'].textContent,'{}');
  field.checkbox.checked=true; await field.checkbox.fire('change'); input.value='FIN-02'; await input.fire('input');
  await n['reset-tags-btn'].fire('click'); assert.equal(n['tag-json'].textContent,'{}'); assert.equal(input.value,'');
});
