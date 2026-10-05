/* Vendored from DavidHDev/react-bits — src/ts-default/TextAnimations/GlitchText.tsx (MIT + Commons Clause, see bits/ATTRIBUTION.md). Exports renamed with the Rb prefix to avoid API collision. Companion GlitchText.css is inlined below with every class/keyframe/custom-property namespaced to `rb-glitch-text-*`. */

"use client";

import { type FC, type CSSProperties } from 'react';

const RB_GLITCH_TEXT_CSS = String.raw`
.rb-glitch-text-glitch{
  color: #fff;
  font-size: clamp(2rem, 10vw, 8rem);
  font-weight: 900;
  position: relative;
  white-space: nowrap;
  margin: 0 auto;
  user-select: none;
  cursor: pointer;
}

.rb-glitch-text-glitch::after,
.rb-glitch-text-glitch::before{
  content: attr(data-text);
  position: absolute;
  top: 0;
  color: #fff;
  background-color: #120F17;
  overflow: hidden;
  clip-path: inset(0 0 0 0);
}

.rb-glitch-text-glitch:not(.rb-glitch-text-enable-on-hover)::after{
  left: 10px;
  text-shadow: var(--rb-glitch-text-after-shadow, -10px 0 red);
  animation: rb-glitch-text-animate-glitch var(--rb-glitch-text-after-duration, 3s) infinite linear alternate-reverse;
}
.rb-glitch-text-glitch:not(.rb-glitch-text-enable-on-hover)::before{
  left: -10px;
  text-shadow: var(--rb-glitch-text-before-shadow, 10px 0 cyan);
  animation: rb-glitch-text-animate-glitch var(--rb-glitch-text-before-duration, 2s) infinite linear alternate-reverse;
}

.rb-glitch-text-glitch.rb-glitch-text-enable-on-hover::after,
.rb-glitch-text-glitch.rb-glitch-text-enable-on-hover::before{
  content: '';
  opacity: 0;
  animation: none;
}

.rb-glitch-text-glitch.rb-glitch-text-enable-on-hover:hover::after{
  content: attr(data-text);
  opacity: 1;
  left: 10px;
  text-shadow: var(--rb-glitch-text-after-shadow, -10px 0 red);
  animation: rb-glitch-text-animate-glitch var(--rb-glitch-text-after-duration, 3s) infinite linear alternate-reverse;
}
.rb-glitch-text-glitch.rb-glitch-text-enable-on-hover:hover::before{
  content: attr(data-text);
  opacity: 1;
  left: -10px;
  text-shadow: var(--rb-glitch-text-before-shadow, 10px 0 cyan);
  animation: rb-glitch-text-animate-glitch var(--rb-glitch-text-before-duration, 2s) infinite linear alternate-reverse;
}

@keyframes rb-glitch-text-animate-glitch {
  0% {
    clip-path: inset(20% 0 50% 0);
  }
  5% {
    clip-path: inset(10% 0 60% 0);
  }
  10% {
    clip-path: inset(15% 0 55% 0);
  }
  15% {
    clip-path: inset(25% 0 35% 0);
  }
  20% {
    clip-path: inset(30% 0 40% 0);
  }
  25% {
    clip-path: inset(40% 0 20% 0);
  }
  30% {
    clip-path: inset(10% 0 60% 0);
  }
  35% {
    clip-path: inset(15% 0 55% 0);
  }
  40% {
    clip-path: inset(25% 0 35% 0);
  }
  45% {
    clip-path: inset(30% 0 40% 0);
  }
  50% {
    clip-path: inset(20% 0 50% 0);
  }
  55% {
    clip-path: inset(10% 0 60% 0);
  }
  60% {
    clip-path: inset(15% 0 55% 0);
  }
  65% {
    clip-path: inset(25% 0 35% 0);
  }
  70% {
    clip-path: inset(30% 0 40% 0);
  }
  75% {
    clip-path: inset(40% 0 20% 0);
  }
  80% {
    clip-path: inset(20% 0 50% 0);
  }
  85% {
    clip-path: inset(10% 0 60% 0);
  }
  90% {
    clip-path: inset(15% 0 55% 0);
  }
  95% {
    clip-path: inset(25% 0 35% 0);
  }
  100% {
    clip-path: inset(30% 0 40% 0);
  }
}
`;

function RbInjectedStyle({ css }: { css: string }) {
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
interface GlitchTextProps {
  children: string;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
}

interface CustomCSSProperties extends CSSProperties {
  '--rb-glitch-text-after-duration': string;
  '--rb-glitch-text-before-duration': string;
  '--rb-glitch-text-after-shadow': string;
  '--rb-glitch-text-before-shadow': string;
}

const RbGlitchText: FC<GlitchTextProps> = ({
  children,
  speed = 0.5,
  enableShadows = true,
  enableOnHover = false,
  className = ''
}) => {
  const inlineStyles: CustomCSSProperties = {
    '--rb-glitch-text-after-duration': `${speed * 3}s`,
    '--rb-glitch-text-before-duration': `${speed * 2}s`,
    '--rb-glitch-text-after-shadow': enableShadows ? '-5px 0 red' : 'none',
    '--rb-glitch-text-before-shadow': enableShadows ? '5px 0 cyan' : 'none'
  };

  const hoverClass = enableOnHover ? 'rb-glitch-text-enable-on-hover' : '';

  return (
    <>
      <RbInjectedStyle css={RB_GLITCH_TEXT_CSS} />
      {(
    <div className={`rb-glitch-text-glitch ${hoverClass} ${className}`} style={inlineStyles} data-text={children}>
      {children}
    </div>
  )}
    </>
  )
};

export default RbGlitchText;
