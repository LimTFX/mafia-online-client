export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function qsa(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

export function createEl(tag, options = {}) {
  const el = document.createElement(tag);

  if (options.className) {
    el.className = options.className;
  }
  if (options.text !== undefined) {
    el.textContent = options.text;
  }
  if (options.dataset) {
    Object.entries(options.dataset).forEach(([key, value]) => {
      el.dataset[key] = value;
    });
  }
  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
  }
  if (options.children) {
    options.children.forEach((child) => {
      if (child) el.appendChild(child);
    });
  }

  return el;
}

export function clearEl(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}