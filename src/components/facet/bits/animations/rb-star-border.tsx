/* Vendored from DavidHDev/react-bits — src/ts-default/Animations/StarBorder.tsx (MIT + Commons Clause, see bits/ATTRIBUTION.md). Exports renamed with the Rb prefix to avoid API collision. Companion StarBorder.css is inlined below with every class/keyframe/custom-property namespaced to `rb-star-border-*`. */

"use client";

import React from 'react';

const RB_STAR_BORDER_CSS = String.raw`
.rb-star-border-star-border-container{
  display: inline-block;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
}

.rb-star-border-border-gradient-bottom{
  position: absolute;
  width: 300%;
  height: 50%;
  opacity: 0.7;
  bottom: -12px;
  right: -250%;
  border-radius: 50%;
  animation: rb-star-border-star-movement-bottom linear infinite alternate;
  z-index: 0;
}

.rb-star-border-border-gradient-top{
  position: absolute;
  opacity: 0.7;
  width: 300%;
  height: 50%;
  top: -12px;
  left: -250%;
  border-radius: 50%;
  animation: rb-star-border-star-movement-top linear infinite alternate;
  z-index: 0;
}

.rb-star-border-inner-content{
  position: relative;
  border: 1px solid #222;
  background: #000;
  color: white;
  font-size: 16px;
  text-align: center;
  padding: 16px 26px;
  border-radius: 20px;
  z-index: 1;
}

@keyframes rb-star-border-star-movement-bottom {
  0% {
    transform: translate(0%, 0%);
    opacity: 1;
  }
  100% {
    transform: translate(-100%, 0%);
    opacity: 0;
  }
}

@keyframes rb-star-border-star-movement-top {
  0% {
    transform: translate(0%, 0%);
    opacity: 1;
  }
  100% {
    transform: translate(100%, 0%);
    opacity: 0;
  }
}
`;

function RbInjectedStyle({ css }: { css: string }) {
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
type StarBorderProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: React.CSSProperties['animationDuration'];
  thickness?: number;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  /**
   * Accessible name for the control. Only applied when there are no children to
   * name it from — see the render below.
   */
  label?: string;
};

const RbStarBorder = <T extends React.ElementType = 'button'>({
  as,
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  backgroundColor = '#000000',
  textColor = '#ffffff',
  borderColor = '#222222',
  children,
  label = 'Star border',
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || 'button';

  /* `as` defaults to <button>, and the children are wrapped in the decorative
     gradient layers rather than rendered as the label, so with no children the
     control ends up completely unnamed — a focus stop that says nothing. Name it
     from `label` in exactly that case. When children are present they may carry
     their own text, and an aria-label would override it, so it is left off. */
  const unnamed = children === undefined || children === null || children === false;

  return (
    <>
      <RbInjectedStyle css={RB_STAR_BORDER_CSS} />
      {(
    <Component
      className={`rb-star-border-star-border-container ${className}`}
      aria-label={unnamed ? label : undefined}
      {...(rest as any)}
      style={{
        padding: `${thickness}px 0`,
        ...(rest as any).style
      }}
    >
      <div
        className="rb-star-border-border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      ></div>
      <div
        className="rb-star-border-border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animationDuration: speed
        }}
      ></div>
      <div className="rb-star-border-inner-content" style={{ background: backgroundColor, color: textColor, borderColor }}>
        {children}
      </div>
    </Component>
  )}
    </>
  )
};

export default RbStarBorder;
