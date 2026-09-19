"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface CelestialEclipseHeroProps {
  className?: string;
}

export const CelestialEclipseHero: React.FC<CelestialEclipseHeroProps> = ({
  className = "absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 bg-[#000714]",
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 9.5);

    // 3. Renderer with native 4K/Retina support
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Group for mouse parallax
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 4. Create procedural circular particle texture
    const createParticleTexture = () => {
      const size = 64;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.2, "rgba(165, 243, 252, 0.9)");
      grad.addColorStop(0.5, "rgba(59, 130, 246, 0.35)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    // 5. Create procedural anamorphic lens flare texture
    const createFlareTexture = () => {
      const size = 256;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;

      // Center bright core
      const coreGrad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size * 0.45);
      coreGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
      coreGrad.addColorStop(0.12, "rgba(224, 242, 254, 0.95)");
      coreGrad.addColorStop(0.35, "rgba(56, 189, 248, 0.5)");
      coreGrad.addColorStop(0.65, "rgba(59, 130, 246, 0.15)");
      coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = coreGrad;
      ctx.fillRect(0, 0, size, size);

      // Horizontal anamorphic streak
      const streakGrad = ctx.createLinearGradient(0, size / 2, size, size / 2);
      streakGrad.addColorStop(0, "rgba(56, 189, 248, 0)");
      streakGrad.addColorStop(0.3, "rgba(165, 243, 252, 0.35)");
      streakGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.9)");
      streakGrad.addColorStop(0.7, "rgba(165, 243, 252, 0.35)");
      streakGrad.addColorStop(1, "rgba(56, 189, 248, 0)");

      ctx.fillStyle = streakGrad;
      ctx.fillRect(0, size / 2 - 4, size, 8);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const particleTexture = createParticleTexture();
    const flareTexture = createFlareTexture();

    // 6. Stars & Cosmic Dust (3D Points)
    const starCount = 180;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starScales = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 22;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
      starScales[i] = Math.random() * 0.18 + 0.06;
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("scale", new THREE.BufferAttribute(starScales, 1));

    const starMat = new THREE.PointsMaterial({
      size: 0.18,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85,
    });

    const starField = new THREE.Points(starGeo, starMat);
    masterGroup.add(starField);

    // 7. Celestial Eclipse Body (Dark Sphere with Atmospheric Rim Shader)
    const sphereRadius = 2.45;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, 64, 64);

    // Custom atmospheric rim lighting shader
    const atmosphereMat = new THREE.ShaderMaterial({
      uniforms: {
        flarePos: { value: new THREE.Vector3(0, 0, 0) },
        time: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 flarePos;
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vWorldPos;

        void main() {
          vec3 viewDir = normalize(-vWorldPos);
          float fresnel = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
          fresnel = pow(fresnel, 2.8);

          // Distance to rotating flare in 3D
          float distToFlare = distance(vWorldPos, flarePos);
          float flareInfluence = exp(-distToFlare * 1.6) * 1.8;

          // Rim colors: electric cyan to royal blue to subtle violet
          vec3 rimBase = vec3(0.05, 0.35, 0.95);
          vec3 rimFlare = vec3(0.3, 0.85, 1.0) * flareInfluence;
          vec3 finalRim = (rimBase * fresnel * 1.5) + (rimFlare * pow(fresnel, 1.5));

          // Dark inner core of eclipse body
          vec3 bodyColor = vec3(0.002, 0.008, 0.025);
          vec3 color = mix(bodyColor, finalRim, fresnel);

          gl_FragColor = vec4(color, 1.0);
        }
      `,
      transparent: false,
    });

    const sphereMesh = new THREE.Mesh(sphereGeo, atmosphereMat);
    sphereMesh.position.set(0, 0.25, 0);
    masterGroup.add(sphereMesh);

    // 8. Outer Celestial Arc (High-definition glowing ring)
    const outerRingRadius = 3.65;
    const ringGeo = new THREE.TorusGeometry(outerRingRadius, 0.024, 32, 200, Math.PI * 1.15);
    const ringMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        flarePos: { value: new THREE.Vector3(0, 0, 0) },
      },
      vertexShader: `
        varying vec3 vWorldPos;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 flarePos;
        varying vec3 vWorldPos;
        varying vec2 vUv;

        void main() {
          float dist = distance(vWorldPos, flarePos);
          float flareBoost = exp(-dist * 1.2) * 2.2;

          // Gradient along the arc: pink/violet at edges to pure electric cyan in center
          float t = abs(vUv.x - 0.5) * 2.0;
          vec3 centerColor = vec3(0.2, 0.85, 1.0);
          vec3 edgeColor = vec3(0.85, 0.25, 0.95);
          vec3 arcColor = mix(centerColor, edgeColor, pow(t, 2.0));

          vec3 finalColor = arcColor * (1.2 + flareBoost);
          gl_FragColor = vec4(finalColor, 0.92);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    const outerRingMesh = new THREE.Mesh(ringGeo, ringMat);
    outerRingMesh.rotation.z = Math.PI * -0.075;
    outerRingMesh.position.set(0, 0.25, 0.15);
    masterGroup.add(outerRingMesh);

    // 9. Secondary Luminous Corona Glow around the Eclipse
    const coronaGeo = new THREE.RingGeometry(sphereRadius * 0.98, sphereRadius * 1.55, 64);
    const coronaMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        flarePos: { value: new THREE.Vector3(0, 0, 0) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPos;
        void main() {
          vUv = uv;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 flarePos;
        varying vec2 vUv;
        varying vec3 vWorldPos;

        void main() {
          float r = length(vUv - vec2(0.5));
          float alpha = smoothstep(0.5, 0.35, r);

          float dist = distance(vWorldPos, flarePos);
          float flareGlow = exp(-dist * 1.4) * 2.5;

          vec3 glowColor = vec3(0.1, 0.45, 1.0) * (0.35 + flareGlow);
          gl_FragColor = vec4(glowColor, alpha * 0.65);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    coronaMesh.position.set(0, 0.25, -0.05);
    masterGroup.add(coronaMesh);

    // 10. The Rotating Solar Flare / Corona Ejection (Sprite & Billboard Flare)
    const flareMat = new THREE.SpriteMaterial({
      map: flareTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffffff,
    });
    const flareSprite = new THREE.Sprite(flareMat);
    flareSprite.scale.set(1.8, 1.8, 1.8);
    masterGroup.add(flareSprite);

    // Hot center core sprite
    const coreSpriteMat = new THREE.SpriteMaterial({
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffffff,
    });
    const coreSprite = new THREE.Sprite(coreSpriteMat);
    coreSprite.scale.set(0.65, 0.65, 0.65);
    masterGroup.add(coreSprite);

    // 11. Mouse tracking with smooth interpolation
    let targetMouseX = 0;
    let targetMouseY = 0;
    let curMouseX = 0;
    let curMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.45;
      targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 0.35;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // 12. Resize handler
    const onResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
    };

    window.addEventListener("resize", onResize);

    // 13. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      curMouseX += (targetMouseX - curMouseX) * 0.05;
      curMouseY += (targetMouseY - curMouseY) * 0.08;
      masterGroup.rotation.y = curMouseX;
      masterGroup.rotation.x = -curMouseY;

      // Rotate flare along the sphere's crescent edge
      // Flare follows an arc path across the upper quadrant of the sphere
      const orbitSpeed = 0.55;
      const angle = (elapsedTime * orbitSpeed) % (Math.PI * 2);

      // Arc parameters: sweeps smoothly along top contour
      const flareRadius = sphereRadius + 0.02;
      const fx = Math.cos(angle) * flareRadius * 0.98;
      const fy = Math.sin(angle) * flareRadius * 0.72 + 0.25;
      const fz = Math.sin(angle * 2) * 0.35 + 0.1;

      flareSprite.position.set(fx, fy, fz);
      coreSprite.position.set(fx, fy, fz + 0.02);

      // Dynamic breathing scale of the flare
      const flareScale = 1.6 + Math.sin(elapsedTime * 4.0) * 0.2;
      flareSprite.scale.set(flareScale * 1.2, flareScale * 0.9, 1);

      // Update shader uniforms
      const fPos = new THREE.Vector3(fx, fy, fz);
      atmosphereMat.uniforms.flarePos.value.copy(fPos);
      atmosphereMat.uniforms.time.value = elapsedTime;
      ringMat.uniforms.flarePos.value.copy(fPos);
      ringMat.uniforms.time.value = elapsedTime;
      coronaMat.uniforms.flarePos.value.copy(fPos);
      coronaMat.uniforms.time.value = elapsedTime;

      // Slowly drift starfield
      starField.rotation.y = elapsedTime * 0.012;
      starField.rotation.x = elapsedTime * 0.008;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starGeo.dispose();
      starMat.dispose();
      sphereGeo.dispose();
      atmosphereMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      coronaGeo.dispose();
      coronaMat.dispose();
      particleTexture.dispose();
      flareTexture.dispose();
    };
  }, []);

  return (
    <div className={className}>
      {/* Deep Space Background gradient */}
      <div className="absolute inset-0 bg-[#000714] bg-[radial-gradient(ellipse_90%_70%_at_50%_30%,rgba(13,27,62,0.6)_0%,#000714_100%)]" />

      {/* Top Corner Coronal Flares (Magenta-Violet ambient bloom matching design reference) */}
      <div
        className="absolute -top-16 -left-16 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.35)_0%,rgba(147,51,234,0.18)_45%,transparent_70%)] blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: "6s" }}
      />
      <div
        className="absolute -top-16 -right-16 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(217,70,239,0.35)_0%,rgba(147,51,234,0.18)_45%,transparent_70%)] blur-3xl pointer-events-none animate-pulse"
        style={{ animationDuration: "6s", animationDelay: "2s" }}
      />

      {/* High-Resolution Three.js WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

      {/* Bottom fade into deep space #000B1A */}
      <div className="absolute bottom-0 left-0 right-0 h-[28vh] bg-gradient-to-t from-[#000B1A] via-[#000B1A]/80 to-transparent pointer-events-none z-20" />
    </div>
  );
};

export default CelestialEclipseHero;
