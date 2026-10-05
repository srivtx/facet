"use client";
/* Vendored from DavidHDev/react-bits — Micro/RefineFrame/RefineFrame.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
import React, { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Alert02Icon, Loading03Icon, RefreshIcon, Tick02Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

const RB_REFINE_FRAME_CSS = `
.rb-refine-frame-refine-frame {
  --rf-w: 320px;
  --rf-aspect: 4 / 3;
  --rf-radius: 16px;
  --rf-bg: #27272a;
  --rf-ink: #f5f5f5;
  --rf-stage: 400ms;
  --rf-blur: 1.5px;
  --rf-sat: 0.8;
  --rf-scale: 1.02;
  --rf-opacity: 0.85;
  --rf-error: #ef4444;
  --rf-ease-out: cubic-bezier(0.23, 1, 0.32, 1);

  position: relative;
  isolation: isolate;
  width: min(var(--rf-w), 100%);
  aspect-ratio: var(--rf-aspect);
  border-radius: var(--rf-radius);
  overflow: hidden;
  background: var(--rf-bg);
  color: var(--rf-ink);
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}

.rb-refine-frame-refine-frame__media {
  position: absolute;
  inset: 0;
  opacity: var(--rf-opacity);
  filter: blur(var(--rf-blur)) saturate(var(--rf-sat));
  transform: scale(var(--rf-scale));
  transition:
    opacity var(--rf-stage) var(--rf-ease-out),
    filter var(--rf-stage) var(--rf-ease-out),
    transform var(--rf-stage) var(--rf-ease-out);
}

.rb-refine-frame-refine-frame[data-status='queued'] .rb-refine-frame-refine-frame__media {
  animation: rb-refine-frame-refine-frame-wait 2.4s ease-in-out infinite;
}

@keyframes rb-refine-frame-refine-frame-wait {
  0%,
  100% {
    opacity: 0.45;
  }

  50% {
    opacity: 0.65;
  }
}

.rb-refine-frame-refine-frame__print {
  width: 100%;
  height: 100%;
  transition: opacity var(--rf-stage) ease;
}

.rb-refine-frame-refine-frame__print > * {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rb-refine-frame-refine-frame[data-mosaic] .rb-refine-frame-refine-frame__print {
  opacity: 0;
}

.rb-refine-frame-refine-frame[data-resolved] .rb-refine-frame-refine-frame__print {
  opacity: 1;
}

.rb-refine-frame-refine-frame__mosaic {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--rf-stage) ease;
}

.rb-refine-frame-refine-frame[data-mosaic] .rb-refine-frame-refine-frame__mosaic {
  opacity: 1;
}

.rb-refine-frame-refine-frame[data-resolved] .rb-refine-frame-refine-frame__mosaic {
  opacity: 0;
}

.rb-refine-frame-refine-frame__sweep {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    115deg,
    transparent 38%,
    color-mix(in srgb, var(--rf-ink) 14%, transparent) 50%,
    transparent 62%
  );
  background-size: 260% 100%;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--rf-stage) ease;
}

.rb-refine-frame-refine-frame[data-sweep]:not([data-mosaic]) .rb-refine-frame-refine-frame__sweep {
  opacity: 1;
  animation: rb-refine-frame-refine-frame-sweep 2.2s linear infinite;
}

@keyframes rb-refine-frame-refine-frame-sweep {
  from {
    background-position: 130% 0;
  }

  to {
    background-position: -130% 0;
  }
}

.rb-refine-frame-refine-frame__chip {
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding: 0 10px 0 8px;
  border-radius: 13px;
  background: color-mix(in srgb, var(--rf-bg) 72%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  opacity: 1;
  transform: translateY(0);
  pointer-events: none;
  transition:
    opacity 200ms ease,
    transform 200ms var(--rf-ease-out);
}

@starting-style {
  .rb-refine-frame-refine-frame__chip {
    opacity: 0;
    transform: translateY(4px);
  }
}

.rb-refine-frame-refine-frame__mark {
  display: inline-flex;
  color: color-mix(in srgb, var(--rf-ink) 80%, transparent);
}

.rb-refine-frame-refine-frame__mark[data-kind='spin'] {
  animation: rb-refine-frame-refine-frame-spin 1.1s linear infinite;
}

.rb-refine-frame-refine-frame__mark[data-kind='error'] {
  color: var(--rf-error);
}

@keyframes rb-refine-frame-refine-frame-spin {
  to {
    transform: rotate(360deg);
  }
}

.rb-refine-frame-refine-frame__label {
  animation: rb-refine-frame-refine-frame-label 200ms ease both;
}

@keyframes rb-refine-frame-refine-frame-label {
  from {
    opacity: 0;
    filter: blur(2px);
  }
}

.rb-refine-frame-refine-frame__retry {
  position: absolute;
  top: 50%;
  left: 50%;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 14px 0 12px;
  border: 0;
  border-radius: 16px;
  background: color-mix(in srgb, var(--rf-ink) 14%, var(--rf-bg));
  color: var(--rf-ink);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
  -webkit-tap-highlight-color: transparent;
  transition:
    opacity 200ms ease,
    transform 160ms var(--rf-ease-out),
    background-color 150ms ease;
}

@starting-style {
  .rb-refine-frame-refine-frame__retry {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.96);
  }
}

.rb-refine-frame-refine-frame__retry:active {
  transform: translate(-50%, -50%) scale(0.96);
}

@media (hover: hover) and (pointer: fine) {
  .rb-refine-frame-refine-frame__retry:hover {
    background: color-mix(in srgb, var(--rf-ink) 20%, var(--rf-bg));
  }
}

.rb-refine-frame-refine-frame__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .rb-refine-frame-refine-frame__media {
    transition: opacity var(--rf-stage) ease;
  }

  .rb-refine-frame-refine-frame[data-sweep] .rb-refine-frame-refine-frame__sweep {
    animation: none;
    opacity: 0;
  }

  .rb-refine-frame-refine-frame[data-status='queued'] .rb-refine-frame-refine-frame__media {
    animation: none;
  }

  .rb-refine-frame-refine-frame__mark[data-kind='spin'] {
    animation: none;
  }

  .rb-refine-frame-refine-frame__chip,
  .rb-refine-frame-refine-frame__retry {
    transition: opacity 200ms ease;
  }

  .rb-refine-frame-refine-frame__retry:active {
    transform: translate(-50%, -50%);
  }
}

`;

export type RefineFrameStatus = 'queued' | 'generating' | 'refining' | 'complete' | 'error';

export interface RefineFrameProps {
  status?: RefineFrameStatus;
  children?: ReactNode;
  aspectRatio?: string;
  width?: number;
  radius?: number;
  background?: string;
  color?: string;
  stageDuration?: number;
  sweep?: boolean;
  showStatus?: boolean;
  hideAfter?: number;
  labels?: Partial<Record<RefineFrameStatus, string>>;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

type Stage = { blur: number; sat: number; scale: number; opacity: number };
interface Sim {
  p: number;
  raf: number;
  last: number;
  key: string;
  w: number;
  h: number;
  levels: HTMLCanvasElement[];
  glint: CanvasGradient | null;
  sent: boolean;
}
interface Live {
  status: RefineFrameStatus;
  stageDuration: number;
  sweep: boolean;
  reduce: boolean;
}

const STAGES: Record<RefineFrameStatus, Stage> = {
  queued: { blur: 4, sat: 0.6, scale: 1.04, opacity: 0.55 },
  generating: { blur: 1.5, sat: 0.8, scale: 1.02, opacity: 0.85 },
  refining: { blur: 0.5, sat: 0.95, scale: 1.005, opacity: 1 },
  complete: { blur: 0, sat: 1, scale: 1, opacity: 1 },
  error: { blur: 2, sat: 0.5, scale: 1, opacity: 0.28 }
};
const TARGET: Partial<Record<RefineFrameStatus, number>> = { queued: 0, generating: 0.5, refining: 0.875, complete: 1 };
const LEVELS = [48, 32, 20, 12, 8, 5, 3, 2, 1];
const EDGE = 28;
const STRIPS = 14;
const DEFAULT_LABELS: Record<RefineFrameStatus, string> = {
  queued: 'Queued',
  generating: 'Generating',
  refining: 'Refining',
  complete: 'Ready',
  error: 'Failed'
};
const ACTIVE = new Set<string>(['queued', 'generating', 'refining']);

const build = (s: Sim, canvas: HTMLCanvasElement, img: HTMLImageElement, dpr: number) => {
  const rect = canvas.getBoundingClientRect();
  const W = Math.max(1, Math.round(rect.width * dpr));
  const H = Math.max(1, Math.round(rect.height * dpr));
  const key = `${img.currentSrc}|${W}x${H}`;
  if (s.key === key) return;
  s.key = key;
  s.w = W;
  s.h = H;
  canvas.width = W;
  canvas.height = H;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const cover = Math.max(W / iw, H / ih);
  const sw = W / cover;
  const sh = H / cover;
  const sx = (iw - sw) / 2;
  const sy = (ih - sh) / 2;
  const glint = canvas.getContext('2d')?.createLinearGradient(0, 0, W, 0) ?? null;
  if (glint) {
    for (const [at, a] of [
      [0, 0],
      [0.08, 0.1],
      [0.2, 0.7],
      [0.32, 1],
      [0.68, 1],
      [0.8, 0.7],
      [0.92, 0.1],
      [1, 0]
    ]) {
      glint.addColorStop(at, `rgba(255, 255, 255, ${a})`);
    }
  }
  s.glint = glint;
  s.levels = LEVELS.map(block => {
    const b = block === 1 ? 1 : Math.max(2, Math.round(block * dpr));
    const full = document.createElement('canvas');
    full.width = W;
    full.height = H;
    const fc = full.getContext('2d');
    if (!fc) return full;
    if (b === 1) {
      fc.imageSmoothingEnabled = true;
      fc.imageSmoothingQuality = 'high';
      fc.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
      return full;
    }
    const small = document.createElement('canvas');
    small.width = Math.max(1, Math.round(W / b));
    small.height = Math.max(1, Math.round(H / b));
    const sc = small.getContext('2d');
    if (sc) {
      sc.imageSmoothingEnabled = true;
      sc.imageSmoothingQuality = 'high';
      sc.drawImage(img, sx, sy, sw, sh, 0, 0, small.width, small.height);
    }
    fc.imageSmoothingEnabled = false;
    fc.drawImage(small, 0, 0, W, H);
    return full;
  });
};

const RbRefineFrame: React.FC<RefineFrameProps> = ({
  status = 'generating',
  children,
  aspectRatio = '4 / 3',
  width = 320,
  radius = 16,
  background = '#27272a',
  color = '#f5f5f5',
  stageDuration = 400,
  sweep = true,
  showStatus = true,
  hideAfter = 1200,
  labels = DEFAULT_LABELS,
  retryLabel = 'Retry',
  onRetry,
  className = ''
}) => {
  const stage = STAGES[status] ?? STAGES.generating;
  const active = ACTIVE.has(status);
  const text = { ...DEFAULT_LABELS, ...labels };
  const printRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sim = useRef<Sim>({ p: 0, raf: 0, last: 0, key: '', w: 0, h: 0, levels: [], glint: null, sent: false });
  const live = useRef<Live>({} as Live);
  live.current = { status, stageDuration, sweep, reduce: false };
  const [mosaic, setMosaic] = useState(false);
  const [resolved, setResolved] = useState(false);

  const [chip, setChip] = useState(showStatus);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    clearTimeout(timer.current);
    if (!showStatus) {
      setChip(false);
      return undefined;
    }
    setChip(true);
    if (status === 'complete' && hideAfter > 0) {
      timer.current = setTimeout(() => setChip(false), hideAfter);
    }
    return () => clearTimeout(timer.current);
  }, [status, showStatus, hideAfter]);

  const tick = (now: number) => {
    const s = sim.current;
    const c = live.current;
    const canvas = canvasRef.current;
    const img = printRef.current?.querySelector('img') as HTMLImageElement | null;
    if (!canvas || !img || !img.naturalWidth) {
      s.raf = 0;
      return;
    }
    const dt = Math.min(0.05, s.last ? (now - s.last) / 1000 : 0.016);
    s.last = now;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    build(s, canvas, img, dpr);
    const n = s.levels.length - 1;
    const target = TARGET[c.status] ?? s.p;
    const rate = c.reduce ? 1e9 : 1 / (n * (c.stageDuration / 1000));
    const step = rate * dt;
    if (target < s.p) s.p = target;
    else if (target - s.p <= step) s.p = target;
    else s.p += step;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const L = s.p * n;
      const i = Math.min(n, Math.floor(L + 1e-6));
      const frac = L - i;
      ctx.globalAlpha = 1;
      ctx.drawImage(s.levels[i], 0, 0);
      if (i < n && frac > 0) {
        const edge = EDGE * dpr;
        const front = frac * (s.h + edge) - edge / 2;
        const top = Math.max(0, Math.floor(front - edge / 2));
        if (top > 0) ctx.drawImage(s.levels[i + 1], 0, 0, s.w, top, 0, 0, s.w, top);
        const sh = edge / STRIPS;
        for (let k = 0; k < STRIPS; k += 1) {
          const y = front - edge / 2 + k * sh;
          if (y + sh <= 0 || y >= s.h) continue;
          const t = 1 - (k + 0.5) / STRIPS;
          ctx.globalAlpha = t * t * (3 - 2 * t);
          const y0 = Math.max(0, y);
          const h0 = Math.min(s.h, y + sh) - y0;
          if (h0 > 0) ctx.drawImage(s.levels[i + 1], 0, y0, s.w, h0, 0, y0, s.w, h0);
        }
        ctx.globalAlpha = 1;
        if (c.sweep && !c.reduce && s.glint && front > 0 && front < s.h) {
          ctx.fillStyle = s.glint;
          ctx.globalAlpha = 0.12;
          ctx.fillRect(0, front - 2 * dpr, s.w, 4 * dpr);
          ctx.globalAlpha = 0.3;
          ctx.fillRect(0, front - dpr, s.w, 2 * dpr);
          ctx.globalAlpha = 1;
        }
      }
    }
    const done = s.p >= 1;
    if (done !== s.sent) {
      s.sent = done;
      setResolved(done);
    }
    const keep = (!c.reduce && ACTIVE.has(c.status)) || Math.abs(target - s.p) > 0.0005;
    s.raf = keep ? requestAnimationFrame(tick) : 0;
    if (!keep) s.last = 0;
  };
  const wake = () => {
    const s = sim.current;
    if (!s.raf) s.raf = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      live.current.reduce = mq.matches;
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const img = printRef.current?.querySelector('img') as HTMLImageElement | null;
    if (!img) {
      setMosaic(false);
      return undefined;
    }
    let gone = false;
    const start = () => {
      if (gone) return;
      setMosaic(true);
      wake();
    };
    if (img.complete && img.naturalWidth) start();
    else img.addEventListener('load', start, { once: true });
    return () => {
      gone = true;
      img.removeEventListener('load', start);
    };
     
  }, [children, status]);

  useEffect(() => {
    wake();
     
  }, [status, width, aspectRatio]);

  useEffect(() => {
    const s = sim.current;
    return () => cancelAnimationFrame(s.raf);
  }, []);

  return (
    <>
          <style href="rb-refine-frame" precedence="rb">{RB_REFINE_FRAME_CSS}</style>
          <div
      className={`rb-refine-frame-refine-frame${className ? ` ${className}` : ''}`}
      role="img"
      aria-label={text[status] ?? status}
      aria-busy={active || undefined}
      data-status={status}
      data-active={active ? '' : undefined}
      data-sweep={sweep && active ? '' : undefined}
      data-mosaic={mosaic ? '' : undefined}
      data-resolved={mosaic && resolved ? '' : undefined}
      style={
        {
          '--rf-w': `${width}px`,
          '--rf-aspect': aspectRatio,
          '--rf-radius': `${radius}px`,
          '--rf-bg': background,
          '--rf-ink': color,
          '--rf-stage': `${stageDuration}ms`,
          '--rf-blur': `${mosaic ? 0 : stage.blur}px`,
          '--rf-sat': stage.sat,
          '--rf-scale': mosaic ? 1 : stage.scale,
          '--rf-opacity': stage.opacity
        } as CSSProperties
      }
    >
      <div className={cn("rb-refine-frame-refine-frame__media")} aria-hidden="true">
        <div ref={printRef} className={cn("rb-refine-frame-refine-frame__print")}>
          {children}
        </div>
        <canvas ref={canvasRef} className={cn("rb-refine-frame-refine-frame__mosaic")} />
      </div>
      <div className={cn("rb-refine-frame-refine-frame__sweep")} aria-hidden="true" />
      {chip ? (
        <div className={cn("rb-refine-frame-refine-frame__chip")} aria-hidden="true">
          <span className={cn("rb-refine-frame-refine-frame__mark")} data-kind={active ? 'spin' : status}>
            {status === 'complete' ? (
              <HugeiconsIcon icon={Tick02Icon} size={13} strokeWidth={2.5} />
            ) : status === 'error' ? (
              <HugeiconsIcon icon={Alert02Icon} size={13} strokeWidth={2.2} />
            ) : (
              <HugeiconsIcon icon={Loading03Icon} size={13} strokeWidth={2.2} />
            )}
          </span>
          <span key={status} className={cn("rb-refine-frame-refine-frame__label")}>
            {text[status] ?? status}
          </span>
        </div>
      ) : null}
      {status === 'error' && onRetry ? (
        <button type="button" className={cn("rb-refine-frame-refine-frame__retry")} onClick={onRetry}>
          <HugeiconsIcon icon={RefreshIcon} size={14} strokeWidth={2.2} />
          <span>{retryLabel}</span>
        </button>
      ) : null}
      <span className={cn("rb-refine-frame-refine-frame__sr")} role="status">
        {text[status] ?? status}
      </span>
    </div>
        </>
  );
};

export { RbRefineFrame };
export default RbRefineFrame;
