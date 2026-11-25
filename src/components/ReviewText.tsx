"use client";

import { useState } from "react";

/** Review text that is cut short on phones, with a link to open the rest in place. */
export default function ReviewText({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <p className={`rv-text${open ? " is-open" : ""}`}>{text}</p>
      <button
        type="button"
        className="rv-more"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Show less" : "Read more"}
      </button>
    </>
  );
}
