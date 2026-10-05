"use client";
/* Vendored from DavidHDev/react-bits — Components/ReflectiveCard/ReflectiveCard.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import React, { useEffect, useRef, useState } from 'react';
import { Fingerprint, User, Activity, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const RB_REFLECTIVE_CARD_CSS = `
.rb-reflective-card-reflective-card-container {
  position: relative;
  width: 320px;
  height: 500px;
  border-radius: 20px;
  overflow: hidden;
  background: #1a1a1a;
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  isolation: isolate;
  font-family: 'Inter', sans-serif;
}

.rb-reflective-card-reflective-svg-filters {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
  opacity: 0;
}

.rb-reflective-card-reflective-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.2) scaleX(-1);

  filter: saturate(var(--saturation, 0)) contrast(120%) brightness(110%) blur(var(--blur-strength, 12px))
    url(#metallic-displacement);

  z-index: 0;
  opacity: 0.9;
  transition: filter 0.3s ease;
}

.rb-reflective-card-reflective-noise {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: var(--roughness, 0.4);
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
}

.rb-reflective-card-reflective-sheen {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0.1) 40%,
    rgba(255, 255, 255, 0) 50%,
    rgba(255, 255, 255, 0.1) 60%,
    rgba(255, 255, 255, 0.3) 100%
  );
  pointer-events: none;
  mix-blend-mode: overlay;
  opacity: var(--metalness, 1);
}

.rb-reflective-card-reflective-border {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 1px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.6) 100%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  z-index: 20;
  pointer-events: none;
}

.rb-reflective-card-reflective-content {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px;
  color: var(--text-color, white);
  background: var(--overlay-color, rgba(255, 255, 255, 0.05));
}

.rb-reflective-card-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 16px;
}

.rb-reflective-card-security-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.rb-reflective-card-status-icon {
  opacity: 0.8;
}

.rb-reflective-card-card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: center;
  text-align: center;
  gap: 24px;
  margin-bottom: 2em;
}

.rb-reflective-card-user-name {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.rb-reflective-card-user-role {
  font-size: 12px;
  letter-spacing: 0.2em;
  opacity: 0.7;
  margin: 0;
  text-transform: uppercase;
}

.rb-reflective-card-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 24px;
}

.rb-reflective-card-id-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rb-reflective-card-label {
  font-size: 9px;
  letter-spacing: 0.1em;
  opacity: 0.6;
}

.rb-reflective-card-value {
  font-family: monospace;
  font-size: 14px;
  letter-spacing: 0.05em;
}

.rb-reflective-card-fingerprint-icon {
  opacity: 0.4;
}

`;

interface ReflectiveCardProps {
  blurStrength?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
  overlayColor?: string;
  displacementStrength?: number;
  noiseScale?: number;
  specularConstant?: number;
  grayscale?: number;
  glassDistortion?: number;
  /**
   * Opt in to the live camera reflection. Off by default: rendering the card
   * should not silently prompt for camera access.
   */
  enableWebcam?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const RbReflectiveCard: React.FC<ReflectiveCardProps> = ({
  blurStrength = 12,
  color = 'white',
  metalness = 1,
  roughness = 0.4,
  overlayColor = 'rgba(255, 255, 255, 0.1)',
  displacementStrength = 20,
  noiseScale = 1,
  specularConstant = 1.2,
  grayscale = 1,
  glassDistortion = 0,
  enableWebcam = false,
  className = '',
  style = {}
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);

  useEffect(() => {
    if (!enableWebcam) return undefined;
    let stream: MediaStream | null = null;
    let cancelled = false;

    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          }
        });
      } catch {
        /* No camera, or permission denied. That is a normal state for this card —
           it just renders without the reflection — not an application error. */
        return;
      }
      if (cancelled) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
      }
    };

    void startWebcam();

    return () => {
      cancelled = true;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [enableWebcam]);

  const baseFrequency = 0.03 / Math.max(0.1, noiseScale);
  const saturation = 1 - Math.max(0, Math.min(1, grayscale));

  const cssVariables = {
    '--blur-strength': `${blurStrength}px`,
    '--metalness': metalness,
    '--roughness': roughness,
    '--overlay-color': overlayColor,
    '--text-color': color,
    '--saturation': saturation
  } as React.CSSProperties;

  return (
    <>
          <style href="rb-reflective-card" precedence="rb">{RB_REFLECTIVE_CARD_CSS}</style>
          <div className={cn("rb-reflective-card-reflective-card-container", className)} style={{ ...style, ...cssVariables }}>
      <svg className={cn("rb-reflective-card-reflective-svg-filters")} aria-hidden="true">
        <defs>
          <filter id="metallic-displacement" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency={baseFrequency} numOctaves="2" result="noise" />
            <feColorMatrix in="noise" type="luminanceToAlpha" result="noiseAlpha" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={displacementStrength}
              xChannelSelector="R"
              yChannelSelector="G"
              result="rippled"
            />
            <feSpecularLighting
              in="noiseAlpha"
              surfaceScale={displacementStrength}
              specularConstant={specularConstant}
              specularExponent="20"
              lightingColor="#ffffff"
              result="light"
            >
              <fePointLight x="0" y="0" z="300" />
            </feSpecularLighting>
            <feComposite in="light" in2="rippled" operator="in" result="light-effect" />
            <feBlend in="light-effect" in2="rippled" mode="screen" result="metallic-result" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="solidAlpha"
            />
            <feMorphology in="solidAlpha" operator="erode" radius="45" result="erodedAlpha" />
            <feGaussianBlur in="erodedAlpha" stdDeviation="10" result="blurredMap" />
            <feComponentTransfer in="blurredMap" result="glassMap">
              <feFuncA type="linear" slope="0.5" intercept="0" />
            </feComponentTransfer>
            <feDisplacementMap
              in="metallic-result"
              in2="glassMap"
              scale={glassDistortion}
              xChannelSelector="A"
              yChannelSelector="A"
              result="final"
            />
          </filter>
        </defs>
      </svg>

      <video ref={videoRef} autoPlay playsInline muted className={cn("rb-reflective-card-reflective-video")} />

      <div className={cn("rb-reflective-card-reflective-noise")} />
      <div className={cn("rb-reflective-card-reflective-sheen")} />
      <div className={cn("rb-reflective-card-reflective-border")} />

      <div className={cn("rb-reflective-card-reflective-content")}>
        <div className={cn("rb-reflective-card-card-header")}>
          <div className={cn("rb-reflective-card-security-badge")}>
            <Lock size={14} className={cn("rb-reflective-card-security-icon")} />
            <span>SECURE ACCESS</span>
          </div>
          <Activity className={cn("rb-reflective-card-status-icon")} size={20} />
        </div>

        <div className={cn("rb-reflective-card-card-body")}>
          <div className={cn("rb-reflective-card-user-info")}>
            <h2 className={cn("rb-reflective-card-user-name")}>ALEXANDER DOE</h2>
            <p className={cn("rb-reflective-card-user-role")}>SENIOR DEVELOPER</p>
          </div>
        </div>

        <div className={cn("rb-reflective-card-card-footer")}>
          <div className={cn("rb-reflective-card-id-section")}>
            <span className={cn("rb-reflective-card-label")}>ID NUMBER</span>
            <span className={cn("rb-reflective-card-value")}>8901-2345-6789</span>
          </div>
          <div className={cn("rb-reflective-card-fingerprint-section")}>
            <Fingerprint size={32} className={cn("rb-reflective-card-fingerprint-icon")} />
          </div>
        </div>
      </div>
    </div>
        </>
  );
};

export { RbReflectiveCard };
export default RbReflectiveCard;
