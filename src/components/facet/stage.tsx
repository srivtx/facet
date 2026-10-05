"use client";

/* Facet / DemoStage — maps a registry entry + variant to its live renderer.
   Every demo is the real component, not a screenshot. */

import React from "react";
import { cn } from "@/lib/utils";
import { Sheen, Sweep, Halo, Notch, Pop, Candy, CheckoutBench } from "./buttons";
import { FlipCycle, MorphStream, Cascade, Glitch, RollDigits } from "./textfx";
import { Corona, Flux, TraceGrid, BeamLines, AuroraVeil } from "./ambience";
import { PointerCard, HaloCard, StackDeck, VoiceCard } from "./cards";
import { IsoStage, TiltCard, Ribbon, OrbitCam } from "./motion3d";
import { OrbitGallery, DiagonalRail, CursorTrail } from "./galleries";
import { NotchBar, SpotBar, GlassDock } from "./navigation";
import { Kinetic, Shutter, OrbitDot } from "./loaders";
import { GooSearch, TypeDeck } from "./inputs";
import { PlayerDeck, OrbitSystem, PeekFolder } from "./showcase";

export function DemoStage({
  comp,
  variant,
  big = false,
  tile = false,
}: {
  comp: string;
  variant: string;
  big?: boolean;
  tile?: boolean;
}) {
  switch (comp) {
    /* ambience */
    case "corona":
      return <Corona variant={variant} quiet={tile} className={big ? "h-96 w-full" : "h-full w-full"} />;
    case "flux":
      return <Flux variant={variant} quiet={tile} className={big ? "h-96 w-full" : "h-full w-full"} />;
    case "tracegrid":
      return <TraceGrid variant={variant} quiet={tile} className={big ? "h-96 w-full" : "h-full w-full"} />;
    case "beamlines":
      return <BeamLines variant={variant} quiet={tile} className={big ? "h-96 w-full" : "h-full w-full"} />;
    case "auroraveil":
      return <AuroraVeil variant={variant} quiet={tile} className={big ? "h-96 w-full" : "h-full w-full"} />;

    /* buttons */
    case "sheen":
      return <Sheen variant={variant} />;
    case "sweep":
      return <Sweep variant={variant} />;
    case "halo":
      return <Halo variant={variant} />;
    case "notchbtn":
      return <Notch variant={variant} />;
    case "pop":
      return <Pop variant={variant} />;
    case "candy":
      return <Candy variant={variant} />;
    case "checkout":
      return (
        <Scale big={big} amount={1.1}>
          <CheckoutBench variant={variant} />
        </Scale>
      );

    /* cards — small surfaces scale up on the big detail stage so a
       single card still owns the space */
    case "pointercard":
      return <Scale big={big} amount={1.15}><PointerCard variant={variant} /></Scale>;
    case "halocard":
      return <Scale big={big} amount={1.15}><HaloCard variant={variant} /></Scale>;
    case "deck":
      return <Scale big={big} amount={1.35}><StackDeck variant={variant} /></Scale>;
    case "voicecard":
      return <Scale big={big} amount={1.1}><VoiceCard variant={variant} /></Scale>;

    /* textfx */
    case "flipcycle":
      return <FlipCycle variant={variant} />;
    case "morphstream":
      return <MorphStream variant={variant} />;
    case "cascade":
      return <Cascade variant={variant} />;
    case "glitch":
      return <Glitch variant={variant} />;
    case "rolldigits":
      return <RollDigits variant={variant} />;

    /* motion3d */
    case "isostage":
      return <IsoStage variant={variant} />;
    case "tiltcard":
      return <TiltCard variant={variant} />;
    case "ribbon":
      return <Ribbon variant={variant} />;
    case "orbitcam":
      return (
        <div className="flex items-center justify-center py-6">
          <OrbitCam variant={variant} size={big ? 200 : 128} />
        </div>
      );

    /* galleries */
    case "orbitgal":
      return <OrbitGallery variant={variant} />;
    case "diagonalrail":
      return <DiagonalRail variant={variant} />;
    case "cursortrail":
      return <CursorTrail variant={variant} />;

    /* navigation */
    case "notchbar":
      return <NotchBar variant={variant} />;
    case "spotbar":
      return <SpotBar variant={variant} />;
    case "glassdock":
      return <GlassDock variant={variant} />;

    /* loaders */
    case "kinetic":
      return <Kinetic variant={variant} />;
    case "shutter":
      return <Shutter variant={variant} />;
    case "orbitdot":
      return <OrbitDot variant={variant} />;

    /* inputs */
    case "goosearch":
      return <GooSearch variant={variant} />;
    case "typedeck":
      return <TypeDeck variant={variant} />;

    /* showcase */
    case "playerdeck":
      return <Scale big={big} amount={1.12}><PlayerDeck variant={variant} /></Scale>;
    case "orbitsys":
      return <OrbitSystem variant={variant} />;
    case "peekfolder":
      return <PeekFolder variant={variant} />;

    default:
      return (
        <span className="text-sm text-neutral-500">missing demo: {comp}</span>
      );
  }
}

/* ── Scale — demo size compensation ──────────────────
   Small surfaces get scaled up on the big detail stage (and scaled
   to unity in catalogue tiles and rows), so a single card still
   owns the space it sits in. */
function Scale({
  big,
  amount,
  children,
}: {
  big: boolean;
  amount: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-center"
      style={big ? { transform: `scale(${amount})` } : undefined}
    >
      {children}
    </div>
  );
}

/* ── StageTicks — the measured chrome ──────────────────────
   Four registration marks frame the working area; a tick ruler
   runs the bottom edge. Stages read as set surfaces — measured
   space, not decoration. Purely presentational, never interactive. */
export function StageTicks({ ruler = true }: { ruler?: boolean }) {
  const b = "pointer-events-none absolute size-3 border-white/25";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <span className={cn(b, "left-2.5 top-2.5 border-l border-t")} />
      <span className={cn(b, "right-2.5 top-2.5 border-r border-t")} />
      <span className={cn(b, "bottom-2.5 left-2.5 border-b border-l")} />
      <span className={cn(b, "bottom-2.5 right-2.5 border-b border-r")} />
      {ruler && <span className="facet-ruler absolute inset-x-8 bottom-2.5" />}
    </div>
  );
}
