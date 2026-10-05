"use client";
/* Vendored from DavidHDev/react-bits — Components/FluidGlass/FluidGlass.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision.

   The two in-scene <Text> labels are drei/troika. Given no `font`, troika 0.52 resolves a
   fallback face per codepoint against a unicode-font-resolver dataset hosted on
   cdn.jsdelivr.net — a runtime request to a third party, for every string. Naming a
   same-origin font file short-circuits that: the whole string is served from the one
   font, the resolver is only consulted for codepoints this font lacks (Latin labels hit
   zero requests). Geist is already the host's typeface via next/font, so this is the
   same family, not a new dependency — see public/README.md for provenance. */
 
import * as THREE from 'three';
import { useRef, useState, useEffect, memo, type ReactNode } from 'react';
import { Canvas, createPortal, useFrame, useThree, type ThreeElements } from '@react-three/fiber';
import {
  useFBO,
  useGLTF,
  useScroll,
  Image,
  Scroll,
  Preload,
  ScrollControls,
  MeshTransmissionMaterial,
  Text
} from '@react-three/drei';
import { easing } from 'maath';

/* Vendored under /public/photos/vendor — these sit behind a MeshTransmissionMaterial, so
 * upstream deliberately loaded them at q=60. See public/README.md. */
const SCENE_FONT = '/fonts/Geist-Variable.ttf';

const IMAGE_URLS = [
  '/photos/vendor/uns-1783394327207-acf441e37dda.jpg',
  '/photos/vendor/uns-1782977389500-dd7adad33ebe.jpg',
  '/photos/vendor/uns-1782094002386-7d9ae1f49f50.jpg',
  '/photos/vendor/uns-1781242629922-6f39cc3671cd.jpg',
  '/photos/vendor/uns-1779684474703-5c0519bcf7e8.jpg'
];

type Mode = 'lens' | 'bar' | 'cube';

interface NavItem {
  label: string;
  link: string;
}

type ModeProps = Record<string, unknown>;

/* Upstream loaded three .glb files from /assets/3d (lens.glb, bar.glb, cube.glb),
 * none of which exist in this repo, so every mount produced three 404s and then a
 * thrown suspense error. The shapes are plain primitives, so build them here
 * instead: same silhouette, no network request, nothing to 404. The geometries are
 * static and immutable, so one lazily-created instance is shared by all mounts and
 * never disposed out from under a live mesh. */
let cachedLens: { geometry: THREE.BufferGeometry; width: number } | null = null;
let cachedCube: { geometry: THREE.BufferGeometry; width: number } | null = null;
let cachedBar: { geometry: THREE.BufferGeometry; width: number } | null = null;

function roundedBox(width: number, height: number, depth: number, radius: number): THREE.BufferGeometry {
  const r = Math.min(radius, width / 2, height / 2);
  const x = -width / 2;
  const y = -height / 2;
  const shape = new THREE.Shape();
  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.absarc(x + width - r, y + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(x + width, y + height - r);
  shape.absarc(x + width - r, y + height - r, r, 0, Math.PI / 2, false);
  shape.lineTo(x + r, y + height);
  shape.absarc(x + r, y + height - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(x, y + r);
  shape.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.001, depth - r * 0.5),
    bevelEnabled: true,
    bevelThickness: r * 0.25,
    bevelSize: r * 0.25,
    bevelSegments: 3,
    curveSegments: 16
  });
  geometry.center();
  return geometry;
}

function measured(geometry: THREE.BufferGeometry): { geometry: THREE.BufferGeometry; width: number } {
  geometry.computeBoundingBox();
  const bb = geometry.boundingBox!;
  return { geometry, width: bb.max.x - bb.min.x || 1 };
}

function getLens() {
  return (cachedLens ??= measured(new THREE.CylinderGeometry(1, 1, 0.55, 96)));
}

function getCube() {
  return (cachedCube ??= measured(roundedBox(1.6, 1.6, 1.6, 0.22)));
}

function getBar() {
  return (cachedBar ??= measured(roundedBox(4, 0.7, 0.9, 0.35)));
}

/* A render-time `window.innerWidth` read would make the server and the client
 * disagree on font size / spacing. Start from a fixed value the server can also
 * produce, then measure once on the client. */
function useBreakpoint(): 'mobile' | 'tablet' | 'desktop' {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const measure = () => {
      const w = window.innerWidth;
      setDevice(w <= 639 ? 'mobile' : w <= 1023 ? 'tablet' : 'desktop');
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return device;
}

interface FluidGlassProps {
  mode?: Mode;
  lensProps?: ModeProps;
  barProps?: ModeProps;
  cubeProps?: ModeProps;
  backgroundColor?: string;
  textColor?: string;
}

function RbFluidGlass({
  mode = 'lens',
  lensProps = {},
  barProps = {},
  cubeProps = {},
  backgroundColor = '#120F17',
  textColor = '#ffffff'
}: FluidGlassProps) {
  const Wrapper = mode === 'bar' ? Bar : mode === 'cube' ? Cube : Lens;
  const rawOverrides = mode === 'bar' ? barProps : mode === 'cube' ? cubeProps : lensProps;

  const {
    navItems = [
      { label: 'Home', link: '' },
      { label: 'About', link: '' },
      { label: 'Contact', link: '' }
    ],
    ...modeProps
  } = rawOverrides;

  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 15 }}
      gl={{ alpha: true, toneMapping: THREE.NoToneMapping }}
      style={{ backgroundColor }}
    >
      <ScrollControls damping={0.2} pages={3} distance={0.4}>
        {mode === 'bar' && <NavItems items={navItems as NavItem[]} textColor={textColor} />}
        <Wrapper modeProps={modeProps} backgroundColor={backgroundColor}>
          <Scroll>
            <Typography textColor={textColor} />
            <Images />
          </Scroll>
          <Scroll html />
          <Preload />
        </Wrapper>
      </ScrollControls>
    </Canvas>
  );
}

type MeshProps = ThreeElements['mesh'];

interface ZoomMaterial extends THREE.Material {
  zoom: number;
}

interface ZoomMesh extends THREE.Mesh<THREE.BufferGeometry, ZoomMaterial> {}

type ZoomGroup = THREE.Group & { children: ZoomMesh[] };

interface ModeWrapperProps extends MeshProps {
  children?: ReactNode;
  geometry: THREE.BufferGeometry;
  geometryWidth: number;
  lockToBottom?: boolean;
  followPointer?: boolean;
  modeProps?: ModeProps;
  backgroundColor?: string;
}

type ModeComponentProps = Omit<ModeWrapperProps, 'geometry' | 'geometryWidth'>;

const ModeWrapper = memo(function ModeWrapper({
  children,
  geometry,
  geometryWidth,
  lockToBottom = false,
  followPointer = true,
  modeProps = {},
  backgroundColor = '#120F17',
  ...props
}: ModeWrapperProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const buffer = useFBO();
  const { viewport: vp } = useThree();
  const [scene] = useState<THREE.Scene>(() => new THREE.Scene());
  /* Each wrapper always resolves to the same cached geometry, and a change of mode
     swaps the whole wrapper component, so the width never changes for a mounted
     one — a lazy ref init is enough and keeps render free of ref writes. */
  const geoWidthRef = useRef<number>(geometryWidth);

  useFrame((state, delta) => {
    const { gl, viewport, pointer, camera } = state;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);

    const destX = followPointer ? (pointer.x * v.width) / 2 : 0;
    const destY = lockToBottom ? -v.height / 2 + 0.2 : followPointer ? (pointer.y * v.height) / 2 : 0;
    easing.damp3(ref.current.position, [destX, destY, 15], 0.15, delta);

    if ((modeProps as { scale?: number }).scale == null) {
      const maxWorld = v.width * 0.9;
      const desired = maxWorld / geoWidthRef.current;
      ref.current.scale.setScalar(Math.min(0.15, desired));
    }

    gl.setClearColor(0x000000, 0);
    gl.setRenderTarget(buffer);
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.setClearColor(0x000000, 0);
  });

  const { scale, ior, thickness, anisotropy, chromaticAberration, ...extraMat } = modeProps as {
    scale?: number;
    ior?: number;
    thickness?: number;
    anisotropy?: number;
    chromaticAberration?: number;
    [key: string]: unknown;
  };

  return (
    <>
      {createPortal(
        <>
          <mesh position={[0, 0, -5]} scale={[vp.width * 2, vp.height * 2, 1]}>
            <planeGeometry />
            <meshBasicMaterial color={backgroundColor} toneMapped={false} />
          </mesh>
          {children}
        </>,
        scene
      )}
      <mesh scale={[vp.width, vp.height, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} transparent toneMapped={false} />
      </mesh>
      <mesh
        ref={ref}
        scale={scale ?? 0.15}
        rotation-x={Math.PI / 2}
        geometry={geometry}
        {...props}
      >
        <MeshTransmissionMaterial
          buffer={buffer.texture}
          ior={ior ?? 1.15}
          thickness={thickness ?? 5}
          anisotropy={anisotropy ?? 0.01}
          chromaticAberration={chromaticAberration ?? 0.1}
          {...(typeof extraMat === 'object' && extraMat !== null ? extraMat : {})}
        />
      </mesh>
    </>
  );
});

function Lens({ modeProps, ...p }: ModeComponentProps) {
  const { geometry, width } = getLens();
  return (
    <ModeWrapper
      geometry={geometry}
      geometryWidth={width}
      followPointer
      modeProps={modeProps}
      {...p}
    />
  );
}

function Cube({ modeProps, ...p }: ModeComponentProps) {
  const { geometry, width } = getCube();
  return <ModeWrapper geometry={geometry} geometryWidth={width} followPointer modeProps={modeProps} {...p} />;
}

function Bar({ modeProps = {}, ...p }: ModeComponentProps) {
  const defaultMat = {
    transmission: 1,
    roughness: 0,
    thickness: 10,
    ior: 1.15,
    color: '#ffffff',
    attenuationColor: '#ffffff',
    attenuationDistance: 0.25
  };

  const { geometry, width } = getBar();

  return (
    <ModeWrapper
      geometry={geometry}
      geometryWidth={width}
      lockToBottom
      followPointer={false}
      modeProps={{ ...defaultMat, ...modeProps }}
      {...p}
    />
  );
}

function NavItems({ items, textColor }: { items: NavItem[]; textColor: string }) {
  const group = useRef<THREE.Group>(null!);
  const { viewport, camera } = useThree();
  /* Cursor feedback belongs to the canvas this scene is rendered into, not to
   * document.body — a page-wide mutation would leak out of the component. */
  const domElement = useThree(s => s.gl.domElement);

  const DEVICE = {
    mobile: { spacing: 0.2, fontSize: 0.035 },
    tablet: { spacing: 0.24, fontSize: 0.045 },
    desktop: { spacing: 0.3, fontSize: 0.045 }
  };

  const device = useBreakpoint();

  useEffect(() => {
    return () => {
      domElement.style.cursor = '';
    };
  }, [domElement]);

  const { spacing, fontSize } = DEVICE[device];

  useFrame(() => {
    if (!group.current) return;
    const v = viewport.getCurrentViewport(camera, [0, 0, 15]);
    group.current.position.set(0, -v.height / 2 + 0.2, 15.1);

    group.current.children.forEach((child, i) => {
      child.position.x = (i - (items.length - 1) / 2) * spacing;
    });
  });

  const handleNavigate = (link: string) => {
    if (!link) return;
    link.startsWith('#') ? (window.location.hash = link) : (window.location.href = link);
  };

  return (
    <group ref={group} renderOrder={10}>
      {items.map(({ label, link }) => (
        <Text
          key={label}
          font={SCENE_FONT}
          fontSize={fontSize}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0}
          outlineBlur="20%"
          outlineColor="#000"
          outlineOpacity={0.5}
          renderOrder={10}
          onClick={e => {
            e.stopPropagation();
            handleNavigate(link);
          }}
          onPointerOver={e => {
            e.stopPropagation();
            domElement.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            domElement.style.cursor = '';
          }}
        >
          {label}
        </Text>
      ))}
    </group>
  );
}

function Images() {
  const group = useRef<ZoomGroup>(null!);
  const data = useScroll();
  const { height } = useThree(s => s.viewport);

  useFrame(() => {
    group.current.children[0].material.zoom = 1 + data.range(0, 1 / 3) / 3;
    group.current.children[1].material.zoom = 1 + data.range(0, 1 / 3) / 3;
    group.current.children[2].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
    group.current.children[3].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
    group.current.children[4].material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
  });

  return (
    // drei <Image> is an R3F primitive, not an HTML <img> — the html-img a11y
    // rules do not apply to it.
    /* eslint-disable jsx-a11y/alt-text */
    <group ref={group}>
      <Image position={[-2, 0, 0]} scale={[3, height / 1.1]} url={IMAGE_URLS[0]} />
      <Image position={[2, 0, 3]} scale={3} url={IMAGE_URLS[1]} />
      <Image position={[-2.05, -height, 6]} scale={[1, 3]} url={IMAGE_URLS[2]} />
      <Image position={[-0.6, -height, 9]} scale={[1, 2]} url={IMAGE_URLS[3]} />
      <Image position={[0.75, -height, 10.5]} scale={1.5} url={IMAGE_URLS[4]} />
    </group>
  );
}

function Typography({ textColor }: { textColor: string }) {
  const DEVICE = {
    mobile: { fontSize: 0.2 },
    tablet: { fontSize: 0.4 },
    desktop: { fontSize: 0.6 }
  };

  const device = useBreakpoint();

  const { fontSize } = DEVICE[device];

  return (
    <Text
      position={[0, 0, 12]}
      font={SCENE_FONT}
      fontSize={fontSize}
      letterSpacing={-0.05}
      outlineWidth={0}
      outlineBlur="20%"
      outlineColor="#000"
      outlineOpacity={0.5}
      color={textColor}
      anchorX="center"
      anchorY="middle"
    >
      React Bits
    </Text>
  );
}

export { RbFluidGlass };
export default RbFluidGlass;
