"use client";
/* Vendored from DavidHDev/react-bits — Components/InfiniteMenu/InfiniteMenu.tsx (MIT). Exports renamed with the Rb prefix to avoid API collision.

   The maths runs on three's Vector2/Vector3/Quaternion/Matrix4 rather than gl-matrix:
   three already ships them, gl-matrix was only ever used for the same handful of
   operations, and Matrix4.elements is a column-major Float32Array in exactly the
   layout gl-matrix used, so the raw `uniformMatrix4fv` / instance-buffer uploads are
   unchanged. `makePerspective` takes frustum bounds rather than (fov, aspect), so
   `perspective(out, fov, aspect, near, far)` became a symmetric frustum built from the
   same numbers — algebraically the same matrix. */
import { type CSSProperties, type FC, useRef, useState, useEffect, type MutableRefObject } from 'react';
import { Matrix4, Quaternion, Vector2, Vector3 } from 'three';
import { cn } from '@/lib/utils';

/* The scene never moves: every disc faces the sphere's centre, and the camera always
 * looks at the origin. Hoisted so the render loop allocates nothing per frame. */
const ORIGIN = new Vector3(0, 0, 0);
const WORLD_UP = new Vector3(0, 1, 0);

/* gl-matrix's mat4.targetTo(out, eye, target, up) is NOT a view matrix: it builds the
 * basis x = up x z, y = z x x, z = normalize(eye - target) and then writes `eye`
 * straight into the translation column — where three's Matrix4.lookAt writes the
 * negated basis·eye instead. The camera code inverts the result to get the view
 * matrix, so that difference matters. three has no one-call equivalent, so compose it,
 * including gl-matrix's habit of leaving a degenerate zero axis alone rather than
 * dividing by zero. */
const _bx = new Vector3();
const _by = new Vector3();
const _bz = new Vector3();
const targetBasis = (out: Matrix4, eye: Vector3, target: Vector3, up: Vector3): Matrix4 => {
  _bz.subVectors(eye, target);
  if (_bz.lengthSq() > 0) _bz.normalize();
  _bx.crossVectors(up, _bz);
  if (_bx.lengthSq() > 0) _bx.normalize();
  _by.crossVectors(_bz, _bx);
  return out.makeBasis(_bx, _by, _bz).setPosition(eye);
};

const RB_INFINITE_MENU_CSS = `
/* Note: this CSS is only an example, you can overlay whatever you want using the activeItem logic */

#infinite-grid-menu-canvas {
  cursor: grab;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  outline: none;
}

#infinite-grid-menu-canvas:active {
  cursor: grabbing;
}

.rb-infinite-menu-action-button {
  position: absolute;
  left: 50%;
  z-index: 10;
  width: 60px;
  height: 60px;
  display: grid;
  place-items: center;
  background: #5227ff;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  border: 5px solid var(--infinite-menu-background, #000);
}

.rb-infinite-menu-face-title {
  user-select: none;
  position: absolute;
  font-weight: 900;
  font-size: 3rem;
  left: 1.6em;
  top: 50%;
}

.rb-infinite-menu-action-button-icon {
  user-select: none;
  position: relative;
  color: #fff;
  top: 2px;
  font-size: 26px;
}

.rb-infinite-menu-face-title {
  position: absolute;
  top: 50%;
  transform: translate(20%, -50%);
}

.rb-infinite-menu-face-title.rb-infinite-menu-active {
  opacity: 1;
  transform: translate(20%, -50%);
  pointer-events: auto;
  transition: 0.5s ease;
}

.rb-infinite-menu-face-title.rb-infinite-menu-inactive {
  pointer-events: none;
  opacity: 0;
  transition: 0.1s ease;
}

.rb-infinite-menu-face-description {
  user-select: none;
  position: absolute;
  max-width: 10ch;
  top: 50%;
  font-size: 1.2rem;
  right: 1%;
  transform: translate(0, -50%);
}

.rb-infinite-menu-face-description.rb-infinite-menu-active {
  opacity: 1;
  transform: translate(-90%, -50%);
  pointer-events: auto;
  transition: 0.5s ease;
}

.rb-infinite-menu-face-description.rb-infinite-menu-inactive {
  pointer-events: none;
  transform: translate(-60%, -50%);
  opacity: 0;
  transition: 0.1s ease;
}

.rb-infinite-menu-action-button {
  position: absolute;
  left: 50%;
}

.rb-infinite-menu-action-button.rb-infinite-menu-active {
  bottom: 3.8em;
  transform: translateX(-50%) scale(1);
  opacity: 1;
  pointer-events: auto;
  transition: 0.5s ease;
}

.rb-infinite-menu-action-button.rb-infinite-menu-inactive {
  bottom: -80px;
  transform: translateX(-50%) scale(0);
  opacity: 0;
  pointer-events: none;
  transition: 0.1s ease;
}

@media (max-width: 1500px) {
  .rb-infinite-menu-face-title,
  .rb-infinite-menu-face-description {
    display: none;
  }
}

`;

const discVertShaderSource = `#version 300 es

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec3 uCameraPosition;
uniform vec4 uRotationAxisVelocity;

in vec3 aModelPosition;
in vec3 aModelNormal;
in vec2 aModelUvs;
in mat4 aInstanceMatrix;

out vec2 vUvs;
out float vAlpha;
flat out int vInstanceId;

#define PI 3.141593

void main() {
    vec4 worldPosition = uWorldMatrix * aInstanceMatrix * vec4(aModelPosition, 1.);

    vec3 centerPos = (uWorldMatrix * aInstanceMatrix * vec4(0., 0., 0., 1.)).xyz;
    float radius = length(centerPos.xyz);

    if (gl_VertexID > 0) {
        vec3 rotationAxis = uRotationAxisVelocity.xyz;
        float rotationVelocity = min(.15, uRotationAxisVelocity.w * 15.);
        vec3 stretchDir = normalize(cross(centerPos, rotationAxis));
        vec3 relativeVertexPos = normalize(worldPosition.xyz - centerPos);
        float strength = dot(stretchDir, relativeVertexPos);
        float invAbsStrength = min(0., abs(strength) - 1.);
        strength = rotationVelocity * sign(strength) * abs(invAbsStrength * invAbsStrength * invAbsStrength + 1.);
        worldPosition.xyz += stretchDir * strength;
    }

    worldPosition.xyz = radius * normalize(worldPosition.xyz);

    gl_Position = uProjectionMatrix * uViewMatrix * worldPosition;

    vAlpha = smoothstep(0.5, 1., normalize(worldPosition.xyz).z) * .9 + .1;
    vUvs = aModelUvs;
    vInstanceId = gl_InstanceID;
}
`;

const discFragShaderSource = `#version 300 es
precision highp float;

uniform sampler2D uTex;
uniform int uItemCount;
uniform int uAtlasSize;

out vec4 outColor;

in vec2 vUvs;
in float vAlpha;
flat in int vInstanceId;

void main() {
    int itemIndex = vInstanceId % uItemCount;
    int cellsPerRow = uAtlasSize;
    int cellX = itemIndex % cellsPerRow;
    int cellY = itemIndex / cellsPerRow;
    vec2 cellSize = vec2(1.0) / vec2(float(cellsPerRow));
    vec2 cellOffset = vec2(float(cellX), float(cellY)) * cellSize;

    ivec2 texSize = textureSize(uTex, 0);
    float imageAspect = float(texSize.x) / float(texSize.y);
    float containerAspect = 1.0;
    
    float scale = max(imageAspect / containerAspect, 
                     containerAspect / imageAspect);
    
    vec2 st = vec2(vUvs.x, 1.0 - vUvs.y);
    st = (st - 0.5) * scale + 0.5;
    
    st = clamp(st, 0.0, 1.0);
    
    st = st * cellSize + cellOffset;
    
    outColor = texture(uTex, st);
    outColor.a *= vAlpha;
}
`;

class Face {
  public a: number;
  public b: number;
  public c: number;

  constructor(a: number, b: number, c: number) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
}

class Vertex {
  public position: Vector3;
  public normal: Vector3;
  public uv: Vector2;

  constructor(x: number, y: number, z: number) {
    this.position = new Vector3(x, y, z);
    this.normal = new Vector3();
    this.uv = new Vector2();
  }
}

class Geometry {
  public vertices: Vertex[];
  public faces: Face[];

  constructor() {
    this.vertices = [];
    this.faces = [];
  }

  public addVertex(...args: number[]): this {
    for (let i = 0; i < args.length; i += 3) {
      this.vertices.push(new Vertex(args[i], args[i + 1], args[i + 2]));
    }
    return this;
  }

  public addFace(...args: number[]): this {
    for (let i = 0; i < args.length; i += 3) {
      this.faces.push(new Face(args[i], args[i + 1], args[i + 2]));
    }
    return this;
  }

  public get lastVertex(): Vertex {
    return this.vertices[this.vertices.length - 1];
  }

  public subdivide(divisions = 1): this {
    const midPointCache: Record<string, number> = {};
    let f = this.faces;

    for (let div = 0; div < divisions; ++div) {
      const newFaces = new Array<Face>(f.length * 4);

      f.forEach((face, ndx) => {
        const mAB = this.getMidPoint(face.a, face.b, midPointCache);
        const mBC = this.getMidPoint(face.b, face.c, midPointCache);
        const mCA = this.getMidPoint(face.c, face.a, midPointCache);

        const i = ndx * 4;
        newFaces[i + 0] = new Face(face.a, mAB, mCA);
        newFaces[i + 1] = new Face(face.b, mBC, mAB);
        newFaces[i + 2] = new Face(face.c, mCA, mBC);
        newFaces[i + 3] = new Face(mAB, mBC, mCA);
      });

      f = newFaces;
    }

    this.faces = f;
    return this;
  }

  public spherize(radius = 1): this {
    this.vertices.forEach(vertex => {
      vertex.normal.copy(vertex.position).normalize();
      vertex.position.copy(vertex.normal).multiplyScalar(radius);
    });
    return this;
  }

  public get data(): {
    vertices: Float32Array;
    indices: Uint16Array;
    normals: Float32Array;
    uvs: Float32Array;
  } {
    return {
      vertices: this.vertexData,
      indices: this.indexData,
      normals: this.normalData,
      uvs: this.uvData
    };
  }

  public get vertexData(): Float32Array {
    return Float32Array.from(this.vertices.flatMap(v => v.position.toArray()));
  }

  public get normalData(): Float32Array {
    return Float32Array.from(this.vertices.flatMap(v => v.normal.toArray()));
  }

  public get uvData(): Float32Array {
    return Float32Array.from(this.vertices.flatMap(v => v.uv.toArray()));
  }

  public get indexData(): Uint16Array {
    return new Uint16Array(this.faces.flatMap(f => [f.a, f.b, f.c]));
  }

  public getMidPoint(ndxA: number, ndxB: number, cache: Record<string, number>): number {
    const cacheKey = ndxA < ndxB ? `k_${ndxB}_${ndxA}` : `k_${ndxA}_${ndxB}`;
    if (Object.prototype.hasOwnProperty.call(cache, cacheKey)) {
      return cache[cacheKey];
    }
    const a = this.vertices[ndxA].position;
    const b = this.vertices[ndxB].position;
    const ndx = this.vertices.length;
    cache[cacheKey] = ndx;
    this.addVertex((a.x + b.x) * 0.5, (a.y + b.y) * 0.5, (a.z + b.z) * 0.5);
    return ndx;
  }
}

class IcosahedronGeometry extends Geometry {
  constructor() {
    super();
    const t = Math.sqrt(5) * 0.5 + 0.5;
    this.addVertex(
      -1,
      t,
      0,
      1,
      t,
      0,
      -1,
      -t,
      0,
      1,
      -t,
      0,
      0,
      -1,
      t,
      0,
      1,
      t,
      0,
      -1,
      -t,
      0,
      1,
      -t,
      t,
      0,
      -1,
      t,
      0,
      1,
      -t,
      0,
      -1,
      -t,
      0,
      1
    ).addFace(
      0,
      11,
      5,
      0,
      5,
      1,
      0,
      1,
      7,
      0,
      7,
      10,
      0,
      10,
      11,
      1,
      5,
      9,
      5,
      11,
      4,
      11,
      10,
      2,
      10,
      7,
      6,
      7,
      1,
      8,
      3,
      9,
      4,
      3,
      4,
      2,
      3,
      2,
      6,
      3,
      6,
      8,
      3,
      8,
      9,
      4,
      9,
      5,
      2,
      4,
      11,
      6,
      2,
      10,
      8,
      6,
      7,
      9,
      8,
      1
    );
  }
}

class DiscGeometry extends Geometry {
  constructor(steps = 4, radius = 1) {
    super();
    const safeSteps = Math.max(4, steps);
    const alpha = (2 * Math.PI) / safeSteps;

    this.addVertex(0, 0, 0);
    this.lastVertex.uv.set(0.5, 0.5);

    for (let i = 0; i < safeSteps; ++i) {
      const x = Math.cos(alpha * i);
      const y = Math.sin(alpha * i);
      this.addVertex(radius * x, radius * y, 0);
      this.lastVertex.uv.set(x * 0.5 + 0.5, y * 0.5 + 0.5);

      if (i > 0) {
        this.addFace(0, i, i + 1);
      }
    }
    this.addFace(0, safeSteps, 1);
  }
}

function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }

  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

function createProgram(
  gl: WebGL2RenderingContext,
  shaderSources: [string, string],
  transformFeedbackVaryings?: string[] | null,
  attribLocations?: Record<string, number>
): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;

  [gl.VERTEX_SHADER, gl.FRAGMENT_SHADER].forEach((type, ndx) => {
    const shader = createShader(gl, type, shaderSources[ndx]);
    if (shader) {
      gl.attachShader(program, shader);
    }
  });

  if (transformFeedbackVaryings) {
    gl.transformFeedbackVaryings(program, transformFeedbackVaryings, gl.SEPARATE_ATTRIBS);
  }

  if (attribLocations) {
    for (const attrib in attribLocations) {
      if (Object.prototype.hasOwnProperty.call(attribLocations, attrib)) {
        gl.bindAttribLocation(program, attribLocations[attrib], attrib);
      }
    }
  }

  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (success) {
    return program;
  }

  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

function makeVertexArray(
  gl: WebGL2RenderingContext,
  bufLocNumElmPairs: Array<[WebGLBuffer, number, number]>,
  indices?: Uint16Array
): WebGLVertexArrayObject | null {
  const va = gl.createVertexArray();
  if (!va) return null;

  gl.bindVertexArray(va);

  for (const [buffer, loc, numElem] of bufLocNumElmPairs) {
    if (loc === -1) continue;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, numElem, gl.FLOAT, false, 0, 0);
  }

  if (indices) {
    const indexBuffer = gl.createBuffer();
    if (indexBuffer) {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    }
  }

  gl.bindVertexArray(null);
  return va;
}

function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement): boolean {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const displayWidth = Math.round(canvas.clientWidth * dpr);
  const displayHeight = Math.round(canvas.clientHeight * dpr);
  const needResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
  if (needResize) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
  return needResize;
}

function makeBuffer(gl: WebGL2RenderingContext, sizeOrData: number | ArrayBufferView, usage: number): WebGLBuffer {
  const buf = gl.createBuffer();
  if (!buf) {
    throw new Error('Failed to create WebGL buffer.');
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);

  if (typeof sizeOrData === 'number') {
    gl.bufferData(gl.ARRAY_BUFFER, sizeOrData, usage);
  } else {
    gl.bufferData(gl.ARRAY_BUFFER, sizeOrData, usage);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return buf;
}

function createAndSetupTexture(
  gl: WebGL2RenderingContext,
  minFilter: number,
  magFilter: number,
  wrapS: number,
  wrapT: number
): WebGLTexture {
  const texture = gl.createTexture();
  if (!texture) {
    throw new Error('Failed to create WebGL texture.');
  }
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
  return texture;
}

type UpdateCallback = (deltaTime: number) => void;

class ArcballControl {
  private canvas: HTMLCanvasElement;
  private updateCallback: UpdateCallback;

  public isPointerDown = false;
  public orientation = new Quaternion();
  public pointerRotation = new Quaternion();
  public rotationVelocity = 0;
  public rotationAxis = new Vector3(1, 0, 0);

  public snapDirection = new Vector3(0, 0, -1);
  public snapTargetDirection: Vector3 | null = null;

  private pointerPos = new Vector2();
  private previousPointerPos = new Vector2();
  private _rotationVelocity = 0;
  private _combinedQuat = new Quaternion();

  private readonly EPSILON = 0.1;
  private readonly IDENTITY_QUAT = new Quaternion();

  constructor(canvas: HTMLCanvasElement, updateCallback?: UpdateCallback) {
    this.canvas = canvas;
    this.updateCallback = updateCallback || (() => undefined);

    canvas.addEventListener('pointerdown', (e: PointerEvent) => {
      this.pointerPos.set(e.clientX, e.clientY);
      this.previousPointerPos.copy(this.pointerPos);
      this.isPointerDown = true;
    });
    canvas.addEventListener('pointerup', () => {
      this.isPointerDown = false;
    });
    canvas.addEventListener('pointerleave', () => {
      this.isPointerDown = false;
    });
    canvas.addEventListener('pointermove', (e: PointerEvent) => {
      if (this.isPointerDown) {
        this.pointerPos.set(e.clientX, e.clientY);
      }
    });

    canvas.style.touchAction = 'none';
  }

  public update(deltaTime: number, targetFrameDuration = 16): void {
    const timeScale = deltaTime / targetFrameDuration + 0.00001;
    let angleFactor = timeScale;
    const snapRotation = new Quaternion();

    if (this.isPointerDown) {
      const INTENSITY = 0.3 * timeScale;
      const ANGLE_AMPLIFICATION = 5 / timeScale;

      const midPointerPos = new Vector2().subVectors(this.pointerPos, this.previousPointerPos);
      midPointerPos.multiplyScalar(INTENSITY);

      if (midPointerPos.lengthSq() > this.EPSILON) {
        midPointerPos.add(this.previousPointerPos);

        const p = this.project(midPointerPos);
        const q = this.project(this.previousPointerPos);
        const a = p.clone().normalize();
        const b = q.clone().normalize();

        this.previousPointerPos.copy(midPointerPos);

        angleFactor *= ANGLE_AMPLIFICATION;

        this.quatFromVectors(a, b, this.pointerRotation, angleFactor);
      } else {
        this.pointerRotation.slerp(this.IDENTITY_QUAT, INTENSITY);
      }
    } else {
      const INTENSITY = 0.1 * timeScale;
      this.pointerRotation.slerp(this.IDENTITY_QUAT, INTENSITY);

      if (this.snapTargetDirection) {
        const SNAPPING_INTENSITY = 0.2;
        const a = this.snapTargetDirection;
        const b = this.snapDirection;
        const sqrDist = a.distanceToSquared(b);
        const distanceFactor = Math.max(0.1, 1 - sqrDist * 10);
        angleFactor *= SNAPPING_INTENSITY * distanceFactor;
        this.quatFromVectors(a, b, snapRotation, angleFactor);
      }
    }

    const combinedQuat = new Quaternion().copy(snapRotation).multiply(this.pointerRotation);
    this.orientation.copy(combinedQuat).multiply(this.orientation).normalize();

    const RA_INTENSITY = 0.8 * timeScale;
    this._combinedQuat.slerp(combinedQuat, RA_INTENSITY).normalize();

    const rad = Math.acos(this._combinedQuat.w) * 2.0;
    const s = Math.sin(rad / 2.0);
    let rv = 0;
    if (s > 0.000001) {
      rv = rad / (2 * Math.PI);
      this.rotationAxis.set(this._combinedQuat.x / s, this._combinedQuat.y / s, this._combinedQuat.z / s);
    }

    const RV_INTENSITY = 0.5 * timeScale;
    this._rotationVelocity += (rv - this._rotationVelocity) * RV_INTENSITY;
    this.rotationVelocity = this._rotationVelocity / timeScale;

    this.updateCallback(deltaTime);
  }

  private quatFromVectors(
    a: Vector3,
    b: Vector3,
    out: Quaternion,
    angleFactor = 1
  ): { q: Quaternion; axis: Vector3; angle: number } {
    const axis = new Vector3().crossVectors(a, b).normalize();
    const d = Math.max(-1, Math.min(1, a.dot(b)));
    const angle = Math.acos(d) * angleFactor;
    out.setFromAxisAngle(axis, angle);
    return { q: out, axis, angle };
  }

  private project(pos: Vector2): Vector3 {
    const r = 2;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const s = Math.max(w, h) - 1;

    const x = (2 * pos.x - w - 1) / s;
    const y = (2 * pos.y - h - 1) / s;
    let z = 0;
    const xySq = x * x + y * y;
    const rSq = r * r;

    if (xySq <= rSq / 2.0) {
      z = Math.sqrt(rSq - xySq);
    } else {
      z = rSq / Math.sqrt(xySq);
    }
    return new Vector3(-x, y, z);
  }
}

interface MenuItem {
  image: string;
  link: string;
  title: string;
  description: string;
}

type ActiveItemCallback = (index: number) => void;
type MovementChangeCallback = (isMoving: boolean) => void;
type InitCallback = (instance: InfiniteGridMenu) => void;

interface Camera {
  matrix: Matrix4;
  near: number;
  far: number;
  fov: number;
  aspect: number;
  position: Vector3;
  up: Vector3;
  matrices: {
    view: Matrix4;
    projection: Matrix4;
    inversProjection: Matrix4;
  };
}

class InfiniteGridMenu {
  private gl: WebGL2RenderingContext | null = null;
  private discProgram: WebGLProgram | null = null;
  private discVAO: WebGLVertexArrayObject | null = null;
  private discBuffers!: {
    vertices: Float32Array;
    indices: Uint16Array;
    normals: Float32Array;
    uvs: Float32Array;
  };
  private icoGeo!: IcosahedronGeometry;
  private discGeo!: DiscGeometry;
  private worldMatrix = new Matrix4();
  private tex: WebGLTexture | null = null;
  private control!: ArcballControl;

  private discLocations!: {
    aModelPosition: number;
    aModelUvs: number;
    aInstanceMatrix: number;
    uWorldMatrix: WebGLUniformLocation | null;
    uViewMatrix: WebGLUniformLocation | null;
    uProjectionMatrix: WebGLUniformLocation | null;
    uCameraPosition: WebGLUniformLocation | null;
    uScaleFactor: WebGLUniformLocation | null;
    uRotationAxisVelocity: WebGLUniformLocation | null;
    uTex: WebGLUniformLocation | null;
    uFrames: WebGLUniformLocation | null;
    uItemCount: WebGLUniformLocation | null;
    uAtlasSize: WebGLUniformLocation | null;
  };

  private viewportSize = new Vector2();
  private drawBufferSize = new Vector2();

  private discInstances!: {
    matricesArray: Float32Array;
    matrices: Float32Array[];
    buffer: WebGLBuffer | null;
  };

  private instancePositions: Vector3[] = [];
  private DISC_INSTANCE_COUNT = 0;
  private atlasSize = 1;

  private _time = 0;
  private _deltaTime = 0;
  private _deltaFrames = 0;
  private _frames = 0;

  private movementActive = false;

  private TARGET_FRAME_DURATION = 1000 / 60;
  private SPHERE_RADIUS = 2;

  public camera: Camera = {
    matrix: new Matrix4(),
    near: 0.1,
    far: 40,
    fov: Math.PI / 4,
    aspect: 1,
    position: new Vector3(0, 0, 3),
    up: new Vector3(0, 1, 0),
    matrices: {
      view: new Matrix4(),
      projection: new Matrix4(),
      inversProjection: new Matrix4()
    }
  };

  public smoothRotationVelocity = 0;
  public scaleFactor = 1.0;

  constructor(
    private canvas: HTMLCanvasElement,
    private items: MenuItem[],
    private onActiveItemChange: ActiveItemCallback,
    private onMovementChange: MovementChangeCallback,
    onInit?: InitCallback,
    scale: number = 1.0
  ) {
    this.scaleFactor = scale;
    this.camera.position.z = 3 * scale;
    this.init(onInit);
  }

  public resize(): void {
    const needsResize = resizeCanvasToDisplaySize(this.canvas);
    if (!this.gl) return;
    if (needsResize) {
      this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
    }
    this.updateProjectionMatrix();
  }

  public run(time = 0): void {
    this._deltaTime = Math.min(32, time - this._time);
    this._time = time;
    this._deltaFrames = this._deltaTime / this.TARGET_FRAME_DURATION;
    this._frames += this._deltaFrames;

    this.animate(this._deltaTime);
    this.render();

    requestAnimationFrame(t => this.run(t));
  }

  private init(onInit?: InitCallback): void {
    const gl = this.canvas.getContext('webgl2', {
      antialias: true,
      alpha: true
    });
    if (!gl) {
      throw new Error('No WebGL 2 context!');
    }
    this.gl = gl;

    this.viewportSize.set(this.canvas.clientWidth, this.canvas.clientHeight);
    this.drawBufferSize.copy(this.viewportSize);

    this.discProgram = createProgram(gl, [discVertShaderSource, discFragShaderSource], null, {
      aModelPosition: 0,
      aModelNormal: 1,
      aModelUvs: 2,
      aInstanceMatrix: 3
    });

    this.discLocations = {
      aModelPosition: gl.getAttribLocation(this.discProgram!, 'aModelPosition'),
      aModelUvs: gl.getAttribLocation(this.discProgram!, 'aModelUvs'),
      aInstanceMatrix: gl.getAttribLocation(this.discProgram!, 'aInstanceMatrix'),
      uWorldMatrix: gl.getUniformLocation(this.discProgram!, 'uWorldMatrix'),
      uViewMatrix: gl.getUniformLocation(this.discProgram!, 'uViewMatrix'),
      uProjectionMatrix: gl.getUniformLocation(this.discProgram!, 'uProjectionMatrix'),
      uCameraPosition: gl.getUniformLocation(this.discProgram!, 'uCameraPosition'),
      uScaleFactor: gl.getUniformLocation(this.discProgram!, 'uScaleFactor'),
      uRotationAxisVelocity: gl.getUniformLocation(this.discProgram!, 'uRotationAxisVelocity'),
      uTex: gl.getUniformLocation(this.discProgram!, 'uTex'),
      uFrames: gl.getUniformLocation(this.discProgram!, 'uFrames'),
      uItemCount: gl.getUniformLocation(this.discProgram!, 'uItemCount'),
      uAtlasSize: gl.getUniformLocation(this.discProgram!, 'uAtlasSize')
    };

    this.discGeo = new DiscGeometry(56, 1);
    this.discBuffers = this.discGeo.data;
    this.discVAO = makeVertexArray(
      gl,
      [
        [makeBuffer(gl, this.discBuffers.vertices, gl.STATIC_DRAW), this.discLocations.aModelPosition, 3],
        [makeBuffer(gl, this.discBuffers.uvs, gl.STATIC_DRAW), this.discLocations.aModelUvs, 2]
      ],
      this.discBuffers.indices
    );

    this.icoGeo = new IcosahedronGeometry();
    this.icoGeo.subdivide(1).spherize(this.SPHERE_RADIUS);
    this.instancePositions = this.icoGeo.vertices.map(v => v.position);
    this.DISC_INSTANCE_COUNT = this.icoGeo.vertices.length;
    this.initDiscInstances(this.DISC_INSTANCE_COUNT);
    this.initTexture();

    this.control = new ArcballControl(this.canvas, deltaTime => this.onControlUpdate(deltaTime));

    this.updateCameraMatrix();
    this.updateProjectionMatrix();

    this.resize();

    if (onInit) {
      onInit(this);
    }
  }

  private initTexture(): void {
    if (!this.gl) return;
    const gl = this.gl;
    this.tex = createAndSetupTexture(gl, gl.LINEAR, gl.LINEAR, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE);

    const itemCount = Math.max(1, this.items.length);
    this.atlasSize = Math.ceil(Math.sqrt(itemCount));
    const cellSize = 512;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = this.atlasSize * cellSize;
    canvas.height = this.atlasSize * cellSize;

    Promise.all(
      this.items.map(
        item =>
          new Promise<HTMLImageElement>(resolve => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.src = item.image;
          })
      )
    ).then(images => {
      images.forEach((img, i) => {
        const x = (i % this.atlasSize) * cellSize;
        const y = Math.floor(i / this.atlasSize) * cellSize;
        ctx.drawImage(img, x, y, cellSize, cellSize);
      });

      gl.bindTexture(gl.TEXTURE_2D, this.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
      gl.generateMipmap(gl.TEXTURE_2D);
    });
  }

  private initDiscInstances(count: number): void {
    if (!this.gl || !this.discVAO) return;
    const gl = this.gl;

    const matricesArray = new Float32Array(count * 16);
    const matrices: Float32Array[] = [];
    const identity = new Matrix4();
    for (let i = 0; i < count; ++i) {
      // A view onto one 16-float slot of the shared buffer, so writing here is what
      // the later bufferSubData uploads.
      const instanceMatrixArray = new Float32Array(matricesArray.buffer, i * 16 * 4, 16);
      instanceMatrixArray.set(identity.elements);
      matrices.push(instanceMatrixArray);
    }

    this.discInstances = {
      matricesArray,
      matrices,
      buffer: gl.createBuffer()
    };

    gl.bindVertexArray(this.discVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.discInstances.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.discInstances.matricesArray.byteLength, gl.DYNAMIC_DRAW);

    const mat4AttribSlotCount = 4;
    const bytesPerMatrix = 16 * 4;
    for (let j = 0; j < mat4AttribSlotCount; ++j) {
      const loc = this.discLocations.aInstanceMatrix + j;
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, bytesPerMatrix, j * 4 * 4);
      gl.vertexAttribDivisor(loc, 1);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
  }

  private animate(deltaTime: number): void {
    if (!this.gl) return;
    this.control.update(deltaTime, this.TARGET_FRAME_DURATION);

    const positions = this.instancePositions.map(p =>
      p.clone().applyQuaternion(this.control.orientation)
    );
    const scale = 0.25;
    const SCALE_INTENSITY = 0.6;
    const scratch = new Matrix4();

    positions.forEach((p, ndx) => {
      const s = (Math.abs(p.z) / this.SPHERE_RADIUS) * SCALE_INTENSITY + (1 - SCALE_INTENSITY);
      const finalScale = s * scale;
      const matrix = new Matrix4();

      matrix.multiply(new Matrix4().makeTranslation(p.clone().negate()));
      matrix.multiply(targetBasis(scratch, ORIGIN, p, WORLD_UP));
      matrix.multiply(new Matrix4().makeScale(finalScale, finalScale, finalScale));
      matrix.multiply(new Matrix4().makeTranslation(0, 0, -this.SPHERE_RADIUS));

      this.discInstances.matrices[ndx].set(matrix.elements);
    });

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.discInstances.buffer);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.discInstances.matricesArray);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

    this.smoothRotationVelocity = this.control.rotationVelocity;
  }

  private render(): void {
    if (!this.gl || !this.discProgram) return;
    const gl = this.gl;

    gl.useProgram(this.discProgram);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(this.discLocations.uWorldMatrix, false, this.worldMatrix.elements);
    gl.uniformMatrix4fv(this.discLocations.uViewMatrix, false, this.camera.matrices.view.elements);
    gl.uniformMatrix4fv(this.discLocations.uProjectionMatrix, false, this.camera.matrices.projection.elements);
    gl.uniform3f(
      this.discLocations.uCameraPosition,
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z
    );
    gl.uniform4f(
      this.discLocations.uRotationAxisVelocity,
      this.control.rotationAxis.x,
      this.control.rotationAxis.y,
      this.control.rotationAxis.z,
      this.smoothRotationVelocity * 1.1
    );

    gl.uniform1i(this.discLocations.uItemCount, this.items.length);
    gl.uniform1i(this.discLocations.uAtlasSize, this.atlasSize);

    gl.uniform1f(this.discLocations.uFrames, this._frames);
    gl.uniform1f(this.discLocations.uScaleFactor, this.scaleFactor);

    gl.uniform1i(this.discLocations.uTex, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);

    gl.bindVertexArray(this.discVAO);
    gl.drawElementsInstanced(
      gl.TRIANGLES,
      this.discBuffers.indices.length,
      gl.UNSIGNED_SHORT,
      0,
      this.DISC_INSTANCE_COUNT
    );
    gl.bindVertexArray(null);
  }

  private updateCameraMatrix(): void {
    targetBasis(this.camera.matrix, this.camera.position, ORIGIN, this.camera.up);
    this.camera.matrices.view.copy(this.camera.matrix).invert();
  }

  private updateProjectionMatrix(): void {
    if (!this.gl) return;
    const canvasEl = this.gl.canvas as HTMLCanvasElement;
    this.camera.aspect = canvasEl.clientWidth / canvasEl.clientHeight;
    const height = this.SPHERE_RADIUS * 0.35;
    const distance = this.camera.position.z;
    if (this.camera.aspect > 1) {
      this.camera.fov = 2 * Math.atan(height / distance);
    } else {
      this.camera.fov = 2 * Math.atan(height / this.camera.aspect / distance);
    }
    /* three's makePerspective takes frustum bounds, not (fov, aspect). A symmetric
     * frustum built from the same fov/aspect/near/far produces the identical matrix
     * gl-matrix's perspective() did. */
    const top = this.camera.near * Math.tan(this.camera.fov / 2);
    const right = top * this.camera.aspect;
    this.camera.matrices.projection.makePerspective(
      -right,
      right,
      top,
      -top,
      this.camera.near,
      this.camera.far
    );
    this.camera.matrices.inversProjection.copy(this.camera.matrices.projection).invert();
  }

  private onControlUpdate(deltaTime: number): void {
    const timeScale = deltaTime / this.TARGET_FRAME_DURATION + 0.0001;
    let damping = 5 / timeScale;
    let cameraTargetZ = 3 * this.scaleFactor;

    const isMoving = this.control.isPointerDown || Math.abs(this.smoothRotationVelocity) > 0.01;

    if (isMoving !== this.movementActive) {
      this.movementActive = isMoving;
      this.onMovementChange(isMoving);
    }

    if (!this.control.isPointerDown) {
      const nearestVertexIndex = this.findNearestVertexIndex();
      const itemIndex = nearestVertexIndex % Math.max(1, this.items.length);
      this.onActiveItemChange(itemIndex);
      const snapDirection = this.getVertexWorldPosition(nearestVertexIndex).normalize();
      this.control.snapTargetDirection = snapDirection;
    } else {
      cameraTargetZ += this.control.rotationVelocity * 80 + 2.5;
      damping = 7 / timeScale;
    }

    this.camera.position.z += (cameraTargetZ - this.camera.position.z) / damping;
    this.updateCameraMatrix();
  }

  private findNearestVertexIndex(): number {
    const n = this.control.snapDirection;
    const inversOrientation = this.control.orientation.clone().conjugate();
    const nt = n.clone().applyQuaternion(inversOrientation);

    let maxD = -1;
    let nearestVertexIndex = 0;
    for (let i = 0; i < this.instancePositions.length; ++i) {
      const d = nt.dot(this.instancePositions[i]);
      if (d > maxD) {
        maxD = d;
        nearestVertexIndex = i;
      }
    }
    return nearestVertexIndex;
  }

  private getVertexWorldPosition(index: number): Vector3 {
    return this.instancePositions[index].clone().applyQuaternion(this.control.orientation);
  }
}

/* Upstream pulled a 600×600 crop off the Unsplash CDN. This file is the vendored,
 * square-cropped, fully desaturated copy of that same photo (upstream asked for
 * `sat=-100`) — see public/README.md. The `link` stays a real external URL: it is a
 * destination the user navigates to, never fetched by this page. */
const defaultItems: MenuItem[] = [
  {
    image: '/photos/vendor/uns-gray-square-1782977389500-dd7adad33ebe.jpg',
    link: 'https://google.com/',
    title: '',
    description: ''
  }
];

interface InfiniteMenuProps {
  items?: MenuItem[];
  scale?: number;
  backgroundColor?: string;
}

const RbInfiniteMenu: FC<InfiniteMenuProps> = ({ items = [], scale = 1.0, backgroundColor = '#000000' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null) as MutableRefObject<HTMLCanvasElement | null>;
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [isMoving, setIsMoving] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    let sketch: InfiniteGridMenu | null = null;

    const handleActiveItem = (index: number) => {
      if (!items.length) return;
      const itemIndex = index % items.length;
      setActiveItem(items[itemIndex]);
    };

    if (canvas) {
      sketch = new InfiniteGridMenu(
        canvas,
        items.length ? items : defaultItems,
        handleActiveItem,
        setIsMoving,
        sk => sk.run(),
        scale
      );
    }

    const handleResize = () => {
      if (sketch) {
        sketch.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [items, scale]);

  const handleButtonClick = () => {
    if (!activeItem?.link) return;
    if (activeItem.link.startsWith('http')) {
      window.open(activeItem.link, '_blank');
    } else {
      console.log('Internal route:', activeItem.link);
    }
  };

  return (
    <>
          <style href="rb-infinite-menu" precedence="rb">{RB_INFINITE_MENU_CSS}</style>
          <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor,
        '--infinite-menu-background': backgroundColor
      } as CSSProperties}
    >
      <canvas id="infinite-grid-menu-canvas" ref={canvasRef} />

      {activeItem && (
        <>
          <h2 className={cn("rb-infinite-menu-face-title", isMoving ? "rb-infinite-menu-inactive" : "rb-infinite-menu-active")}>{activeItem.title}</h2>

          <p className={cn("rb-infinite-menu-face-description", isMoving ? "rb-infinite-menu-inactive" : "rb-infinite-menu-active")}>{activeItem.description}</p>

          <div onClick={handleButtonClick} className={cn("rb-infinite-menu-action-button", isMoving ? "rb-infinite-menu-inactive" : "rb-infinite-menu-active")}>
            <p className={cn("rb-infinite-menu-action-button-icon")}>&#x2197;</p>
          </div>
        </>
      )}
    </div>
        </>
  );
};

export { RbInfiniteMenu };
export default RbInfiniteMenu;
