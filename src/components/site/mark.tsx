/* Facet / mark — the identity glyph.
 *
 * A cut stone: table on top, crown facets, pavilion below, one girdle line.
 * Drawn inline rather than loaded from public/logo.svg so it inherits
 * currentColor-ish theming and never costs a request on the critical path.
 *
 * At 16px the facet seams vanish and it reads as a diamond, which is the point
 * — the silhouette has to survive before the detail does.
 */

export function FacetMark({
  className,
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={className}
      style={{
        display: "inline-grid",
        placeItems: "center",
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.25),
        background: "linear-gradient(135deg, #6366f1, #0ea5e9)",
        position: "relative",
        flexShrink: 0,
      }}
      aria-hidden
    >
      <span
        style={{
          position: "absolute",
          inset: 1.5,
          borderRadius: Math.round(size * 0.2),
          background: "#0a0a0e",
        }}
      />
      <svg
        viewBox="0 0 32 32"
        width={size * 0.66}
        height={size * 0.66}
        fill="none"
        style={{ position: "relative" }}
      >
        <defs>
          <linearGradient id="facet-stone" x1="0.15" y1="0" x2="0.9" y2="1">
            <stop offset="0" stopColor="#f5f3ff" />
            <stop offset="0.45" stopColor="#c4b5fd" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <g strokeLinejoin="round">
          <path d="M16 6.6 L23.4 11.7 L16 16.4 L8.6 11.7 Z" fill="url(#facet-stone)" />
          <path d="M8.6 11.7 L16 16.4 L11.9 25.4 L5.9 16.6 Z" fill="#8b5cf6" />
          <path d="M23.4 11.7 L26.1 16.6 L20.1 25.4 L16 16.4 Z" fill="#d946ef" />
          <path d="M11.9 25.4 L16 16.4 L20.1 25.4 Z" fill="#a78bfa" />
          <path
            d="M8.6 11.7 L23.4 11.7"
            stroke="#f5f3ff"
            strokeOpacity="0.5"
            strokeWidth="0.8"
          />
        </g>
      </svg>
    </span>
  );
}

export default FacetMark;