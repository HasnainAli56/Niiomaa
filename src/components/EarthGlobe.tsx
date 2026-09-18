"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface EarthGlobeProps {
  className?: string;
  autoRotateSpeed?: number;
}

let preloadedModelGroup: THREE.Group | null = null;
let preloadPromise: Promise<THREE.Group> | null = null;

export function preloadEarthModel(): Promise<THREE.Group> {
  if (preloadedModelGroup) {
    return Promise.resolve(preloadedModelGroup);
  }
  if (!preloadPromise) {
    const loader = new GLTFLoader();
    preloadPromise = new Promise((resolve, reject) => {
      loader.load(
        "/earth.glb",
        (gltf) => {
          const model = gltf.scene;

          // Normalize center and scale to unit radius 1
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);

          model.position.sub(center);
          const scaleFactor = 2 / (maxDim || 2);
          model.scale.set(scaleFactor, scaleFactor, scaleFactor);

          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = false;
              mesh.receiveShadow = false;

              const materials = Array.isArray(mesh.material)
                ? mesh.material
                : [mesh.material];
              materials.forEach((m) => {
                if (m && "roughness" in m) {
                  const mat = m as THREE.MeshStandardMaterial;
                  mat.roughness = 0.42;
                  mat.metalness = 0.08;
                  // Vibrant cosmic oceanic blue color multiplier
                  mat.color.setRGB(0.70, 0.94, 1.45);
                  // Deep sapphire luminescence for oceans and night side
                  mat.emissive.setRGB(0.02, 0.08, 0.28);
                  mat.emissiveIntensity = 0.75;
                  if (mat.map) {
                    mat.map.colorSpace = THREE.SRGBColorSpace;
                  }
                }
              });
            }
          });

          preloadedModelGroup = model;
          resolve(model);
        },
        undefined,
        (error) => {
          preloadPromise = null;
          reject(error);
        }
      );
    });
  }
  return preloadPromise;
}

export const EarthGlobe: React.FC<EarthGlobeProps> = ({
  className = "",
  autoRotateSpeed = 0.0018,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [arcMetrics, setArcMetrics] = useState<{ cx: number; cy: number; r: number } | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.set(0, 0, 5.0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    // 4. Lighting setup
    // Rich deep blue ambient light to bathe oceans and unlit regions in cosmic sapphire
    const ambientLight = new THREE.AmbientLight(0x0a2f6c, 1.8);
    scene.add(ambientLight);

    // Main directional sunlight with clean cool-white spectrum
    const sunLight = new THREE.DirectionalLight(0xdff2ff, 4.2);
    const sunPos = new THREE.Vector3(-6, 4.2, 4.2);
    sunLight.position.copy(sunPos);
    scene.add(sunLight);

    // Electric cyan rim grazing light on top-left horizon
    const rimFill = new THREE.DirectionalLight(0x00f0ff, 3.8);
    rimFill.position.set(-3.5, 5.5, 2.2);
    scene.add(rimFill);

    // Deep blue secondary rim light for edge depth
    const deepBlueFill = new THREE.DirectionalLight(0x1e50ff, 2.6);
    deepBlueFill.position.set(-5.5, -2.5, 3.0);
    scene.add(deepBlueFill);

    // 5. Positioning hierarchy
    const rootPositionGroup = new THREE.Group();
    scene.add(rootPositionGroup);

    let currentRadius = 3.05;
    let currentPosX = 1.90;
    let currentPosY = -2.25;

    const updatePositionAndScale = (w: number, h: number) => {
      const currentAspect = w / h;
      camera.aspect = currentAspect;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      if (currentAspect >= 1.3) {
        currentRadius = 3.1;
        currentPosX = 1.85 * Math.pow(currentAspect / 1.78, 0.65);
        currentPosY = -2.12;
      } else if (currentAspect >= 0.8) {
        currentRadius = 2.8;
        currentPosX = 1.2;
        currentPosY = -1.95;
      } else {
        currentRadius = 2.5;
        currentPosX = 0.2;
        currentPosY = -1.75;
      }

      rootPositionGroup.position.set(currentPosX, currentPosY, 0);
      rootPositionGroup.scale.set(currentRadius, currentRadius, currentRadius);

      // Compute exact 2D screen coordinates for neon arc overlay
      const centerVec = new THREE.Vector3(currentPosX, currentPosY, 0);
      centerVec.project(camera);
      const cx = ((centerVec.x + 1) / 2) * w;
      const cy = ((-centerVec.y + 1) / 2) * h;

      const edgeVec = new THREE.Vector3(currentPosX + currentRadius, currentPosY, 0);
      edgeVec.project(camera);
      const edgeX = ((edgeVec.x + 1) / 2) * w;
      const edgeY = ((-edgeVec.y + 1) / 2) * h;

      const r = Math.hypot(edgeX - cx, edgeY - cy);
      setArcMetrics({ cx, cy, r });
    };

    updatePositionAndScale(width, height);

    const tiltGroup = new THREE.Group();
    // Realistic axial tilt
    tiltGroup.rotation.z = THREE.MathUtils.degToRad(-15);
    tiltGroup.rotation.x = THREE.MathUtils.degToRad(16);
    rootPositionGroup.add(tiltGroup);

    const earthPivot = new THREE.Group();
    tiltGroup.add(earthPivot);

    // Atmospheric BackSide Fresnel Glow Mesh
    const atmosphereVertexShader = `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    const atmosphereFragmentShader = `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.70 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.6);
        vec3 col = mix(vec3(0.0, 0.85, 1.0), vec3(0.12, 0.45, 1.0), intensity);
        gl_FragColor = vec4(col, 1.0) * intensity * 2.5;
      }
    `;
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.026, 64, 64),
      atmosphereMaterial
    );
    earthPivot.add(atmosphereMesh);

    // FrontSide Grazing Rim Light (inner atmosphere edge)
    const innerRimFrag = `
      varying vec3 vNormal;
      void main() {
        float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
        rim = pow(rim, 3.5);
        gl_FragColor = vec4(0.0, 0.78, 1.0, rim * 0.95);
      }
    `;
    const innerRimMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: innerRimFrag,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false,
    });
    const innerRimMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.004, 64, 64),
      innerRimMaterial
    );
    earthPivot.add(innerRimMesh);

    // 6. Load GLTF Model via Preloaded Cache
    preloadEarthModel()
      .then((preloadedGroup) => {
        if (!mountRef.current) return;
        const clone = preloadedGroup.clone(true);
        earthPivot.add(clone);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading earth.glb:", error);
        setIsLoading(false);
      });

    // 7. Interactive dragging
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let velocityX = 0;
    let velocityY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      velocityX = 0;
      velocityY = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      earthPivot.rotation.y += deltaX * 0.003;
      tiltGroup.rotation.x += deltaY * 0.002;
      tiltGroup.rotation.x = Math.max(-0.4, Math.min(0.5, tiltGroup.rotation.x));

      velocityX = deltaX * 0.003;
      velocityY = deltaY * 0.002;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // 8. Responsive ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          updatePositionAndScale(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // 9. Animation loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isDragging) {
        if (Math.abs(velocityX) > 0.0001) {
          earthPivot.rotation.y += velocityX;
          velocityX *= 0.94;
        } else {
          earthPivot.rotation.y += autoRotateSpeed;
        }

        if (Math.abs(velocityY) > 0.0001) {
          tiltGroup.rotation.x += velocityY;
          tiltGroup.rotation.x = Math.max(-0.4, Math.min(0.5, tiltGroup.rotation.x));
          velocityY *= 0.94;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);

      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }

      renderer.dispose();
      scene.clear();
    };
  }, [autoRotateSpeed]);

  return (
    <div
      ref={mountRef}
      className={`relative cursor-grab active:cursor-grabbing select-none ${className}`}
      style={{ touchAction: "pan-y" }}
      title="Click and drag to rotate Earth"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-12 h-12 rounded-full border-2 border-cyan-400/20 border-t-cyan-400 animate-spin" />
        </div>
      )}

      {/* ============================================================ */}
      {/* Laser-Sharp Electric Neon Circumference Glow                 */}
      {/* ============================================================ */}
      {arcMetrics && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden"
          style={{ mixBlendMode: "screen" }}
        >
          <defs>
            {/* Neon multi-tier bloom filter */}
            <filter id="laserNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
              {/* Tight sharp core glow */}
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="sharpGlow" />
              {/* Medium radiant bloom */}
              <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="medBloom" />
              {/* Wide ambient atmosphere haze */}
              <feGaussianBlur in="SourceGraphic" stdDeviation="28" result="wideHaze" />
              {/* Extra soft cosmic bloom */}
              <feGaussianBlur in="SourceGraphic" stdDeviation="60" result="cosmicAura" />
              <feMerge>
                <feMergeNode in="cosmicAura" />
                <feMergeNode in="wideHaze" />
                <feMergeNode in="medBloom" />
                <feMergeNode in="sharpGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Neon gradient grazing from sunlit top-left to deep dark-side */}
            <linearGradient id="neonHorizonGrad" x1="0%" y1="100%" x2="90%" y2="20%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="25%" stopColor="#00f0ff" stopOpacity="1" />
              <stop offset="55%" stopColor="#38bdf8" stopOpacity="0.95" />
              <stop offset="78%" stopColor="#1d4ed8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.0" />
            </linearGradient>

            {/* Core electric cyan gradient */}
            <linearGradient id="coreNeonBeam" x1="0%" y1="100%" x2="90%" y2="20%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
              <stop offset="30%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="60%" stopColor="#cffafe" stopOpacity="0.9" />
              <stop offset="85%" stopColor="#38bdf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* 1. Outermost soft cosmic atmosphere halo */}
          <circle
            cx={arcMetrics.cx}
            cy={arcMetrics.cy}
            r={arcMetrics.r + 3}
            fill="none"
            stroke="url(#neonHorizonGrad)"
            strokeWidth="18"
            opacity="0.55"
            style={{
              filter: "blur(14px)",
            }}
          />

          {/* 2. Radiant neon bloom arc */}
          <circle
            cx={arcMetrics.cx}
            cy={arcMetrics.cy}
            r={arcMetrics.r}
            fill="none"
            stroke="url(#neonHorizonGrad)"
            strokeWidth="6"
            filter="url(#laserNeonGlow)"
            opacity="0.95"
          />

          {/* 3. Razor-sharp white-hot neon core wire */}
          <circle
            cx={arcMetrics.cx}
            cy={arcMetrics.cy}
            r={arcMetrics.r}
            fill="none"
            stroke="url(#coreNeonBeam)"
            strokeWidth="2.2"
            opacity="0.95"
            style={{
              filter: "drop-shadow(0 0 5px #00f0ff) drop-shadow(0 0 14px #0284c7)",
            }}
          />
        </svg>
      )}
    </div>
  );
};
export default EarthGlobe;
