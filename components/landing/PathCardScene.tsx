"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type PathCardSceneProps = {
  variant: "ai" | "math";
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function makeTextSprite(symbol: string, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 192;
  canvas.height = 192;
  const context = canvas.getContext("2d");
  if (!context) return null;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.shadowColor = color;
  context.shadowBlur = 18;
  context.fillStyle = color;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "700 86px Georgia, 'Times New Roman', serif";
  context.fillText(symbol, 96, 100);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.userData.texture = texture;
  return sprite;
}

export function PathCardScene({ variant }: PathCardSceneProps) {
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.45));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
    camera.position.set(0, 0, 8.4);

    const root = new THREE.Group();
    scene.add(root);

    const cyan = new THREE.Color("#53edf0");
    const blue = new THREE.Color("#78a4ff");
    const violet = new THREE.Color("#b275ff");
    const nodes: THREE.Mesh[] = [];
    const lines: THREE.Line[] = [];
    const sprites: THREE.Sprite[] = [];
    const pulses: THREE.Mesh[] = [];

    if (variant === "ai") {
      root.position.set(2.08, -0.56, 0);
      root.rotation.set(-0.12, -0.34, 0.05);
      root.scale.setScalar(0.86);

      const layers = [
        [-1.95, [-1.05, -0.35, 0.35, 1.05]],
        [-0.55, [-1.25, -0.62, 0, 0.62, 1.25]],
        [0.85, [-0.9, -0.28, 0.42, 1.05]],
        [2.05, [-0.55, 0.55]],
      ] as const;
      const positions: THREE.Vector3[][] = layers.map(([x, ys]) =>
        ys.map((y, index) => new THREE.Vector3(x, y, Math.sin(index + x) * 0.28)),
      );

      const nodeGeometry = new THREE.SphereGeometry(0.06, 18, 18);
      positions.flat().forEach((position, index) => {
        const color = index % 3 === 0 ? violet : index % 2 === 0 ? blue : cyan;
        const node = new THREE.Mesh(
          nodeGeometry,
          new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.95,
            blending: THREE.AdditiveBlending,
          }),
        );
        node.position.copy(position);
        node.userData.base = position.clone();
        node.userData.phase = index * 0.71;
        nodes.push(node);
        root.add(node);
      });

      positions.slice(0, -1).forEach((layer, layerIndex) => {
        const nextLayer = positions[layerIndex + 1];
        layer.forEach((from, fromIndex) => {
          nextLayer.forEach((to, toIndex) => {
            if ((fromIndex + toIndex + layerIndex) % 2 === 0 || Math.abs(from.y - to.y) < 0.72) {
              const geometry = new THREE.BufferGeometry().setFromPoints([from, to]);
              const material = new THREE.LineBasicMaterial({
                color: layerIndex === 1 ? 0x78a4ff : 0x4de6e9,
                transparent: true,
                opacity: 0.18,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
              });
              const line = new THREE.Line(geometry, material);
              lines.push(line);
              root.add(line);
            }
          });
        });
      });

      const pulseGeometry = new THREE.SphereGeometry(0.035, 12, 12);
      const pulseMaterial = new THREE.MeshBasicMaterial({
        color: 0x82fff7,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });
      for (let i = 0; i < 9; i += 1) {
        const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial.clone());
        pulse.userData.line = lines[i % lines.length];
        pulse.userData.phase = i / 9;
        pulses.push(pulse);
        root.add(pulse);
      }
    } else {
      root.position.set(0, -0.04, 0);
      root.rotation.set(0, 0, 0);
      root.scale.setScalar(1);

      const symbols = ["∑", "π", "∞", "√", "∫", "Δ", "θ", "λ", "ƒ", "∇"];
      const placements = [
        [-2.18, -1.18, -0.05, 10],
        [-1.72, 0.58, 0.05, 7],
        [-1.05, -0.3, 0.02, 8],
        [-0.42, 1.34, -0.04, 6],
        [0.28, -1.02, 0.06, 9],
        [0.98, 0.3, 0, 5],
        [1.72, 1.18, 0.04, 4],
        [2.18, -0.72, -0.03, 6],
        [-2.1, 1.5, 0.05, 5],
        [1.48, -0.08, -0.05, 7],
      ] as const;

      symbols.forEach((symbol, index) => {
        const sprite = makeTextSprite(symbol, index % 3 === 0 ? "#d7c2ff" : "#7eeaf0");
        if (!sprite) return;
        const [x, y, z, scale] = placements[index];
        const visualScale = 0.32 + (clamp(scale, 1, 10) / 10) * 0.92;
        sprite.position.set(x, y, z);
        sprite.scale.setScalar(visualScale);
        sprite.material.opacity = index === 0 ? 0.68 : 0.5;
        sprite.userData.base = sprite.position.clone();
        sprite.userData.phase = index * 0.73;
        sprite.userData.radiusX = 0.045 + (index % 3) * 0.018;
        sprite.userData.radiusY = 0.035 + (index % 4) * 0.012;
        sprites.push(sprite);
        root.add(sprite);
      });
    }

    let width = 1;
    let height = 1;
    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const cardScale = clamp(width / 520, 0.7, 1.2);
      root.scale.setScalar((variant === "ai" ? 0.86 : 1) * cardScale);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    let raf = 0;
    const animate = (time: number) => {
      const t = reducedMotion.matches ? 0.2 : time * 0.001;
      root.rotation.y += reducedMotion.matches ? 0 : Math.sin(t * 0.25) * 0.0009;

      if (variant === "ai") {
        nodes.forEach((node) => {
          const base = node.userData.base as THREE.Vector3;
          const phase = node.userData.phase as number;
          node.position.y = base.y + Math.sin(t * 1.15 + phase) * 0.045;
          const scale = 1 + Math.sin(t * 2.1 + phase) * 0.22;
          node.scale.setScalar(scale);
        });
        pulses.forEach((pulse) => {
          const line = pulse.userData.line as THREE.Line;
          const phase = pulse.userData.phase as number;
          const pos = line.geometry.attributes.position as THREE.BufferAttribute;
          const a = new THREE.Vector3(pos.getX(0), pos.getY(0), pos.getZ(0));
          const b = new THREE.Vector3(pos.getX(1), pos.getY(1), pos.getZ(1));
          const mix = (t * 0.28 + phase) % 1;
          pulse.position.copy(a.lerp(b, mix));
          (pulse.material as THREE.MeshBasicMaterial).opacity = 0.25 + Math.sin(mix * Math.PI) * 0.65;
        });
      } else {
        sprites.forEach((sprite) => {
          const base = sprite.userData.base as THREE.Vector3;
          const phase = sprite.userData.phase as number;
          const radiusX = sprite.userData.radiusX as number;
          const radiusY = sprite.userData.radiusY as number;
          sprite.position.x = base.x + Math.sin(t * 0.22 + phase) * radiusX;
          sprite.position.y = base.y + Math.cos(t * 0.18 + phase) * radiusY;
          sprite.material.opacity = (phase < 0.8 ? 0.6 : 0.48) + Math.sin(t * 0.16 + phase) * 0.035;
        });
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      root.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Sprite) {
          const geometry = "geometry" in object ? object.geometry : undefined;
          if (geometry) geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) {
            material.forEach((entry) => entry.dispose());
          } else {
            if (object instanceof THREE.Sprite && object.userData.texture) {
              (object.userData.texture as THREE.Texture).dispose();
            }
            material.dispose();
          }
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [variant]);

  return <div className={`path-card-scene path-card-scene--${variant}`} ref={hostRef} aria-hidden="true" />;
}
