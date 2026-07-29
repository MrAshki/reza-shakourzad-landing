"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const SCENE_TUNING = {
  // Manual placement controls for the whole 3D model.
  // x: negative = left, positive = right
  // y: positive = up, negative = down
  // z: negative = farther, positive = closer
  rootPosition: { x: 2, y: 0.5, z: -50 },
  rootRotation: { x: -0.72, y: 0, z: -0.02 },
  desktopScale: 9,
  mobileScale: 0.78,
  desktopCameraZ: 15,
  mobileCameraZ: 14.5,

  // Manual placement controls for the dotted terrain itself.
  terrainPosition: { x: -4.4, y: -0.42, z: -0.5 },
  pointSize: 0.002,
  pointOpacity: 0.96,

  // Shape controls. Increase moundHeight for a taller dome.
  moundCenter: { x: 0.5, z: -0.12 },
  moundSpread: { x: 3.18, z: 3 },
  moundHeight: 4,
  secondaryHeight: 0.5,
  waveStrength: 0.08,

  // Orbit ring around the dome.
  haloPosition: { x: -5.95, y: 2.62, z: -0.48 },
} as const;

export default function BackgroundScene() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.65));
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 100);
    camera.position.set(0, 2.6, 12.5);

    const root = new THREE.Group();
    root.position.set(
      SCENE_TUNING.rootPosition.x,
      SCENE_TUNING.rootPosition.y,
      SCENE_TUNING.rootPosition.z,
    );
    root.rotation.x = SCENE_TUNING.rootRotation.x;
    root.rotation.y = SCENE_TUNING.rootRotation.y;
    root.rotation.z = SCENE_TUNING.rootRotation.z;
    scene.add(root);

    const cols = 156;
    const rows = 86;
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const base = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    const cyan = new THREE.Color("#36d6df");
    const blue = new THREE.Color("#7e9df8");
    const violet = new THREE.Color("#a36bf4");
    const deep = new THREE.Color("#10233c");

    let ptr = 0;
    for (let yIndex = 0; yIndex < rows; yIndex += 1) {
      const v = yIndex / (rows - 1);
      for (let xIndex = 0; xIndex < cols; xIndex += 1) {
        const u = xIndex / (cols - 1);
        const x = (u - 0.5) * 15.8;
        const z = (v - 0.5) * 7.2;
        const cx = SCENE_TUNING.moundCenter.x;
        const cz = SCENE_TUNING.moundCenter.z;
        const dx = (x - cx) / SCENE_TUNING.moundSpread.x;
        const dz = (z - cz) / SCENE_TUNING.moundSpread.z;
        const mound = Math.exp(-(dx * dx + dz * dz) * 1.08);
        const secondary = Math.exp(
          -(((x + 0.7) / 6.5) ** 2 + ((z + 1.0) / 3.8) ** 2),
        );
        const height =
          mound * SCENE_TUNING.moundHeight +
          secondary * SCENE_TUNING.secondaryHeight -
          v * 0.28;
        const wave =
          Math.sin(u * Math.PI * 5.2 + v * 3.1) * SCENE_TUNING.waveStrength;
        const i = ptr * 3;
        base[i] = x;
        base[i + 1] = height + wave;
        base[i + 2] = z;
        positions[i] = base[i];
        positions[i + 1] = base[i + 1];
        positions[i + 2] = base[i + 2];
        phases[ptr] = Math.sin(xIndex * 0.77 + yIndex * 1.31) * Math.PI;

        const c = deep.clone().lerp(cyan, clamp(0.2 + v * 0.52, 0, 1));
        c.lerp(blue, clamp(mound * 0.72, 0, 1));
        c.lerp(violet, clamp(mound * 0.62 + (1 - v) * 0.16, 0, 0.9));
        colors[i] = c.r;
        colors[i + 1] = c.g;
        colors[i + 2] = c.b;
        ptr += 1;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: SCENE_TUNING.pointSize,
      vertexColors: true,
      transparent: true,
      opacity: SCENE_TUNING.pointOpacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const terrain = new THREE.Points(geometry, material);
    terrain.position.set(
      SCENE_TUNING.terrainPosition.x,
      SCENE_TUNING.terrainPosition.y,
      SCENE_TUNING.terrainPosition.z,
    );
    root.add(terrain);

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(1.82, 0.012, 10, 156),
      new THREE.MeshBasicMaterial({
        color: 0x9b73f5,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    halo.position.set(
      SCENE_TUNING.haloPosition.x,
      SCENE_TUNING.haloPosition.y,
      SCENE_TUNING.haloPosition.z,
    );
    halo.rotation.x = Math.PI * 0.5;
    halo.scale.set(1, 0.32, 1);
    root.add(halo);

    const sparksGeometry = new THREE.BufferGeometry();
    const sparksCount = 95;
    const sparks = new Float32Array(sparksCount * 3);
    const sparkColors = new Float32Array(sparksCount * 3);
    for (let i = 0; i < sparksCount; i += 1) {
      const p = i * 3;
      sparks[p] = (Math.sin(i * 91.17) * 0.5 + 0.5) * 14.5 - 8.3;
      sparks[p + 1] = (Math.sin(i * 37.53 + 1.4) * 0.5 + 0.5) * 5.8 - 1.8;
      sparks[p + 2] = (Math.sin(i * 53.71 + 3.2) * 0.5 + 0.5) * 2.4 - 1.2;
      const sc = (i % 3 === 0 ? violet : cyan).clone();
      sparkColors[p] = sc.r;
      sparkColors[p + 1] = sc.g;
      sparkColors[p + 2] = sc.b;
    }
    sparksGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(sparks, 3),
    );
    sparksGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(sparkColors, 3),
    );
    const sparksMesh = new THREE.Points(
      sparksGeometry,
      new THREE.PointsMaterial({
        size: 0.045,
        vertexColors: true,
        transparent: true,
        opacity: 0.48,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    root.add(sparksMesh);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const setPointer = (clientX: number, clientY: number) => {
      mouse.tx = (clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = -(clientY / window.innerHeight - 0.5) * 2;
    };
    const onPointerMove = (event: PointerEvent) =>
      setPointer(event.clientX, event.clientY);
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) setPointer(touch.clientX, touch.clientY);
    };

    const updateScrollVars = () => {
      const y = window.scrollY;
      const fade = clamp(y / 360, 0, 1);
      const blur = clamp((y - 90) / 420, 0, 1);
      document.documentElement.style.setProperty(
        "--hero-copy-opacity",
        `${1 - fade}`,
      );
      document.documentElement.style.setProperty(
        "--hero-copy-y",
        `${-fade * 28}px`,
      );
      document.documentElement.style.setProperty(
        "--scene-blur",
        `${blur * 8}px`,
      );
      document.documentElement.style.setProperty(
        "--scene-saturate",
        `${1 - blur * 0.18}`,
      );
      document.documentElement.style.setProperty(
        "--scene-opacity",
        `${1 - blur * 0.08}`,
      );
    };

    let width = 1;
    let height = 1;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const wide = width >= 1180;
      camera.position.z = wide
        ? SCENE_TUNING.desktopCameraZ
        : SCENE_TUNING.mobileCameraZ;
      root.scale.setScalar(
        wide ? SCENE_TUNING.desktopScale : SCENE_TUNING.mobileScale,
      );
      updateScrollVars();
    };

    let frame = 0;
    let raf = 0;
    const animate = (time: number) => {
      mouse.x += (mouse.tx - mouse.x) * 0.045;
      mouse.y += (mouse.ty - mouse.y) * 0.045;

      const t = reducedMotion.matches ? 0.2 : time * 0.001;
      const pos = geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      if (!reducedMotion.matches || frame < 2) {
        for (let i = 0; i < count; i += 1) {
          const p = i * 3;
          const x = base[p];
          const z = base[p + 2];
          const breath = Math.sin(t * 0.55 + phases[i]) * 0.045;
          const mouseLift =
            Math.exp(
              -(
                (x / 7.9 - mouse.x * 0.42) ** 2 +
                (z / 3.6 - mouse.y * 0.34) ** 2
              ) * 4.3,
            ) * 0.22;
          arr[p + 1] = base[p + 1] + breath + mouseLift;
        }
        pos.needsUpdate = true;
      }

      root.rotation.y = mouse.x * 0.075;
      root.rotation.x = SCENE_TUNING.rootRotation.x + mouse.y * 0.045;
      halo.rotation.z = t * 0.12;
      sparksMesh.rotation.y = t * 0.025;
      sparksMesh.position.x = mouse.x * 0.32;
      sparksMesh.position.y = mouse.y * 0.18;
      renderer.render(scene, camera);
      frame += 1;
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("scroll", updateScrollVars, { passive: true });
    window.addEventListener("resize", resize);
    resize();
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", updateScrollVars);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      sparksGeometry.dispose();
      (sparksMesh.material as THREE.Material).dispose();
      (halo.geometry as THREE.BufferGeometry).dispose();
      (halo.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="three-background" ref={hostRef} aria-hidden="true" />;
}
