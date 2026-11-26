import { parseAdopterRegistry } from "../../../apps/embed/src/adopters.js";

/**
 * Landing page interactions; the public registry sends CORS headers.
 *
 * The registry validation is shared with the embed playground (#185) rather
 * than kept as a second copy here — the two pages must agree on which
 * entries are safe to offer. It is embedded as source text because this is a
 * classic `<script>`, not a module, and bound to a `const` rather than relied
 * on by name: the worker bundle is minified, which renames the declaration
 * but not a name written inside a string.
 *
 * This is the same relative import across a package boundary that
 * `workers/convert` already makes into `apps/validator` for `fetchDocument`.
 * It is now the second one.
 */
export const adoptersScript = `
const parseAdopterRegistry = ${parseAdopterRegistry};
const select = document.querySelector('#adopter-select');
const input = document.querySelector('#feed');
const form = document.querySelector('#convert-form');
const submit = document.querySelector('#convert-submit');
const result = document.querySelector('#result-url');
const copy = document.querySelector('#copy-url');
const copyStatus = document.querySelector('#url-copy-status');
const languageBlock = document.querySelector('#language-block');
const language = document.querySelector('#language');
const bypass = document.querySelector('#cache-bypass');
let languageTimer;
let languageRequest;
let generation = 0;
const labels = { ics: 'Get ICS', rss: 'Open RSS', schema: 'View schema.org' };

function updateOutput() {
  const format = form.querySelector('input[name="format"]:checked')?.value;
  submit.textContent = labels[format] || 'Convert';
  let valid = false;
  try {
    const source = new URL(input.value);
    valid = ['https:', 'http:'].includes(source.protocol) && !source.username && !source.password;
  } catch {}
  if (valid && format && Object.hasOwn(labels, format)) {
    const url = new URL('/' + format, location.origin);
    url.searchParams.set('feed', input.value);
    if (!language.disabled && language.value) url.searchParams.set('lang', language.value);
    if (bypass.checked) url.searchParams.set('cache', 'bypass');
    result.value = url.href;
    copy.disabled = false;
  } else {
    result.value = '';
    copy.disabled = true;
  }
  copyStatus.textContent = '';
}

function clearLanguages() {
  languageBlock.hidden = true;
  language.disabled = true;
  language.replaceChildren(new Option('Original text', ''));
}

function checkLanguages() {
  clearTimeout(languageTimer);
  languageRequest?.abort();
  const requestGeneration = ++generation;
  clearLanguages();
  updateOutput();
  let source;
  try { source = new URL(input.value); } catch { return; }
  if (!['https:', 'http:'].includes(source.protocol) || source.username || source.password) return;
  const feed = input.value;
  languageTimer = setTimeout(async () => {
    const controller = new AbortController();
    languageRequest = controller;
    try {
      const endpoint = new URL('/feed-languages', location.origin);
      endpoint.searchParams.set('feed', feed);
      if (bypass.checked) endpoint.searchParams.set('cache', 'bypass');
      const response = await fetch(endpoint, { signal: controller.signal });
      if (!response.ok) return;
      const data = await response.json();
      if (generation !== requestGeneration || !Array.isArray(data.languages) || data.languages.length < 2) return;
      for (const tag of data.languages) {
        if (typeof tag !== 'string') continue;
        const option = document.createElement('option');
        option.value = tag;
        try {
          const name = new Intl.DisplayNames(['en'], { type: 'language' }).of(tag);
          option.textContent = name && name.toLowerCase() !== tag.toLowerCase() ? name + ' (' + tag + ')' : tag;
        } catch { option.textContent = tag; }
        language.append(option);
      }
      if (language.options.length > 2) {
        language.disabled = false;
        languageBlock.hidden = false;
      }
    } catch { /* Keep the original-text option if the check fails. */ }
  }, 400);
}

async function loadAdopters() {
  try {
    const response = await fetch('https://opentechevents.org/data/adopters.json');
    if (!response.ok) throw new Error('Registry unavailable');
    const adopters = parseAdopterRegistry(await response.json());
    for (const adopter of adopters) {
      const option = document.createElement('option');
      option.value = adopter.feed;
      option.textContent = adopter.name;
      select.append(option);
    }
    select.disabled = !adopters.length;
    if (!adopters.length) select.options[0].textContent = 'No examples available';
  } catch {
    select.options[0].textContent = 'Examples unavailable';
  }
}
if (select && input && form && submit && result && copy && copyStatus && languageBlock && language && bypass) {
  select.addEventListener('change', () => {
    if (select.value) {
      input.value = select.value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  input.addEventListener('input', () => {
    if (input.value !== select.value) select.value = '';
    checkLanguages();
  });
  form.addEventListener('change', updateOutput);
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(result.value);
      copyStatus.textContent = 'URL copied to clipboard.';
    } catch {
      result.focus();
      result.select();
      copyStatus.textContent = 'Copy the selected URL with your keyboard.';
    }
  });
  updateOutput();
  loadAdopters();
}`;
