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

    // Outer Atmospheric Limb Shader (Sphere radius ~1.019)
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
        
        float s = clamp(vDotN / 0.192, 0.0, 1.0);
        float falloff = pow(s, 2.2);

        float sunDot = dot(vViewNormal, uSunDirection);
        float sunFactor = smoothstep(-0.16, 0.38, sunDot);
        if (sunFactor <= 0.001) discard;

        float n1 = sin(vObjectPosition.x * 14.0 + vObjectPosition.y * 9.0);
        float n2 = sin(vObjectPosition.y * 28.0 - vObjectPosition.z * 18.0);
        float irregularity = 1.0 + 0.08 * (0.6 * n1 + 0.4 * n2);

        vec3 cPaleBlue = vec3(0.490, 0.718, 1.000);
        vec3 cBlueWhite = vec3(0.725, 0.851, 1.000);
        vec3 cSpaceTransition = vec3(0.120, 0.280, 0.600);

        float apexHighlight = pow(clamp(sunDot, 0.0, 1.0), 2.2) * pow(s, 1.6);
        vec3 limbColor = mix(cPaleBlue, cBlueWhite, clamp(apexHighlight * 0.75, 0.0, 1.0));
        vec3 finalColor = mix(cSpaceTransition, limbColor, smoothstep(0.0, 0.45, s));

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

    const atmosphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.019, 64, 64),
      atmosphereMaterial
    );
    atmosphereMesh.renderOrder = 2;

    // Diffused Outer Rayleigh Glow
    const diffusedGlowFrag = `
      uniform vec3 uSunDirection;

      varying vec3 vViewNormal;
      varying vec3 vViewPosition;

      void main() {
        vec3 viewDir = normalize(-vViewPosition);
        float vDotN = -dot(vViewNormal, viewDir);
        if (vDotN <= 0.0) discard;
        
        float s = clamp(vDotN / 0.28, 0.0, 1.0);
        float falloff = pow(s, 1.4);

        float sunDot = dot(vViewNormal, uSunDirection);
        float sunFactor = smoothstep(-0.20, 0.42, sunDot);
        if (sunFactor <= 0.001) discard;

        vec3 cPaleBlue = vec3(0.490, 0.718, 1.000);
        vec3 cSpaceVoid = vec3(0.060, 0.180, 0.450);
        vec3 glowCol = mix(cSpaceVoid, cPaleBlue, s);

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

    // Inner Surface Rayleigh Haze
    const innerRimFrag = `
      uniform vec3 uSunDirection;

      varying vec3 vViewNormal;
      varying vec3 vViewPosition;
      varying vec3 vObjectPosition;

      void main() {
        vec3 viewDir = normalize(-vViewPosition);
        
        float vDotN = max(0.0, dot(vViewNormal, viewDir));
        float fresnel = 1.0 - vDotN;
        float grazingHaze = pow(fresnel, 4.2);

        float sunDot = dot(vViewNormal, uSunDirection);
        float sunFactor = smoothstep(-0.12, 0.35, sunDot);
        if (sunFactor <= 0.001 || grazingHaze <= 0.001) discard;

        float n = sin(vObjectPosition.x * 14.0 + vObjectPosition.y * 9.0) * 0.06;
        float irregularity = 1.0 + n;

        vec3 cPaleBlue = vec3(0.490, 0.718, 1.000);
        vec3 cBlueWhite = vec3(0.725, 0.851, 1.000);
        float highlight = pow(clamp(sunDot, 0.0, 1.0), 2.0) * pow(fresnel, 2.2);
        vec3 innerCol = mix(cPaleBlue, cBlueWhite, highlight * 0.55);

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

    // ─── HOVER SYSTEM ────────────────────────────────────────────────────────────
    // Shared uniforms updated per-frame from raycasting result
    const hoverUniforms = {
      uHoverDir:    { value: new THREE.Vector3(0, 0, 1) },
      uGlobeCenter: { value: new THREE.Vector3(0, 0, 0) },
      uHoverActive: { value: 0.0 },
    };

    // Back-side blue glow sphere — glows blue on entire back hemisphere on hover
    const backHoverFrag = `
      uniform float uHoverActive;

      varying vec3 vViewNormal;
      varying vec3 vViewPosition;

      void main() {
        vec3 viewDir = normalize(-vViewPosition);
        // Back-facing means dot is negative → we want -dot > 0
        float backFresnel = -dot(vViewNormal, viewDir);
        if (backFresnel <= 0.0) discard;

        float s = clamp(backFresnel / 0.40, 0.0, 1.0);
        float falloff = pow(s, 1.6);

        // Bright electric blue
        vec3 blueCore  = vec3(0.10, 0.45, 1.00);
        vec3 blueDeep  = vec3(0.05, 0.20, 0.85);
        vec3 glowColor = mix(blueDeep, blueCore, s);

        float alpha = falloff * uHoverActive * 0.75;
        gl_FragColor = vec4(glowColor * alpha, alpha);
      }
    `;

    const backHoverMaterial = new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: backHoverFrag,
      uniforms: {
        uHoverActive: hoverUniforms.uHoverActive,
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      depthTest: true,
    });

    const backHoverMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.008, 64, 64),
      backHoverMaterial
    );
    backHoverMesh.renderOrder = 5;

    // Invisible sphere for raycasting (same radius as earth surface in local space)
    const raycastSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.0, 32, 32),
      new THREE.MeshBasicMaterial({ visible: false, side: THREE.FrontSide })
    );
    // ─────────────────────────────────────────────────────────────────────────────

    const updatePositionAndScale = (w: number, h: number) => {
      const currentAspect = w / h;
      camera.aspect = currentAspect;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      const singleWidth = window.innerWidth;
      const singleAspect = singleWidth / h;

      const totalWorldWidth = 2 * 14.0 * Math.tan(THREE.MathUtils.degToRad(8)) * currentAspect;
      const singleWorldWidth = 2 * 14.0 * Math.tan(THREE.MathUtils.degToRad(8)) * singleAspect;

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

      sunLight.position.set(currentPosX - 7.5, 3.8, 5.0);
      sunLight.target = rootPositionGroup;
      rimFill.position.set(currentPosX - 5.0, 5.0, 2.5);
      rimFill.target = rootPositionGroup;
      deepBlueFill.position.set(currentPosX - 6.5, -2.5, 3.0);
      deepBlueFill.target = rootPositionGroup;

      sunDirectionVec.set(-7.5, 3.8 - currentPosY, 5.0).normalize();
      atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirectionVec);
      diffusedGlowMaterial.uniforms.uSunDirection.value.copy(sunDirectionVec);
      innerRimMaterial.uniforms.uSunDirection.value.copy(sunDirectionVec);
    };

    updatePositionAndScale(width, height);

    const tiltGroup = new THREE.Group();
    tiltGroup.rotation.z = THREE.MathUtils.degToRad(-15);
    tiltGroup.rotation.x = THREE.MathUtils.degToRad(16);
    rootPositionGroup.add(tiltGroup);

    const earthPivot = new THREE.Group();
    tiltGroup.add(earthPivot);

    // Attach atmospheric meshes
    earthPivot.add(diffusedGlowMesh);
    earthPivot.add(atmosphereMesh);
    earthPivot.add(innerRimMesh);
    // Hover effect meshes
    earthPivot.add(backHoverMesh);
    earthPivot.add(raycastSphere);

    // 6. Load GLTF Model via Preloaded Cache
    preloadEarthModel()
      .then((preloadedGroup) => {
        if (!mountRef.current) return;
        const clone = preloadedGroup.clone(true);

        // ── Inject hover-pink shader into each land mesh ─────────────────────────
        clone.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const mats = Array.isArray(mesh.material)
              ? mesh.material
              : [mesh.material];

            mats.forEach((mat) => {
              if (mat && "roughness" in mat) {
                const m = mat as THREE.MeshStandardMaterial;

                m.onBeforeCompile = (shader) => {
                  // Inject shared hover uniforms
                  shader.uniforms.uHoverDir    = hoverUniforms.uHoverDir;
                  shader.uniforms.uGlobeCenter = hoverUniforms.uGlobeCenter;
                  shader.uniforms.uHoverActive = hoverUniforms.uHoverActive;

                  // Add varying for world-space position in vertex shader
                  shader.vertexShader = shader.vertexShader.replace(
                    "#include <common>",
                    `#include <common>
                    varying vec3 vWorldPos;`
                  );
                  shader.vertexShader = shader.vertexShader.replace(
                    "#include <worldpos_vertex>",
                    `#include <worldpos_vertex>
                    vWorldPos = worldPosition.xyz;`
                  );

                  // Declare uniforms + varying in fragment shader
                  shader.fragmentShader = shader.fragmentShader.replace(
                    "#include <common>",
                    `#include <common>
                    uniform vec3  uHoverDir;
                    uniform vec3  uGlobeCenter;
                    uniform float uHoverActive;
                    varying vec3  vWorldPos;`
                  );

                  // Inject at the very end — after all lighting/tonemapping
                  shader.fragmentShader = shader.fragmentShader.replace(
                    "#include <dithering_fragment>",
                    `#include <dithering_fragment>

                    // ── Hover: pink land, blue back ──────────────────────────
                    if (uHoverActive > 0.001) {
                      // Direction from globe center to this fragment (world-space)
                      vec3 fragDir = normalize(vWorldPos - uGlobeCenter);

                      // Angular distance to hover point
                      float dotP    = dot(fragDir, uHoverDir);
                      float angDist = acos(clamp(dotP, -1.0, 1.0));

                      // Hover mask: smooth circle around cursor on sphere
                      float hoverMask = smoothstep(0.58, 0.0, angDist) * uHoverActive;

                      // Land detection: post-tonemapping, land has more R than B
                      // Ocean is blue (B > R); land is yellow/brown (R > B)
                      float isLand = smoothstep(0.0, 0.18, gl_FragColor.r - gl_FragColor.b);

                      // Pink color
                      vec3 pinkColor = vec3(1.0, 0.18, 0.55);
                      gl_FragColor.rgb = mix(
                        gl_FragColor.rgb,
                        pinkColor,
                        hoverMask * isLand * 0.82
                      );
                    }`
                  );
                };

                // Force recompile with new onBeforeCompile
                m.needsUpdate = true;
              }
            });
          }
        });
        // ─────────────────────────────────────────────────────────────────────────

        earthPivot.add(clone);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading earth.glb:", error);
        setIsLoading(false);
      });

    // 7. Interactive dragging + hover raycasting
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let velocityX = 0;
    let velocityY = 0;

    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2();
    const globeCenter = new THREE.Vector3();

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
      velocityX = 0;
      velocityY = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        earthPivot.rotation.y += deltaX * 0.003;
        tiltGroup.rotation.x += deltaY * 0.002;
        tiltGroup.rotation.x = Math.max(-0.4, Math.min(0.5, tiltGroup.rotation.x));

        velocityX = deltaX * 0.003;
        velocityY = deltaY * 0.002;

        previousMousePosition = { x: e.clientX, y: e.clientY };
        return;
      }

      // ── Hover raycasting ──────────────────────────────────────────────────────
      const rect = renderer.domElement.getBoundingClientRect();
      mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseNDC, camera);
      const hits = raycaster.intersectObject(raycastSphere, false);

      if (hits.length > 0) {
        // World position of globe center
        rootPositionGroup.getWorldPosition(globeCenter);
        hoverUniforms.uGlobeCenter.value.copy(globeCenter);

        // Normalized direction from globe center → hit point
        const hitWorld = hits[0].point;
        hoverUniforms.uHoverDir.value
          .copy(hitWorld)
          .sub(globeCenter)
          .normalize();

        // Smooth fade in
        hoverUniforms.uHoverActive.value = Math.min(
          1.0,
          hoverUniforms.uHoverActive.value + 0.12
        );
      } else {
        // Smooth fade out
        hoverUniforms.uHoverActive.value = Math.max(
          0.0,
          hoverUniforms.uHoverActive.value - 0.08
        );
      }
      // ─────────────────────────────────────────────────────────────────────────
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onPointerLeave = () => {
      // Fade out hover when mouse leaves canvas
      hoverUniforms.uHoverActive.value = 0.0;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("pointerdown", onPointerDown);
    domElement.addEventListener("pointerleave", onPointerLeave);
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
      domElement.removeEventListener("pointerleave", onPointerLeave);
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
