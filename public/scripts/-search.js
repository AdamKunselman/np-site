import {URL} from '../_globals.js';

let parkNames = [];

async function fetchParkNames() {
  try {
    const response = await fetch(`${URL}/api/v1/names`);
    parkNames = await response.json();
  } catch (error) {
    console.log(error);
  }
}

const MIN_LEN = 3;
const DEBOUNCE_MS = 200;

await fetchParkNames();

const fetchSuggestions = async (q) => {
  const ql = q.toLowerCase();
  const result = parkNames
    .filter(item => item != null) // removes null and undefined
    .filter(item => item.toLowerCase().includes(ql))
    .slice(0, 20);
  return result;
};

// --- DOM refs ---
const input = document.getElementById('search');
const box = document.getElementById('suggestions');

// --- Helpers ---
const debounce = (fn, ms) => {
  let t; 
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
};

let activeIndex = -1; // keyboard highlight
let currentItems = [];

function render(items) {
  box.textContent = "";
  activeIndex = -1;
  currentItems = items;

  if (!items.length) {
    toggleBox(false);
    return;
  }

  const frag = document.createDocumentFragment();
  items.forEach((text, i) => {
    const id = `sugg-${i}`;
    const div = document.createElement('div');
    div.className = 'suggestion';
    div.id = id;
    div.setAttribute('role', 'option');
    div.setAttribute('aria-selected', 'false');
    div.textContent = text;
    div.addEventListener('mousedown', (e) => { // mousedown to avoid blur before click
      e.preventDefault();
      choose(i);
    });
    frag.appendChild(div);
  });
  box.appendChild(frag);
  toggleBox(true);
}

function toggleBox(show) {
  box.setAttribute('aria-hidden', String(!show));
  input.setAttribute('aria-expanded', String(show));
}

function highlight(i) {
  const opts = [...box.querySelectorAll('.suggestion')];
  opts.forEach((el, idx) => el.setAttribute('aria-selected', String(idx === i)));
  activeIndex = i;
  input.setAttribute('aria-activedescendant', i >= 0 ? opts[i].id : "");
  if (i >= 0) opts[i].scrollIntoView({ block: 'nearest' });
}

function choose(i) {
  if (i < 0 || i >= currentItems.length) return;
  input.value = currentItems[i];
  toggleBox(false);
  window.location.href = `${URL}/park/?parkName=${encodeURIComponent(input.value)}`;
}

const handleInput = debounce(async (e) => {
  const q = e.target.value.trim();
  //console.log(q);
  if (q.length < MIN_LEN) { render([]); return; }
  try {
    const results = await fetchSuggestions(q);
    render(results);
  } catch (error) {
    console.log('ERROR: Unable to fetch suggestions for query');
    console.log(error);
    render([]);
  }
}, DEBOUNCE_MS);

input.addEventListener('input', handleInput);

input.addEventListener('keydown', (e) => {
  const open = box.getAttribute('aria-hidden') === 'false';
  if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    highlight(Math.min(activeIndex + 1, currentItems.length - 1));
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    highlight(Math.max(activeIndex - 1, -1));
  } else if (e.key === 'Enter') {
    if (activeIndex >= 0) {
      e.preventDefault();
      choose(activeIndex);
    } // else let form submit naturally if wrapped in a form
  } else if (e.key === 'Escape') {
    toggleBox(false);
  }
});

// Close suggestions on blur/click outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrap')) toggleBox(false);
});