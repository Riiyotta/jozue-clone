// Converts the original server-rendered pages (.recon/pages/*.html) into React components.
// Each top-level block of <main id="swup"> and of its <article> becomes a component in
// src/components/. Blocks whose markup is identical across pages are emitted once and shared.
// Output DOM is meant to be identical to the original, so the original CSS + motion JS
// (served verbatim from public/_astro) drive it exactly as on jozue.fr.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { parseDocument } from 'htmlparser2';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PAGES_DIR = path.join(ROOT, '.recon/pages');
const OUT_COMP = path.join(ROOT, 'src/components');
const OUT_PAGES = path.join(ROOT, 'src/pages');

const ATTR_MAP = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', srcset: 'srcSet', crossorigin: 'crossOrigin',
  'http-equiv': 'httpEquiv', charset: 'charSet', readonly: 'readOnly', maxlength: 'maxLength',
  autoplay: 'autoPlay', playsinline: 'playsInline', allowfullscreen: 'allowFullScreen', frameborder: 'frameBorder',
  referrerpolicy: 'referrerPolicy', hreflang: 'hrefLang', autocomplete: 'autoComplete', enctype: 'encType',
  itemprop: 'itemProp', itemscope: 'itemScope', itemtype: 'itemType', colspan: 'colSpan', rowspan: 'rowSpan',
  'accept-charset': 'acceptCharset', novalidate: 'noValidate', nomodule: 'noModule', spellcheck: 'spellCheck',
  contenteditable: 'contentEditable', datetime: 'dateTime', enterkeyhint: 'enterKeyHint', inputmode: 'inputMode',
  'xlink:href': 'xlinkHref', 'xmlns:xlink': 'xmlnsXlink', 'xml:space': 'xmlSpace', 'xml:lang': 'xmlLang',
  'xlink:title': 'xlinkTitle', 'xlink:actuate': 'xlinkActuate', 'xlink:show': 'xlinkShow', 'xlink:type': 'xlinkType',
};
// React treats these as booleans: an empty-string value would drop them, so emit {true}.
const BOOLEAN = new Set(['hidden', 'defer', 'async', 'muted', 'autoPlay', 'loop', 'playsInline', 'controls', 'disabled',
  'allowFullScreen', 'noModule', 'checked', 'selected', 'open', 'required', 'readOnly', 'itemScope', 'multiple', 'reversed', 'default']);
// Raw-content elements: inner content is kept byte-for-byte.
const RAW = new Set(['script', 'style', 'template', 'noscript']);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

const camel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const svgAttr = (n) => (/^(data|aria)-/.test(n) || !n.includes('-') ? n : camel(n));

function styleObj(str) {
  const out = {};
  // split on ; not inside parentheses (url(data:...;...) etc.)
  let depth = 0, cur = '';
  const parts = [];
  for (const ch of str) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ';' && depth === 0) { parts.push(cur); cur = ''; } else cur += ch;
  }
  parts.push(cur);
  for (const p of parts) {
    const i = p.indexOf(':');
    if (i < 0) continue;
    const k = p.slice(0, i).trim();
    const v = p.slice(i + 1).trim();
    if (!k) continue;
    const key = k.startsWith('--') ? k : k.startsWith('-ms-') ? camel(k.slice(1)) : k.startsWith('-') ? camel(k.slice(1)).replace(/^./, (c) => c.toUpperCase()) : camel(k);
    out[key] = v;
  }
  return out;
}

const S = (v) => JSON.stringify(v);
// Literal slots: while converting a component, every literal value is recorded so that
// variants of the same structure (EN/FR, per-project) collapse into one prop-driven component.
let SLOTS = null;
let CTX_CLASS = [];
function lit(value, kind) {
  if (!SLOTS) return S(value);
  const owner = CTX_CLASS[CTX_CLASS.length - 1] || '';
  SLOTS.push({ value, kind, owner });
  return `\u0000${SLOTS.length - 1}\u0000`;
}
const serializeRaw = (node) => {
  // Re-serialise children verbatim (raw text for script/style; markup for template/noscript).
  return node.children.map((c) => outerHTML(c)).join('');
};
function outerHTML(n) {
  if (n.type === 'text') return n.data;
  if (n.type === 'comment') return `<!--${n.data}-->`;
  if (n.type === 'directive') return `<${n.data}>`;
  const attrs = Object.entries(n.attribs || {}).map(([k, v]) => (v === '' ? ` ${k}` : ` ${k}="${v.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`)).join('');
  if (VOID.has(n.name)) return `<${n.name}${attrs}>`;
  return `<${n.name}${attrs}>${(n.children || []).map(outerHTML).join('')}</${n.name}>`;
}

function attrsJSX(node, inSvg) {
  const out = [];
  for (let [k, v] of Object.entries(node.attribs || {})) {
    let name = ATTR_MAP[k] || ATTR_MAP[k.toLowerCase()] || k;
    if (inSvg) name = ATTR_MAP[k] || svgAttr(k);
    if (name === 'style') { out.push(`style={${lit(styleObj(v), 'style')}}`); continue; }
    if (BOOLEAN.has(name)) { out.push(`${name}={true}`); continue; }
    if (name === 'value' && ['input', 'textarea', 'select'].includes(node.name)) name = 'defaultValue';
    if (!/^[A-Za-z_:][\w:.-]*$/.test(name)) continue;
    // JSX doesn't allow ':' except namespace form; React has no namespaced props, so skip leftovers.
    if (name.includes(':')) continue;
    out.push(`${name}={${lit(v, name)}}`);
  }
  return out.length ? ' ' + out.join(' ') : '';
}

function textJSX(t, pre) {
  if (pre) return `{${lit(t, 'text')}}`;
  const collapsed = t.replace(/[ \t\r\n\f]+/g, (m) => (m.includes('\n') ? '\n' : ' '));
  if (!collapsed.trim()) return `{${S(collapsed)}}`; // pure whitespace is structural, never a prop
  return `{${lit(collapsed, 'text')}}`;
}

function toJSX(node, ind = '', inSvg = false, pre = false) {
  if (node.type === 'comment' || node.type === 'directive') return '';
  if (node.type === 'text') return node.data === '' ? '' : ind + textJSX(node.data, pre);
  const name = node.name;
  const svg = inSvg || name === 'svg';
  const cls = (node.attribs?.class || '').split(/\s+/)[0];
  if (cls) CTX_CLASS.push(cls);
  try {
  const a = attrsJSX(node, svg);
  if (RAW.has(name)) {
    const inner = serializeRaw(node);
    if (!inner) return `${ind}<${name}${a} />`;
    return `${ind}<${name}${a} dangerouslySetInnerHTML={{ __html: ${lit(inner, 'html')} }} />`;
  }
  const kids = (node.children || []).filter((c) => c.type !== 'comment');
  if (VOID.has(name) || kids.length === 0) return `${ind}<${name}${a} />`;
  const isPre = pre || name === 'pre' || name === 'textarea';
  const inner = kids.map((c) => toJSX(c, ind + '  ', svg, isPre)).filter(Boolean).join('\n');
  return `${ind}<${name}${a}>\n${inner}\n${ind}</${name}>`;
  } finally { if (cls) CTX_CLASS.pop(); }
}

// ---- naming ---------------------------------------------------------------
const pascal = (s) => s.replace(/(^|[-_\s.]+)([a-zA-Z0-9])/g, (_, __, c) => c.toUpperCase()).replace(/[^A-Za-z0-9]/g, '');
const NAME_HINTS = [
  [/#js-transi\b/, 'Transition'], [/#js-intro\b/, 'IntroOverlay'], [/#js-menu-button\b/, 'MenuToggle'], [/#js-menu\b/, 'Menu'],
  [/#trace-j\b/, 'TraceJ'], [/#trace-signature\b/, 'TraceSignature'], [/^style/, 'IntroKeyframes'],
  [/#intro\b/, 'Hero'], [/#works\b/, 'SelectedWorks'], [/filter-island\b/, 'FilterIsland'], [/js-island-live/, 'FilterLive'],
  [/homepage__works\b/, 'WorksList'], [/homepage__talk--home/, 'Contact'], [/homepage__talk\b/, 'TalkCta'],
  [/homepage__awards/, 'Awards'], [/#about\b/, 'About'], [/homepage__partners/, 'Partners'],
  [/project-head\b/, 'ProjectHead'], [/project-hero-container/, 'ProjectHero'], [/project-content\b/, 'ProjectContent'],
  [/project-more-works/, 'MoreWorksTitle'], [/^head$/, 'Head'], [/#js-project-next/, 'ProjectNext'],
];
function sig(n) {
  if (n.type !== 'tag' && n.type !== 'script' && n.type !== 'style') return n.type;
  const a = n.attribs || {};
  return `${n.name}${a.id ? '#' + a.id : ''}${a.class ? '.' + a.class.split(/\s+/).join('.') : ''}`;
}
function baseName(n) {
  const s = sig(n);
  for (const [re, nm] of NAME_HINTS) if (re.test(s)) return nm;
  const a = n.attribs || {};
  return pascal(a.id || (a.class || n.name).split(/\s+/)[0]);
}

// ---- pass 1: collect component usages per page ------------------------------
const usages = []; // {template, slots, base, project}
function useComponent(node, project, lang) {
  SLOTS = [];
  const template = toJSX(node, '    ');
  const slots = SLOTS;
  SLOTS = null;
  usages.push({ template, slots, base: baseName(node), project, lang });
  return usages.length - 1;
}

const files = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith('.html')).sort((a, b) => (a === 'index.html' ? -1 : b === 'index.html' ? 1 : a.localeCompare(b)));
const pages = [];
for (const f of files) {
  const html = fs.readFileSync(path.join(PAGES_DIR, f), 'utf8');
  const doc = parseDocument(html, { lowerCaseAttributeNames: false, decodeEntities: true });
  const htmlEl = doc.children.find((c) => c.name === 'html');
  const head = htmlEl.children.find((c) => c.name === 'head');
  const body = htmlEl.children.find((c) => c.name === 'body');
  const slug = f.replace(/\.html$/, '');
  const route = slug === 'index' ? '/' : '/' + slug.replace(/__/g, '/') + '/';
  const project = slug.replace(/^index$/, '').replace(/^fr(__|$)/, '').replace(/^works__/, '') || 'home';
  const lang = route.startsWith('/fr/') ? 'fr' : 'en';
  const compName = 'Page' + (slug === 'index' ? 'Home' : pascal(slug.replace(/__/g, '-')));

  // Head: drop Vercel analytics (only works on Vercel's edge); the rest becomes a <Head> component.
  head.children = head.children.filter((c) => c.type !== 'comment' && !(c.name === 'script' && /_vercel\/insights/.test(c.attribs?.src || '')));
  const headUse = useComponent(head, project, lang);

  const main = body.children.find((c) => c.name === 'main');
  const parts = [];
  for (const c of main.children) {
    if (c.type === 'text' || c.type === 'comment') continue;
    if (c.name === 'article') {
      const inner = c.children.filter((ac) => ac.type !== 'text' && ac.type !== 'comment').map((ac) => useComponent(ac, project, lang));
      parts.push({ article: attrsJSX(c), inner });
    } else parts.push(useComponent(c, project, lang));
  }
  const tail = body.children.filter((c) => c.type !== 'text' && c.type !== 'comment' && c !== main).map((c) => toJSX(c, '        ')).join('\n');
  pages.push({ route, compName, htmlAttrs: attrsJSX(htmlEl), bodyAttrs: attrsJSX(body), mainAttrs: attrsJSX(main), headUse, parts, tail });
}

// ---- pass 2: group identical structures into prop-driven components ------------
const hash = (t) => crypto.createHash('sha1').update(t).digest('hex').slice(0, 12);
const groups = new Map(); // templateHash -> {base, uses:[idx]}
for (const [i, u] of usages.entries()) {
  const h = hash(u.template);
  if (!groups.has(h)) groups.set(h, { base: u.base, template: u.template, uses: [] });
  groups.get(h).uses.push(i);
}
// names
const byBase = new Map();
for (const g of groups.values()) { if (!byBase.has(g.base)) byBase.set(g.base, []); byBase.get(g.base).push(g); }
for (const [base, gs] of byBase) {
  let alt = 0;
  gs.forEach((g, k) => {
    const projects = [...new Set(g.uses.map((i) => usages[i].project))];
    const langs = [...new Set(g.uses.map((i) => usages[i].lang))];
    const L = langs.length === 1 && langs[0] === 'fr' ? 'Fr' : '';
    if (gs.length === 1) g.name = base;
    else if (projects.length === 1 && projects[0] === 'home') g.name = base + L;
    else if (projects.length === 1) g.name = base + pascal(projects[0]) + L;
    else g.name = k === 0 ? base : base + 'Variant' + ++alt;
  });
  // guarantee uniqueness
  const seen = new Map();
  for (const g of gs) { const n = (seen.get(g.name) || 0) + 1; seen.set(g.name, n); if (n > 1) g.name += n; }
}
// props: slots whose value differs between uses
const propName = (slot) => {
  const k = slot.kind === 'html' ? 'html' : slot.kind === 'text' ? 'text' : slot.kind;
  const owner = slot.owner ? camel(slot.owner.replace(/__|_/g, '-').replace(/^js-/, '')) : '';
  const n = owner ? owner + k.charAt(0).toUpperCase() + camel(k).slice(1) : camel(k);
  return n.replace(/[^A-Za-z0-9]/g, '');
};
for (const g of groups.values()) {
  const first = usages[g.uses[0]].slots;
  g.props = new Map(); // slotIndex -> prop name
  const taken = new Map();
  first.forEach((slot, si) => {
    const varies = g.uses.some((i) => JSON.stringify(usages[i].slots[si].value) !== JSON.stringify(slot.value));
    if (!varies) return;
    let n = propName(slot);
    const c = (taken.get(n) || 0) + 1; taken.set(n, c);
    if (c > 1) n += c;
    g.props.set(si, n);
  });
  const body = g.template.replace(/\u0000(\d+)\u0000/g, (_, si) => (g.props.has(+si) ? `p.${g.props.get(+si)}` : S(first[+si].value)));
  const sig = g.props.size ? 'p' : '';
  g.code = `${g.props.size ? `// Props: ${[...g.props.values()].join(', ')}\n` : ''}export default function ${g.name}(${sig}) {\n  return (\n${body}\n  );\n}\n`;
}
const groupOf = new Map();
for (const g of groups.values()) for (const i of g.uses) groupOf.set(i, g);
const propsFor = (i) => {
  const g = groupOf.get(i);
  if (!g.props.size) return null;
  return Object.fromEntries([...g.props].map(([si, n]) => [n, usages[i].slots[si].value]));
};

// ---- emit ---------------------------------------------------------------------
fs.rmSync(OUT_COMP, { recursive: true, force: true });
fs.rmSync(OUT_PAGES, { recursive: true, force: true });
fs.mkdirSync(OUT_COMP, { recursive: true });
fs.mkdirSync(OUT_PAGES, { recursive: true });
for (const g of groups.values()) fs.writeFileSync(path.join(OUT_COMP, g.name + '.jsx'), g.code);

const keyName = (name) => name.charAt(0).toLowerCase() + name.slice(1);
for (const pg of pages) {
  const imports = new Set();
  const content = {};
  const el = (i, ind) => {
    const g = groupOf.get(i);
    imports.add(g.name);
    const pr = propsFor(i);
    if (!pr) return `${ind}<${g.name} />`;
    let k = keyName(g.name), n = 1;
    while (content[k]) k = keyName(g.name) + ++n;
    content[k] = pr;
    return `${ind}<${g.name} {...content.${k}} />`;
  };
  const headEl = el(pg.headUse, '      ');
  const mainParts = pg.parts.map((p) => (typeof p === 'number' ? el(p, '        ')
    : `        <article${p.article}>\n${p.inner.map((i) => el(i, '          ')).join('\n')}\n        </article>`)).join('\n');
  const code = `${[...imports].map((n) => `import ${n} from '../components/${n}.jsx';`).join('\n')}

// Route: ${pg.route}
// Page content (text, links, images) for the shared components below.
const content = ${JSON.stringify(content, null, 2)};

export default function ${pg.compName}() {
  return (
    <html${pg.htmlAttrs}>
${headEl}
      <body${pg.bodyAttrs}>
        <main${pg.mainAttrs}>
${mainParts}
        </main>
${pg.tail}
      </body>
    </html>
  );
}
`;
  fs.writeFileSync(path.join(OUT_PAGES, pg.compName + '.jsx'), code);
}

fs.writeFileSync(path.join(ROOT, 'src/routes.js'),
  pages.map((r) => `import ${r.compName} from './pages/${r.compName}.jsx';`).join('\n') +
  `\n\nexport const routes = {\n${pages.map((r) => `  ${S(r.route)}: ${r.compName},`).join('\n')}\n};\n`);

console.log(`pages: ${pages.length}, components: ${groups.size}`);
