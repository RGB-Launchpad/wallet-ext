// A select that looks like the rest of the wallet.
//
// The native `<select>` stays and remains the value: it is what the rest of popup.js reads,
// writes and listens to. This only hides it and draws a button plus a list beside it, then
// writes the choice back through the element, so a pick fires the same `change` event a native
// pick would.
//
// NOTE: the list is attached to `<body>`, not next to the button. The popup's screens scroll
// and clip their overflow, so a list rendered inside one is cut off at the screen's edge.
//
// NOTE: the popup is 380x600 with nothing outside it. A list that would run past the bottom
// opens upwards instead, and its height is capped to what is left; it never grows the window.

const MARGIN = 8;      // from the window's edge
const MAX_HEIGHT = 260;

/** The open list, if any. One at a time, as with a native select. */
let open = null;

function closeOpen() {
  if (!open) return;
  open.list.remove();
  open.button.setAttribute("aria-expanded", "false");
  open = null;
}

document.addEventListener("pointerdown", (e) => {
  if (open && !open.list.contains(e.target) && !open.button.contains(e.target)) closeOpen();
}, true);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeOpen(); });
// A scroll moves the button out from under its list, so the list closes rather than floats.
window.addEventListener("scroll", closeOpen, true);
window.addEventListener("resize", closeOpen);

/** The option the select is on, or the first one. */
function current(select) {
  return select.selectedIndex >= 0 ? select.options[select.selectedIndex] : select.options[0];
}

function place(list, button) {
  const r = button.getBoundingClientRect();
  const below = window.innerHeight - r.bottom - MARGIN;
  const above = r.top - MARGIN;
  const up = below < Math.min(MAX_HEIGHT, list.scrollHeight) && above > below;
  list.style.maxHeight = `${Math.min(MAX_HEIGHT, up ? above : below)}px`;
  list.style.left = `${Math.max(MARGIN, Math.min(r.left, window.innerWidth - list.offsetWidth - MARGIN))}px`;
  if (up) {
    list.style.bottom = `${window.innerHeight - r.top + 4}px`;
    list.style.top = "auto";
  } else {
    list.style.top = `${r.bottom + 4}px`;
    list.style.bottom = "auto";
  }
}

/**
 * Give one `<select>` the wallet's look. Returns a function that redraws the button, for when
 * the options change.
 */
export function enhanceSelect(select) {
  if (!select || select.dataset.picker) return () => {};
  select.dataset.picker = "1";
  select.classList.add("picker-native");

  const button = document.createElement("button");
  button.type = "button";
  button.className = `picker ${select.className.replace("picker-native", "").trim()}`;
  button.setAttribute("aria-haspopup", "listbox");
  button.setAttribute("aria-expanded", "false");
  const label = document.createElement("span");
  label.className = "picker-label";
  const chev = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  chev.setAttribute("viewBox", "0 0 24 24");
  chev.setAttribute("class", "picker-chev");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M6 9l6 6 6-6");
  chev.append(path);
  button.append(label, chev);
  select.after(button);

  const redraw = () => {
    const opt = current(select);
    label.textContent = opt ? opt.textContent : "";
    button.disabled = select.disabled || select.options.length === 0;
  };

  const choose = (value) => {
    closeOpen();
    if (value === select.value) return;
    select.value = value;
    redraw();
    select.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const openList = () => {
    if (open && open.button === button) return closeOpen();
    closeOpen();
    const list = document.createElement("div");
    list.className = "picker-list";
    list.setAttribute("role", "listbox");
    for (const opt of select.options) {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "picker-opt";
      row.setAttribute("role", "option");
      row.setAttribute("aria-selected", String(opt.value === select.value));
      row.textContent = opt.textContent;
      row.onclick = () => choose(opt.value);
      list.append(row);
    }
    // Arrow keys walk the list and Enter picks, as they do in a native one.
    list.onkeydown = (e) => {
      const rows = [...list.querySelectorAll(".picker-opt")];
      const i = rows.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); rows[Math.min(i + 1, rows.length - 1)]?.focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); rows[Math.max(i - 1, 0)]?.focus(); }
      if (e.key === "Tab") { e.preventDefault(); closeOpen(); button.focus(); }
    };
    document.body.append(list);
    list.style.minWidth = `${button.getBoundingClientRect().width}px`;
    place(list, button);
    open = { list, button };
    button.setAttribute("aria-expanded", "true");
    (list.querySelector('[aria-selected="true"]') || list.firstElementChild)?.focus();
  };

  button.onclick = openList;
  button.onkeydown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === " ") { e.preventDefault(); openList(); }
  };
  button.addEventListener("focus", redraw);
  select.addEventListener("change", redraw);
  new MutationObserver(redraw).observe(select, { childList: true, subtree: true });
  redraw();
  return redraw;
}

/** Every select on the page, including ones added later. */
export function enhanceAll(root = document) {
  for (const select of root.querySelectorAll("select")) enhanceSelect(select);
}
