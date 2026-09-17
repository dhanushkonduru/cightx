import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { FIELD_H, FIELD_W, ZONES, loadField, toWorld, type Field } from "./field";
import { timeline } from "./timeline";

const INK = new THREE.Color("#07080A");

type Shared = {
  pointer: { x: number; y: number; touched: boolean }; // NDC
  pointerWorld: { x: number; y: number; z: number };
  scroll: number; // 0..1 through the hero
  reduced: boolean;
};

/* ------------------------------------------------------------------ columns */

const columnVertex = /* glsl */ `
  uniform float uEpoch;
  uniform vec3 uPointer;
  attribute vec2 aOffset;
  attribute vec4 aH;
  attribute float aH5;
  varying float vY;
  varying float vH13;
  varying float vHObs;
  varying float vHCur;
  varying vec3 vN;
  varying vec3 vW;

  float hAt(float e) {
    if (e <= 1.0) return mix(aH.x, aH.y, clamp(e, 0.0, 1.0));
    if (e <= 2.0) return mix(aH.y, aH.z, e - 1.0);
    if (e <= 3.0) return mix(aH.z, aH.w, e - 2.0);
    return mix(aH.w, aH5, clamp(e - 3.0, 0.0, 1.0));
  }

  void main() {
    float hCur = hAt(uEpoch);
    float hObs = hAt(min(uEpoch, 2.0));
    float d = length(aOffset - uPointer.xz);
    float lift = 1.0 + 0.22 * exp(-d * d / 55.0);
    hCur *= lift; hObs *= lift;
    float h13 = aH.x * lift;

    vec3 p = position;
    p.xz *= 0.78;
    p.y *= hCur;
    p.xz += aOffset;
    if (hCur < 0.001) p = vec3(0.0, -50.0, 0.0);

    vY = p.y; vH13 = h13; vHObs = hObs; vHCur = hCur;
    vN = normal;
    vec4 world = modelMatrix * vec4(p, 1.0);
    vW = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const columnFragment = /* glsl */ `
  uniform vec3 uPointer;
  uniform vec3 uInk;
  uniform float uTime;
  varying float vY;
  varying float vH13;
  varying float vHObs;
  varying float vHCur;
  varying vec3 vN;
  varying vec3 vW;

  void main() {
    vec3 bone = vec3(0.86, 0.84, 0.79);
    vec3 sand = vec3(0.52, 0.80, 0.74);
    vec3 lat  = vec3(0.894, 0.376, 0.184);

    float eps = 0.002;
    vec3 col = vY <= vH13 + eps ? bone : (vY <= vHObs + eps ? sand : lat);

    vec3 L = normalize(vec3(-0.45, 1.0, 0.3));
    float diff = max(dot(vN, L), 0.0);
    float top = step(0.5, vN.y);
    float lit = 0.32 + 0.62 * diff + 0.12 * top;
    float ao = 0.45 + 0.55 * clamp(vY / max(vHCur, 0.0001), 0.0, 1.0);
    col *= lit * mix(ao, 1.0, top);

    // strata lines at each epoch boundary
    float band = smoothstep(0.05, 0.0, abs(vY - vH13)) * step(vH13, vHCur - 0.05)
               + smoothstep(0.05, 0.0, abs(vY - vHObs)) * step(vHObs, vHCur - 0.05);
    col = mix(col, vec3(0.05), band * 0.55 * (1.0 - top));

    bool forecast = vY > vHObs + eps;
    if (forecast) col += lat * (0.18 + 0.06 * sin(uTime * 2.2 + vW.x * 0.15));

    float d = length(vW.xz - uPointer.xz);
    col += vec3(1.0, 0.62, 0.4) * 0.22 * exp(-d * d / 45.0);

    float fd = length(vW - cameraPosition);
    col = mix(col, uInk, smoothstep(300.0, 560.0, fd));
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Columns({ field, shared }: { field: Field; shared: Shared }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const epoch = useRef(shared.reduced ? 4 : 0);

  const geometry = useMemo(() => {
    const base = new THREE.BoxGeometry(1, 1, 1);
    base.translate(0, 0.5, 0);
    const g = new THREE.InstancedBufferGeometry();
    g.index = base.index;
    g.setAttribute("position", base.getAttribute("position"));
    g.setAttribute("normal", base.getAttribute("normal"));
    const h4 = new Float32Array(field.count * 4);
    const h5 = new Float32Array(field.count);
    for (let i = 0; i < field.count; i++) {
      for (let e = 0; e < 4; e++) h4[i * 4 + e] = field.heights[i * 5 + e];
      h5[i] = field.heights[i * 5 + 4];
    }
    g.setAttribute("aOffset", new THREE.InstancedBufferAttribute(field.offsets, 2));
    g.setAttribute("aH", new THREE.InstancedBufferAttribute(h4, 4));
    g.setAttribute("aH5", new THREE.InstancedBufferAttribute(h5, 1));
    g.instanceCount = field.count;
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 160);
    return g;
  }, [field]);

  const uniforms = useMemo(
    () => ({
      uEpoch: { value: epoch.current },
      uPointer: { value: new THREE.Vector3(999, 0, 999) },
      uInk: { value: INK },
      uTime: { value: 0 },
    }),
    [],
  );

  useFrame((state, dt) => {
    const target = Math.min(timeline.phase, 4);
    const k = 1 - Math.exp(-dt * (timeline.phase === 0 && epoch.current > 1 ? 1.6 : 2.4));
    epoch.current += (target - epoch.current) * k;
    uniforms.uEpoch.value = epoch.current;
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uPointer.value.lerp(shared.pointerWorld as THREE.Vector3, 0.12);
  });

  return (
    <mesh geometry={geometry} frustumCulled={false}>
      <shaderMaterial ref={mat} vertexShader={columnVertex} fragmentShader={columnFragment} uniforms={uniforms} />
    </mesh>
  );
}

/* ------------------------------------------------------------------- ground */

const groundVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vW;
  void main() {
    vUv = uv;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const groundFragment = /* glsl */ `
  uniform sampler2D uField;
  uniform float uForecast;
  uniform float uSuit;
  uniform float uScan;
  uniform float uScanAmp;
  uniform vec3 uPointer;
  uniform vec3 uInk;
  uniform float uPad;
  uniform vec2 uGrid;
  varying vec2 vUv;
  varying vec3 vW;

  float gridLine(vec2 g, float w) {
    vec2 d = abs(fract(g - 0.5) - 0.5) / fwidth(g);
    return 1.0 - min(min(d.x, d.y) / w, 1.0);
  }

  void main() {
    vec2 uv = (vUv - 0.5) * uPad + 0.5;           // 0..1 over the study window
    vec2 fuv = vec2(uv.x, 1.0 - uv.y);            // raster row 0 is north
    float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
    vec4 f = texture2D(uField, clamp(fuv, 0.0, 1.0)) * inside;

    vec3 col = vec3(0.040, 0.048, 0.058);
    vec2 g = uv * uGrid;
    col += vec3(0.85, 0.9, 0.95) * gridLine(g, 1.0) * 0.028;
    col += vec3(0.85, 0.9, 0.95) * gridLine(g / 10.0, 1.2) * 0.07;

    // study window frame
    vec2 e = min(uv, 1.0 - uv);
    float frame = smoothstep(0.004, 0.0, abs(min(e.x, e.y))) * step(-0.004, min(e.x, e.y));
    col += vec3(0.9, 0.88, 0.82) * frame * 0.22;

    col = mix(col, vec3(0.12, 0.26, 0.30), f.b * 0.95);
    vec3 lat = vec3(0.894, 0.376, 0.184);
    col += lat * pow(f.r, 1.8) * 0.42 * uForecast;
    col += vec3(0.435, 0.765, 0.71) * pow(f.g, 2.4) * 0.42 * uSuit;

    // descending pass, north to south
    float band = exp(-pow((uv.y - uScan) * 55.0, 2.0)) * inside;
    col += vec3(0.95, 0.9, 0.82) * band * 0.16 * uScanAmp;

    float d = length(vW.xz - uPointer.xz);
    col += lat * (smoothstep(0.35, 0.0, abs(d - 7.0)) * 0.22 + exp(-d * d / 60.0) * 0.07);

    float r = length((vUv - 0.5) * vec2(1.0, 1.0));
    float fade = smoothstep(0.5, 0.26, r);
    float fd = length(vW - cameraPosition);
    col = mix(uInk, col, fade);
    col = mix(col, uInk, smoothstep(320.0, 600.0, fd));
    gl_FragColor = vec4(col, 1.0);
  }
`;

const PAD = 1.7;

function Ground({ field, shared }: { field: Field; shared: Shared }) {
  const texture = useMemo(() => {
    const t = new THREE.DataTexture(field.texture, FIELD_W, FIELD_H, THREE.RGBAFormat);
    t.magFilter = THREE.LinearFilter;
    t.minFilter = THREE.LinearFilter;
    t.needsUpdate = true;
    return t;
  }, [field]);

  const uniforms = useMemo(
    () => ({
      uField: { value: texture },
      uForecast: { value: 0 },
      uSuit: { value: 0 },
      uScan: { value: 2 },
      uScanAmp: { value: 0 },
      uPointer: { value: new THREE.Vector3(999, 0, 999) },
      uInk: { value: INK },
      uPad: { value: PAD },
      uGrid: { value: new THREE.Vector2(FIELD_W, FIELD_H) },
    }),
    [texture],
  );

  const scanStart = useRef(-10);
  useEffect(() => timeline.subscribe(() => (scanStart.current = performance.now())), []);

  useFrame((_, dt) => {
    const p = timeline.phase;
    const k = 1 - Math.exp(-dt * 2);
    uniforms.uForecast.value += ((p >= 3 ? 1 : 0) - uniforms.uForecast.value) * k;
    uniforms.uSuit.value += ((p === 5 ? 1 : 0) - uniforms.uSuit.value) * k;
    const s = (performance.now() - scanStart.current) / 1500;
    uniforms.uScan.value = 1.05 - s * 1.1;
    uniforms.uScanAmp.value = s < 1 ? Math.sin(Math.PI * s) : 0;
    uniforms.uPointer.value.lerp(shared.pointerWorld as THREE.Vector3, 0.12);
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-0.01}>
      <planeGeometry args={[FIELD_W * PAD, FIELD_H * PAD, 1, 1]} />
      <shaderMaterial vertexShader={groundVertex} fragmentShader={groundFragment} uniforms={uniforms} />
    </mesh>
  );
}

/* -------------------------------------------------------------------- zones */

const beamVertex = /* glsl */ `
  varying float vH;
  void main() { vH = uv.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const beamFragment = /* glsl */ `
  uniform float uAlpha;
  varying float vH;
  void main() {
    float a = pow(1.0 - vH, 1.6) * uAlpha;
    gl_FragColor = vec4(vec3(1.0, 0.55, 0.3) * a, a);
  }
`;

const BEAM_H = 30;

function Zones({ labelRefs }: { labelRefs: React.MutableRefObject<(HTMLDivElement | null)[]> }) {
  const group = useRef<THREE.Group>(null);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const amount = useRef(0);
  const { camera, size } = useThree();
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const uniforms = useMemo(() => ({ uAlpha: { value: 0 } }), []);
  const ringMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#E4602F", transparent: true, opacity: 0, depthWrite: false }),
    [],
  );

  useFrame((state, dt) => {
    const target = timeline.phase === 5 ? 1 : 0;
    amount.current += (target - amount.current) * (1 - Math.exp(-dt * 2.6));
    const a = amount.current;
    uniforms.uAlpha.value = a * 0.9;
    ringMat.opacity = a * 0.85;
    if (group.current) group.current.visible = a > 0.01;

    ZONES.forEach((z, i) => {
      const ring = rings.current[i];
      if (ring) {
        const pulse = 1 + 0.25 * Math.sin(state.clock.elapsedTime * 2 + i);
        ring.scale.setScalar(Math.max(a, 0.001) * pulse);
      }
      const el = labelRefs.current[i];
      if (!el) return;
      const w = toWorld(z.bx, z.by);
      tmp.set(w.x, BEAM_H * a * 0.4, w.z).project(camera);
      const x = (tmp.x * 0.5 + 0.5) * size.width;
      const y = (-tmp.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.style.opacity = String(Math.max(0, (a - 0.35) / 0.65));
    });
  });

  return (
    <group ref={group}>
      {ZONES.map((z, i) => {
        const w = toWorld(z.bx, z.by);
        return (
          <group key={z.rank} position={[w.x, 0, w.z]}>
            <mesh position-y={BEAM_H / 2}>
              <cylinderGeometry args={[0.11, 0.11, BEAM_H, 6, 1, true]} />
              <shaderMaterial
                vertexShader={beamVertex}
                fragmentShader={beamFragment}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            <mesh ref={(m) => (rings.current[i] = m)} rotation-x={-Math.PI / 2} position-y={0.05} material={ringMat}>
              <ringGeometry args={[2.2, 2.55, 48]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ------------------------------------------------------------------- camera */

function Rig({ shared }: { shared: Shared }) {
  const { camera, size } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0, 4), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const smooth = useRef({ az: 0, pol: 0, s: 0 });
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const hitPoint = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const w = size.width;
    const h = size.height;
    if (w >= 1024) cam.setViewOffset(w, h, -w * 0.17, h * 0.02, w, h);
    else cam.setViewOffset(w, h, 0, h * 0.06, w, h);
    cam.updateProjectionMatrix();
  }, [camera, size]);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const mobile = size.width < 1024;
    const k = 1 - Math.exp(-dt * 2.2);
    const sm = smooth.current;
    const drift = shared.reduced ? 0 : Math.sin(t * 0.06) * 0.07;
    sm.az += (shared.pointer.x * 0.16 + drift - sm.az) * k;
    sm.pol += (-shared.pointer.y * 0.06 - sm.pol) * k;
    sm.s += (shared.scroll - sm.s) * (1 - Math.exp(-dt * 5));

    const radius = (mobile ? (size.width < 640 ? 440 : 380) : 330) - sm.s * 60;
    const polar = 0.98 + sm.pol - sm.s * 0.55;
    const az = 0.36 + sm.az + sm.s * 0.25;
    camera.position.set(
      target.x + radius * Math.sin(polar) * Math.sin(az),
      target.y + radius * Math.cos(polar),
      target.z + radius * Math.sin(polar) * Math.cos(az),
    );
    look.copy(target);
    camera.lookAt(look);

    ndc.set(shared.pointer.x, shared.pointer.y);
    ray.setFromCamera(ndc, camera);
    const hit = shared.pointer.touched ? ray.ray.intersectPlane(plane, hitPoint) : null;
    if (hit) {
      shared.pointerWorld.x = hit.x;
      shared.pointerWorld.z = hit.z;
    } else {
      shared.pointerWorld.x = 999;
      shared.pointerWorld.z = 999;
    }
  });
  return null;
}

/* -------------------------------------------------------------------- scene */

export default function HeroScene({
  shared,
  onReady,
  labelRefs,
  active,
}: {
  shared: Shared;
  onReady: () => void;
  labelRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  active: boolean;
}) {
  const [field, setField] = useState<Field | null>(null);

  useEffect(() => {
    let alive = true;
    loadField(5.2).then((f) => alive && setField(f));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, typeof window !== "undefined" && window.innerWidth < 768 ? 1.5 : 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
      camera={{ fov: 30, near: 1, far: 1400, position: [60, 110, 150] }}
      onCreated={({ gl }) => gl.setClearColor(INK)}
      aria-hidden
    >
      {field && (
        <>
          <Ground field={field} shared={shared} />
          <Columns field={field} shared={shared} />
          <Zones labelRefs={labelRefs} />
          <Ready onReady={onReady} />
        </>
      )}
      <Rig shared={shared} />
    </Canvas>
  );
}

function Ready({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (!done.current) {
      done.current = true;
      requestAnimationFrame(onReady);
    }
  });
  return null;
}

export type { Shared };
