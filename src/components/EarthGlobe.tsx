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
                  mat.roughness = 0.60;
                  mat.metalness = 0.02;
                  // Moody dark sapphire ocean tones - avoids blown-out white glare
                  mat.color.setRGB(0.58, 0.78, 1.08);
                  mat.emissive.setRGB(0.003, 0.012, 0.035);
                  mat.emissiveIntensity = 0.08;
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

// Trigger background model preload immediately in browser
if (typeof window !== "undefined") {
  preloadEarthModel().catch(() => {});
}

export const EarthGlobe: React.FC<EarthGlobeProps> = ({
  className = "",
  autoRotateSpeed = 0.0018,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(!preloadedModelGroup);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup - Telephoto perspective (16 deg FOV at z=14.0)
    // Completely eliminates wide-angle egg/oval distortion: Earth is 100% round
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(16, aspect, 0.1, 1000);
    camera.position.set(0, 0, 14.0);

    // 3. Renderer setup - Exposure tuned down to 0.82 for rich cosmic space darkness
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.82;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    // 4. Lighting setup - Balanced dark space contrast
    // Deep cosmic blue ambient light
    const ambientLight = new THREE.AmbientLight(0x030d22, 0.75);
    scene.add(ambientLight);

    // Controlled directional sunlight - reveals topography and oceans without bleached whiteout
    const sunLight = new THREE.DirectionalLight(0xd5e8ff, 2.0);
    scene.add(sunLight);

    // Subtle pale blue atmosphere rim fill from sunward direction (matching #7DB7FF, low intensity)
    const rimFill = new THREE.DirectionalLight(0x7db7ff, 0.35);
    scene.add(rimFill);

    // Deep midnight cosmic fill for realistic space shadow depth
    const deepBlueFill = new THREE.DirectionalLight(0x040e24, 0.6);
    scene.add(deepBlueFill);

    // 5. Positioning hierarchy
    const rootPositionGroup = new THREE.Group();
    scene.add(rootPositionGroup);

    // Track sun direction in camera view space for realistic atmospheric Rayleigh scattering
    const sunDirectionVec = new THREE.Vector3();

    // 6. Physically Realistic Atmospheric Shaders
    // Common Vertex Shader: computes view-space normal, view-space position, and object-space coordinates
    const atmosphereVertexShader = `
      varying vec3 vViewNormal;
      varying vec3 vViewPosition;
      varying vec3 vObjectPosition;

      void main() {
        vObjectPosition = position;
        // Radial outward normal in camera view space
        vViewNormal = normalize(normalMatrix * normalize(position));
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    // Outer Atmospheric Limb Shader (Sphere radius ~1.019):
    // Thin (~1.9% Earth radius), physically proportional to real Earth atmosphere.
    // Illuminated along sunward limb with soft pale blue #7DB7FF, faint blue-white highlight #B9D9FF near illuminated apex.
    // Subtle organic irregularity along limb; completely dark on night side.
    const outerAtmosphereFrag = `
      uniform vec3 uSunDirection;

      varying vec3 vViewNormal;
      varying vec3 vViewPosition;
      varying vec3 vObjectPosition;

      void main() {
        vec3 viewDir = normalize(-vViewPosition);
        
        // On BackSide, vViewNormal points away from camera (negative dot)
        float vDotN = -dot(vViewNormal, viewDir);
        if (vDotN <= 0.0) discard;
        
        // Normalized altitude coordinate: 0.0 at outer atmosphere boundary, 1.0 at Earth surface horizon
        // For R_atm = 1.019, max -vViewNormal.z at Earth edge is sqrt(1 - (1/1.019)^2) ~= 0.192
        float s = clamp(vDotN / 0.192, 0.0, 1.0);
        
        // Physical Rayleigh scattering exponential falloff with altitude
        float falloff = pow(s, 2.2);

        // Sunlit illumination: Rayleigh scatter only occurs where direct sunlight strikes the atmosphere column
        float sunDot = dot(vViewNormal, uSunDirection);
        // Smooth twilight cutoff into zero darkness on the unlit night side
        float sunFactor = smoothstep(-0.16, 0.38, sunDot);
        if (sunFactor <= 0.001) discard;

        // Subtle organic atmospheric variation (cloud layers, tropospheric variations along limb)
        float n1 = sin(vObjectPosition.x * 14.0 + vObjectPosition.y * 9.0);
        float n2 = sin(vObjectPosition.y * 28.0 - vObjectPosition.z * 18.0);
        float irregularity = 1.0 + 0.08 * (0.6 * n1 + 0.4 * n2);

        // Color specifications:
        // Soft pale blue: #7DB7FF = rgb(0.490, 0.718, 1.000)
        // Faint blue-white highlight: #B9D9FF = rgb(0.725, 0.851, 1.000)
        // Deep space boundary: rgb(0.12, 0.28, 0.60)
        vec3 cPaleBlue = vec3(0.490, 0.718, 1.000);
        vec3 cBlueWhite = vec3(0.725, 0.851, 1.000);
        vec3 cSpaceTransition = vec3(0.120, 0.280, 0.600);

        // Faint blue-white highlight near the illuminated apex where sunlight strikes dense atmosphere
        float apexHighlight = pow(clamp(sunDot, 0.0, 1.0), 2.2) * pow(s, 1.6);
        vec3 limbColor = mix(cPaleBlue, cBlueWhite, clamp(apexHighlight * 0.75, 0.0, 1.0));
        vec3 finalColor = mix(cSpaceTransition, limbColor, smoothstep(0.0, 0.45, s));

        // Low opacity, natural translucent Rayleigh scattering
        float alpha = falloff * sunFactor * irregularity * 0.46;
        gl_FragColor = vec4(finalColor * alpha, alpha);
      }
    `;

    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: outerAtmosphereFrag,
      uniforms: {
        uSunDirection: { value: new THREE.Vector3(-0.701, 0.538, 0.468) },
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      depthTest: true,
    });

    // Outer Atmosphere Mesh (Thin ~1.9% layer, BackSide)
    const atmosphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.019, 64, 64),
      atmosphereMaterial
    );
    atmosphereMesh.renderOrder = 2;

    // Diffused Outer Rayleigh Glow (Sphere radius ~1.042, BackSide):
    // Provides the large blur, subtle diffused scattering and gradual falloff into deep space
    const diffusedGlowFrag = `
      uniform vec3 uSunDirection;

      varying vec3 vViewNormal;
      varying vec3 vViewPosition;

      void main() {
        vec3 viewDir = normalize(-vViewPosition);
        float vDotN = -dot(vViewNormal, viewDir);
        if (vDotN <= 0.0) discard;
        
        // For R = 1.042, edge threshold is sqrt(1 - (1/1.042)^2) ~= 0.28
        float s = clamp(vDotN / 0.28, 0.0, 1.0);
        // Soft gradual falloff
        float falloff = pow(s, 1.4);

        float sunDot = dot(vViewNormal, uSunDirection);
        float sunFactor = smoothstep(-0.20, 0.42, sunDot);
        if (sunFactor <= 0.001) discard;

        vec3 cPaleBlue = vec3(0.490, 0.718, 1.000);
        vec3 cSpaceVoid = vec3(0.060, 0.180, 0.450);
        vec3 glowCol = mix(cSpaceVoid, cPaleBlue, s);

        // Ultra-low opacity wide blur
        float alpha = falloff * sunFactor * 0.18;
        gl_FragColor = vec4(glowCol * alpha, alpha);
      }
    `;

    const diffusedGlowMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: diffusedGlowFrag,
      uniforms: {
        uSunDirection: { value: new THREE.Vector3(-0.701, 0.538, 0.468) },
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      depthTest: true,
    });

    const diffusedGlowMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.042, 64, 64),
      diffusedGlowMaterial
    );
    diffusedGlowMesh.renderOrder = 1;

    // Inner Surface Rayleigh Haze (Sphere radius 1.002, FrontSide):
    // Softly kisses the sunlit horizon of the planet; no hard vector line; zero glow on dark hemisphere.
    const innerRimFrag = `
      uniform vec3 uSunDirection;

      varying vec3 vViewNormal;
      varying vec3 vViewPosition;
      varying vec3 vObjectPosition;

      void main() {
        vec3 viewDir = normalize(-vViewPosition);
        
        // FrontSide grazing Fresnel angle (0.0 facing camera, 1.0 at grazing horizon)
        float vDotN = max(0.0, dot(vViewNormal, viewDir));
        float fresnel = 1.0 - vDotN;
        float grazingHaze = pow(fresnel, 4.2);

        // Sunlight alignment
        float sunDot = dot(vViewNormal, uSunDirection);
        float sunFactor = smoothstep(-0.12, 0.35, sunDot);
        if (sunFactor <= 0.001 || grazingHaze <= 0.001) discard;

        // Subtle organic irregularity
        float n = sin(vObjectPosition.x * 14.0 + vObjectPosition.y * 9.0) * 0.06;
        float irregularity = 1.0 + n;

        // Soft pale blue #7DB7FF with faint blue-white #B9D9FF apex highlight
        vec3 cPaleBlue = vec3(0.490, 0.718, 1.000);
        vec3 cBlueWhite = vec3(0.725, 0.851, 1.000);
        float highlight = pow(clamp(sunDot, 0.0, 1.0), 2.0) * pow(fresnel, 2.2);
        vec3 innerCol = mix(cPaleBlue, cBlueWhite, highlight * 0.55);

        // Very gentle low-opacity grazing haze
        float alpha = grazingHaze * sunFactor * irregularity * 0.30;
        gl_FragColor = vec4(innerCol * alpha, alpha);
      }
    `;

    const innerRimMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: innerRimFrag,
      uniforms: {
        uSunDirection: { value: new THREE.Vector3(-0.701, 0.538, 0.468) },
      },
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false,
      depthTest: true,
    });

    const innerRimMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.002, 64, 64),
      innerRimMaterial
    );
    innerRimMesh.renderOrder = 3;

    const updatePositionAndScale = (w: number, h: number) => {
      const currentAspect = w / h;
      camera.aspect = currentAspect;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      // Single-screen dimensions and aspect ratio
      const singleWidth = window.innerWidth;
      const singleAspect = singleWidth / h;

      // Telephoto camera visible dimensions at z=0 (distance 14.0)
      const totalWorldWidth = 2 * 14.0 * Math.tan(THREE.MathUtils.degToRad(8)) * currentAspect;
      const singleWorldWidth = 2 * 14.0 * Math.tan(THREE.MathUtils.degToRad(8)) * singleAspect;

      // Position Earth on right side of Screen 1 (~74% across Screen 1)
      let currentRadius = 2.85;
      let currentPosX = -totalWorldWidth / 2 + 0.74 * singleWorldWidth;
      let currentPosY = -1.95;

      if (singleAspect < 1.0) {
        currentRadius = 2.5;
        currentPosX = -totalWorldWidth / 2 + 0.55 * singleWorldWidth;
        currentPosY = -1.75;
      }

      rootPositionGroup.position.set(currentPosX, currentPosY, 0);
      rootPositionGroup.scale.set(currentRadius, currentRadius, currentRadius);

      // Lock light positions relative to Earth
      sunLight.position.set(currentPosX - 7.5, 3.8, 5.0);
      sunLight.target = rootPositionGroup;
      rimFill.position.set(currentPosX - 5.0, 5.0, 2.5);
      rimFill.target = rootPositionGroup;
      deepBlueFill.position.set(currentPosX - 6.5, -2.5, 3.0);
      deepBlueFill.target = rootPositionGroup;

      // Update sun direction in camera view space for atmospheric shaders
      sunDirectionVec.set(-7.5, 3.8 - currentPosY, 5.0).normalize();
      atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirectionVec);
      diffusedGlowMaterial.uniforms.uSunDirection.value.copy(sunDirectionVec);
      innerRimMaterial.uniforms.uSunDirection.value.copy(sunDirectionVec);
    };

    updatePositionAndScale(width, height);

    const tiltGroup = new THREE.Group();
    // Realistic axial tilt
    tiltGroup.rotation.z = THREE.MathUtils.degToRad(-15);
    tiltGroup.rotation.x = THREE.MathUtils.degToRad(16);
    rootPositionGroup.add(tiltGroup);

    const earthPivot = new THREE.Group();
    tiltGroup.add(earthPivot);

    // Attach atmospheric meshes to earth hierarchy
    earthPivot.add(diffusedGlowMesh);
    earthPivot.add(atmosphereMesh);
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
          <div className="w-12 h-12 rounded-full border-2 border-blue-400/20 border-t-blue-400 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default EarthGlobe;
