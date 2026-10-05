import { ImageResponse } from "next/og";

/* Facet / OG card — the identity tile, the wordmark, one line of
   positioning, and the counts. Same dark island language as the
   site: near-black, violet rim, mono labels. */

export const alt = "Facet — precision interface primitives";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #050507 0%, #08080d 55%, #0a0714 100%)",
          fontFamily: "sans-serif",
          color: "#f5f5f7",
          position: "relative",
        }}
      >
        {/* violet bloom, upper right — flat radial stand-in */}
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -160,
            width: 640,
            height: 640,
            borderRadius: 640,
            background:
              "radial-gradient(circle, rgba(139,92,246,0.28) 0%, rgba(139,92,246,0.08) 45%, rgba(139,92,246,0) 70%)",
          }}
        />
        {/* fuchsia bloom, lower left */}
        <div
          style={{
            position: "absolute",
            bottom: -260,
            left: -120,
            width: 560,
            height: 560,
            borderRadius: 560,
            background:
              "radial-gradient(circle, rgba(217,70,239,0.16) 0%, rgba(217,70,239,0) 65%)",
          }}
        />

        {/* header row: identity tile + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 22,
              background: "linear-gradient(135deg, #6366f1, #0ea5e9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* the mark, drawn with transforms rather than inline SVG — satori
                (next/og) does not reliably render nested <svg>, and a hard
                failure here is an OG card that 404s its own image. A rotated
                square with a lighter crown reads as a cut stone at 88px. */}
            <div
              style={{
                position: "absolute",
                inset: 6,
                borderRadius: 17,
                background: "#0a0a0e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  transform: "rotate(45deg)",
                  background:
                    "linear-gradient(135deg, #f5f3ff 0%, #c4b5fd 45%, #a78bfa 100%)",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    marginTop: -2,
                    borderLeft: "20px solid transparent",
                    borderRight: "20px solid transparent",
                    borderTop: "22px solid #d946ef",
                  }}
                />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: -1.5 }}>
              Facet
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 16,
                color: "#8e8e9c",
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              precision interface primitives
            </div>
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 600,
              letterSpacing: -2,
              lineHeight: 1.08,
              maxWidth: 900,
            }}
          >
            Every stage is the component itself.
          </div>
          <div style={{ fontSize: 26, color: "#a5a5b3", maxWidth: 820 }}>
            Live, interactive, zero screenshots — motion-grade primitives for
            product surfaces, in light and dark.
          </div>
        </div>

        {/* footer strip: counts + rim */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            fontSize: 17,
            color: "#8e8e9c",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: 7,
                background: "#34d399",
              }}
            />
            <span style={{ letterSpacing: 1.5 }}>38 LIVE PRIMITIVES</span>
          </div>
          <div style={{ opacity: 0.35 }}>·</div>
          <span style={{ letterSpacing: 1.5 }}>10 FAMILIES</span>
          <div style={{ opacity: 0.35 }}>·</div>
          <span style={{ letterSpacing: 1.5 }}>76 VARIANT FORMS</span>
          <div style={{ opacity: 0.35 }}>·</div>
          <span style={{ letterSpacing: 1.5 }}>MIT LICENSED</span>
        </div>
      </div>
    ),
    size
  );
}
