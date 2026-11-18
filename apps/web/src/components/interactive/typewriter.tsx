"use client";

import { useEffect, useState } from "react";

/** Types and deletes each word in turn. Full list is exposed to screen readers / crawlers. */
export function Typewriter({ words }: { words: string[] }) {
  const [text, setText] = useState(words[0] ?? "");

  useEffect(() => {
    if (words.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let wi = 0;
    let ci = words[0]!.length;
    let deleting = true;
    let t: ReturnType<typeof setTimeout>;

    const tick = () => {
      const word = words[wi]!;
      if (deleting) {
        ci--;
        setText(word.slice(0, ci));
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
          t = setTimeout(tick, 350);
          return;
        }
        t = setTimeout(tick, 35);
      } else {
        const next = words[wi]!;
        ci++;
        setText(next.slice(0, ci));
        if (ci === next.length) {
          deleting = true;
          t = setTimeout(tick, 2200);
          return;
        }
        t = setTimeout(tick, 75);
      }
    };

    t = setTimeout(tick, 2600);
    return () => clearTimeout(t);
  }, [words]);

  return (
    <>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden>
        {text}
        <span className="caret" />
      </span>
    </>
  );
}
