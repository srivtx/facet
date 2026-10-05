"use client";
/* Vendored from DavidHDev/react-bits — Components/Lanyard/Lanyard.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision. */
 
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree, type ThreeElement, type ThreeEvent } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

// Upstream ships card.glb next to the component. Next.js cannot import binary assets
// from src/, so it is vendored under /public instead of being pulled from GitHub at
// runtime. See public/README.md for provenance and the re-pack notes; the geometry,
// node/material names and the front/back atlas UV layout are identical to upstream.
const cardGLB = '/assets/lanyard/card.glb';
// The default strap texture is inlined as a data URI (MIT, from the upstream repo)
// so the component needs no extra network request.
const lanyard = 'data:image/png;base64,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';

import { cn } from '@/lib/utils';

const RB_LANYARD_CSS = `
.rb-lanyard-lanyard-wrapper {
  position: relative;
  z-index: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: scale(1);
  transform-origin: center;
}

`;

extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

// 1x1 fully transparent RGBA pixel — lets useTexture be called unconditionally
// when a front/back image isn't supplied. The IDAT has to be a complete zlib
// stream: the previous copy-pasted blob was truncated mid-stream, which Chrome
// still decodes to an image but then fails to upload
// ("WebGL: INVALID_VALUE: texSubImage2D: bad image data").
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNgAAIAAAUAAen63NgAAAAASUVORK5CYII=';

// The card model's front face is UV-mapped to the LEFT half of the texture
// atlas and the back face to the RIGHT half (measured from card.glb). Each
// custom image is composited into its own half so the two faces render
// independently, aspect-preserving (no stretching).
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
}

function RbLanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1
}: LanyardProps) {
  /* `window.innerWidth` in a lazy useState initializer makes the server render one
   * dpr/timeStep and the client another, which React reports as a hydration
   * mismatch. Start from the desktop value and measure once on mount. */
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
          <style href="rb-lanyard" precedence="rb">{RB_LANYARD_CSS}</style>
          <div className={cn("rb-lanyard-lanyard-wrapper")}>
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band
            isMobile={isMobile}
            frontImage={frontImage}
            backImage={backImage}
            imageFit={imageFit}
            lanyardImage={lanyardImage}
            lanyardWidth={lanyardWidth}
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
        </>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
}

type LanyardRigidBody = RapierRigidBody & {
  lerped?: THREE.Vector3;
};

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1
}: BandProps) {
  const band = useRef<THREE.Mesh<InstanceType<typeof MeshLineGeometry>, InstanceType<typeof MeshLineMaterial>>>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<LanyardRigidBody>(null!);
  const j2 = useRef<LanyardRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: RigidBodyProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4
  };

  const getLerped = (body: LanyardRigidBody): THREE.Vector3 => {
    if (!body.lerped) {
      body.lerped = new THREE.Vector3().copy(body.translation());
    }

    return body.lerped;
  };

  const { nodes, materials } = useGLTF(cardGLB) as any;
  const texture = useTexture(lanyardImage || lanyard);
  // useTexture must be called unconditionally; use a blank pixel when an image
  // isn't supplied for a given face, then skip compositing it below.
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  // Composite the front/back images into the card's texture atlas (front = left
  // half, back = right half). Each image is drawn aspect-preserving (no stretch).
  const cardMap = useMemo(() => {
    const baseMap = materials.base.map as THREE.Texture;
    if (!frontImage && !backImage) return baseMap;

    const baseImg = baseMap.image as any;
    const W = baseImg.width;
    const H = baseImg.height;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;
    // Keep the original baked atlas for the card edges and any untouched face.
    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawFitted = (img: any, rect: typeof FRONT_UV_RECT) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;
      const pick = imageFit === 'contain' ? Math.min : Math.max;
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = rx + (rw - dw) / 2;
      const dy = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    if (frontImage && frontTex.image) drawFitted(frontTex.image, FRONT_UV_RECT);
    if (backImage && backTex.image) drawFitted(backTex.image, BACK_UV_RECT);

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map]);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0]
  ]);

  /* Cursor feedback belongs to this component's canvas, not to document.body — a
     page-wide mutation from a component would leak into the rest of the page. */
  const gl = useThree(s => s.gl);

  useEffect(() => {
    const el = gl.domElement;
    if (hovered) {
      el.style.cursor = dragged ? 'grabbing' : 'grab';
    }
    return () => {
      el.style.cursor = '';
    };
  }, [gl, hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        const lerped = getLerped(ref.current);
        const clampedDistance = Math.max(0.1, Math.min(1, lerped.distanceTo(ref.current.translation())));
        lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(getLerped(j2.current));
      curve.points[2].copy(getLerped(j1.current));
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          {...({
            color: 'white',
            depthTest: false,
            resolution: isMobile ? [1000, 2000] : [1000, 1000],
            useMap: true,
            map: texture,
            repeat: [-4, 1],
            lineWidth: lanyardWidth
          } as any)}
        />
      </mesh>
    </>
  );
}

export { RbLanyard };
export default RbLanyard;
