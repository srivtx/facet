/* Vendored from DavidHDev/react-bits — src/ts-default/Animations/GlareHover.tsx (MIT + Commons Clause, see bits/ATTRIBUTION.md). Exports renamed with the Rb prefix to avoid API collision. Companion GlareHover.css is inlined below with every class/keyframe/custom-property namespaced to `rb-glare-hover-*`. */

"use client";

import React from 'react';

const RB_GLARE_HOVER_CSS = String.raw`
.rb-glare-hover-glare-hover{
  width: var(--rb-glare-hover-gh-width);
  height: var(--rb-glare-hover-gh-height);
  background: var(--rb-glare-hover-gh-bg);
  border-radius: var(--rb-glare-hover-gh-br);
  border: 1px solid var(--rb-glare-hover-gh-border);
  overflow: hidden;
  position: relative;
  display: grid;
  place-items: center;
}

.rb-glare-hover-glare-hover::before{
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    var(--rb-glare-hover-gh-angle),
    hsla(0, 0%, 0%, 0) 60%,
    var(--rb-glare-hover-gh-rgba) 70%,
    hsla(0, 0%, 0%, 0),
    hsla(0, 0%, 0%, 0) 100%
  );
  transition: var(--rb-glare-hover-gh-duration) ease;
  background-size:
    var(--rb-glare-hover-gh-size) var(--rb-glare-hover-gh-size),
    100% 100%;
  background-repeat: no-repeat;
  background-position:
    -100% -100%,
    0 0;
}

.rb-glare-hover-glare-hover:hover{
  cursor: pointer;
}

.rb-glare-hover-glare-hover:hover::before{
  background-position:
    100% 100%,
    0 0;
}

.rb-glare-hover-glare-hover--play-once::before{
  transition: none;
}

.rb-glare-hover-glare-hover--play-once:hover::before{
  transition: var(--rb-glare-hover-gh-duration) ease;
  background-position:
    100% 100%,
    0 0;
}
`;

function RbInjectedStyle({ css }: { css: string }) {
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
interface GlareHoverProps {
  width?: string;
  height?: string;
  background?: string;
  borderRadius?: string;
  borderColor?: string;
  children?: React.ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const RbGlareHover: React.FC<GlareHoverProps> = ({
  width = '500px',
  height = '500px',
  background = '#000',
  borderRadius = '10px',
  borderColor = '#333',
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.5,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
  playOnce = false,
  className = '',
  style = {}
}) => {
  const hex = glareColor.replace('#', '');
  let rgba = glareColor;
  if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  } else if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  }

  const vars: React.CSSProperties & { [k: string]: string } = {
    '--rb-glare-hover-gh-width': width,
    '--rb-glare-hover-gh-height': height,
    '--rb-glare-hover-gh-bg': background,
    '--rb-glare-hover-gh-br': borderRadius,
    '--rb-glare-hover-gh-angle': `${glareAngle}deg`,
    '--rb-glare-hover-gh-duration': `${transitionDuration}ms`,
    '--rb-glare-hover-gh-size': `${glareSize}%`,
    '--rb-glare-hover-gh-rgba': rgba,
    '--rb-glare-hover-gh-border': borderColor
  };

  return (
    <>
      <RbInjectedStyle css={RB_GLARE_HOVER_CSS} />
      {(
    <div
      className={`rb-glare-hover-glare-hover ${playOnce ? 'rb-glare-hover-glare-hover--play-once' : ''} ${className}`}
      style={{ ...vars, ...style } as React.CSSProperties}
    >
      {children}
    </div>
  )}
    </>
  )
};

export default RbGlareHover;
