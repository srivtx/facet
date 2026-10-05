"use client";

/**
 * LinkPreview - a hover card for a link.
 *
 * NETWORK: this component makes no requests. It previously called a third-party
 * screenshot API on every hover, which meant an off-origin request (and the
 * visitor's URL handed to a third party) on every mount. Screenshotting a remote
 * page cannot be done from the client without a service, so the fetch is gone
 * rather than relocated.
 *
 * The preview is now rendered from metadata the caller already has. Supply
 * `image` and/or `title` + `description` and you get the card; supply nothing
 * and you get a degraded card built from the URL alone (host, path, a favicon
 * slot) - still a hover card, just with less in it.
 *
 * API CHANGES vs the upstream aceternity version (all additive except the
 * removals noted, so every existing call site still typechecks):
 *
 *   - ADDED  `image`     - preview image, a path served by this origin or a
 *                          data: URL. Supersedes `imageSrc`/`isStatic`.
 *   - ADDED  `title`     - preview headline.
 *   - ADDED  `description` - preview body copy, truncated to 3 lines.
 *   - ADDED  `favicon`   - small icon for the degraded card; local path only.
 *   - ADDED  `siteName`  - overrides the host line in the degraded card.
 *   - KEPT   `children`, `url`, `className`, `width`, `height`, `isStatic`,
 *            `imageSrc` - `isStatic` + `imageSrc` still work and mean the
 *            same thing (`image` wins if you pass both).
 *   - KEPT BUT INERT    `quality`, `layout`. They configured the remote
 *                          screenshot request; there is no request left to
 *                          configure, so they are accepted and ignored rather
 *                          than being a breaking change for existing callers.
 *
 * Degraded state: with no `image` the card falls back to the text card, and
 * with no metadata at all it falls back to the URL chip. Nothing throws and
 * nothing 404s.
 */

import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";

import { cn } from "@/lib/utils";

type LinkPreviewProps = {
  children: React.ReactNode;
  url: string;
  className?: string;
  width?: number;
  height?: number;
  /** Accepted for source compatibility; unused (there is no remote render). */
  quality?: number;
  /** Accepted for source compatibility; unused (there is no remote render). */
  layout?: string;
  /** Preview image. Local path or data: URL - it is rendered, not fetched. */
  image?: string;
  /** Preview headline. */
  title?: string;
  /** Preview body copy. */
  description?: string;
  /** Small icon for the text card; local path or data: URL. */
  favicon?: string;
  /** Overrides the host line in the text card. */
  siteName?: string;
} & (
  | { isStatic: true; imageSrc: string }
  | { isStatic?: false; imageSrc?: never }
);

/** host + path of a URL, for the card when no title was supplied */
function describeUrl(url: string) {
  try {
    const parsed = new URL(url);
    const rest = `${parsed.pathname}${parsed.search}`.replace(/\/$/, "");
    return {
      siteName: parsed.hostname.replace(/^www\./, ""),
      path: rest === "" ? "" : rest,
    };
  } catch {
    return { siteName: url, path: "" };
  }
}

export const LinkPreview = ({
  children,
  url,
  className,
  width = 200,
  height = 125,
  layout = "fixed",
  isStatic = false,
  imageSrc,
  image,
  title,
  description,
  favicon,
  siteName,
}: LinkPreviewProps) => {
  const [isOpen, setOpen] = React.useState(false);

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);

  const translateX = useSpring(x, springConfig);

  const handleMouseMove = (event: any) => {
    const targetRect = event.target.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2; // Reduce the effect to make it subtle
    x.set(offsetFromCenter);
  };

  /* `isStatic` + `imageSrc` is the upstream pairing and means the same thing
   * as `image`; `image` wins so a caller can migrate without a flag day. */
  const resolvedImage = image ?? (isStatic ? imageSrc : undefined);
  const described = describeUrl(url);
  const resolvedSiteName = siteName ?? described.siteName;
  const resolvedTitle = title?.trim() || undefined;

  const cardStyle: React.CSSProperties =
    layout === "fixed" ? { width, height } : { width, minHeight: height };

  return (
    <>
      {isMounted && resolvedImage ? (
        <div className="hidden">
          <img
            src={resolvedImage}
            width={width}
            height={height}
            alt="hidden image"
          />
        </div>
      ) : null}

      <HoverCardPrimitive.Root
        openDelay={50}
        closeDelay={100}
        onOpenChange={(open) => {
          setOpen(open);
        }}
      >
        <HoverCardPrimitive.Trigger
          onMouseMove={handleMouseMove}
          className={cn("text-black dark:text-white", className)}
          href={url}
        >
          {children}
        </HoverCardPrimitive.Trigger>

        <HoverCardPrimitive.Content
          className="[transform-origin:var(--radix-hover-card-content-transform-origin)]"
          side="top"
          align="center"
          sideOffset={10}
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                className="shadow-xl rounded-xl"
                style={{
                  x: translateX,
                }}
              >
                <a
                  href={url}
                  className="block overflow-hidden rounded-xl border-2 border-transparent bg-white p-1 shadow hover:border-neutral-200 dark:bg-neutral-950 dark:hover:border-neutral-800"
                  style={{ fontSize: 0 }}
                >
                  {resolvedImage ? (
                    <img
                      src={resolvedImage}
                      width={width}
                      height={height}
                      className="rounded-lg"
                      alt={title || `Preview of ${url}`}
                    />
                  ) : (
                    <div
                      style={cardStyle}
                      className="flex flex-col gap-2 overflow-hidden rounded-lg bg-white p-3 text-left text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        {favicon ? (
                          <img
                            src={favicon}
                            alt=""
                            width={16}
                            height={16}
                            className="shrink-0 rounded-sm"
                          />
                        ) : null}
                        <span className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                          {resolvedSiteName}
                          {described.path ? ` ${described.path}` : ""}
                        </span>
                      </div>
                      {resolvedTitle ? (
                        <span
                          className="line-clamp-2 leading-snug font-semibold"
                          style={{ fontSize: 14 }}
                        >
                          {resolvedTitle}
                        </span>
                      ) : null}
                      {description ? (
                        <span
                          className="line-clamp-3 leading-relaxed text-neutral-600 dark:text-neutral-300"
                          style={{ fontSize: 12 }}
                        >
                          {description}
                        </span>
                      ) : null}
                    </div>
                  )}
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Root>
    </>
  );
};