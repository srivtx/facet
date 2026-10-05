"use client";

import * as React from "react";

type Args<T extends HTMLElement> = {
  ref: React.RefObject<T | null>;
  onOutsideClick: () => void;
  enabled?: boolean;
};

/**
 * Calls `onOutsideClick` when a pointerdown lands outside `ref`.
 * Accepts either positional args or a single options object, because the
 * vendored Aceternity components use both forms.
 */
export function useOutsideClick<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  onOutsideClick: () => void,
  enabled?: boolean,
): void;
export function useOutsideClick<T extends HTMLElement>(args: Args<T>): void;
export function useOutsideClick<T extends HTMLElement>(
  a: React.RefObject<T | null> | Args<T>,
  b?: () => void,
  c?: boolean,
) {
  const ref = typeof a === "object" && a !== null && "ref" in a ? a.ref : a;
  const onOutsideClick =
    typeof a === "object" && a !== null && "ref" in a ? a.onOutsideClick : b;
  const enabled =
    typeof a === "object" && a !== null && "ref" in a
      ? (a.enabled ?? true)
      : (c ?? true);

  React.useEffect(() => {
    if (!enabled || !onOutsideClick) return;

    const handlePointerDown = (event: Event) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      onOutsideClick();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [ref, onOutsideClick, enabled]);
}