// Interface motion, on top of the vendored Anime.js bundle.
//
// Every helper animates *from* an offset back to the element's own state, so the markup is
// correct with no animation at all: a helper that is skipped, interrupted or throws leaves a
// usable screen. With "reduce motion" set in the OS, nothing animates.
import { animate, stagger, cleanInlineStyles } from "../vendor/anime.esm.min.js";

const reduced = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

// One running animation per element: a second call cancels the first instead of fighting it.
const running = new WeakMap();

function run(el, params) {
    if (reduced || !el) return null;
    running.get(el)?.cancel();
    const a = animate(el, {
        ...params,
        onComplete: (self) => {
            running.delete(el);
            cleanInlineStyles(self);
            params.onComplete?.(self);
        },
    });
    running.set(el, a);
    return a;
}

/** A screen or view coming in. */
export function enter(el) {
    run(el, { opacity: { from: 0 }, y: { from: 8 }, duration: 240, ease: "outCubic" });
}

/** A list filling in, one row after another. */
export function rise(nodes, { delay = 0 } = {}) {
    const list = [...(nodes || [])].filter(Boolean);
    if (reduced || !list.length) return;
    animate(list, {
        opacity: { from: 0 }, y: { from: 10 },
        duration: 320, ease: "outCubic", delay: stagger(36, { start: delay }),
        onComplete: (self) => cleanInlineStyles(self),
    });
}

/** Tiles popping in from their centre, for the recovery phrase grid. */
export function pop(nodes) {
    const list = [...(nodes || [])];
    if (reduced || !list.length) return;
    animate(list, {
        opacity: { from: 0 }, scale: { from: 0.86 },
        duration: 280, ease: "outBack(1.4)", delay: stagger(28),
        onComplete: (self) => cleanInlineStyles(self),
    });
}

/** A refused input: a short horizontal shake. */
export function shake(el) {
    run(el, { x: [0, -7, 6, -4, 3, 0], duration: 380, ease: "inOutSine" });
}

/** Confirms a small action in place, such as a copy. */
export function bump(el) {
    run(el, { scale: [1, 1.08, 1], duration: 260, ease: "outQuad" });
}

/** Spins an icon until the returned function is called. */
export function spin(el) {
    if (reduced || !el) return () => {};
    const a = animate(el, { rotate: "1turn", duration: 900, ease: "linear", loop: true });
    return () => { a.cancel(); el.style.transform = ""; };
}

/**
 * Counts a figure up to its new value. The last frame writes `finalText` itself, so what
 * stays on screen is the exact string, never a float rendering of it.
 */
export function count(el, from, to, decimals, finalText) {
    if (reduced || !el || from === to || !Number.isFinite(from) || !Number.isFinite(to)) {
        if (el) el.textContent = finalText;
        return;
    }
    const v = { n: from };
    running.get(el)?.cancel();
    const a = animate(v, {
        n: to, duration: 700, ease: "outExpo",
        onUpdate: () => { el.textContent = v.n.toFixed(decimals); },
        onComplete: () => { running.delete(el); el.textContent = finalText; },
    });
    running.set(el, a);
}

/** Opens or closes a block by animating its height. */
export function reveal(el, open) {
    if (!el) return;
    if (reduced) { el.hidden = !open; return; }
    running.get(el)?.cancel();
    el.style.overflow = "hidden";
    if (open) {
        el.hidden = false;
        const h = el.scrollHeight;
        run(el, {
            height: [0, h], opacity: [0, 1], duration: 260, ease: "outCubic",
            onComplete: () => { el.style.overflow = ""; },
        });
    } else {
        const h = el.offsetHeight;
        run(el, {
            height: [h, 0], opacity: [1, 0], duration: 200, ease: "inCubic",
            onComplete: () => { el.hidden = true; el.style.overflow = ""; },
        });
    }
}
