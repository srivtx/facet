"use client";

import React from "react";

interface BoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  label?: string;
}

interface BoundaryState {
  failed: boolean;
}

/**
 * Keeps one misbehaving primitive from taking down a whole page section.
 * Class component because that is still the only way to catch a render throw.
 */
export class StageBoundary extends React.Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error(
      `[Facet] ${this.props.label ?? "stage"} failed and was replaced:`,
      error,
    );
  }

  render() {
    if (this.state.failed) {
      return (
        this.props.fallback ?? (
          <div
            className="grid h-full w-full place-items-center bg-[var(--facet-panel)] text-xs text-neutral-500"
            role="img"
            aria-label={`${this.props.label ?? "stage"} unavailable`}
          >
            {this.props.label ?? "unavailable"}
          </div>
        )
      );
    }
    return this.props.children;
  }
}