"use client";

import React, { useRef, useEffect } from "react";

interface BackgroundVideoProps {
  className?: string;
  loop?: boolean;
  src?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  className = "absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 bg-[#000B1A]",
  loop = true,
  src = "/homepage-bg.mp4",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const playVideo = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Autoplay was prevented or deferred:", err);
        });
      }
    };

    if (video.readyState >= 2) {
      playVideo();
    } else {
      video.addEventListener("canplay", playVideo, { once: true });
      video.addEventListener("loadeddata", playVideo, { once: true });
      playVideo();
    }
  }, [src]);

  return (
    <div className={className}>
      {/* 1. 8K Master Resolution Background Video (Zoomed for cinematic impact) */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop={loop}
        playsInline
        preload="auto"
        className="w-full h-full object-cover object-center scale-[1.15] origin-center will-change-transform"
      >
        <source src={src} type="video/mp4" />
        <source src="/WhatsApp%20Video%202026-09-19%20at%2011.57.40%20AM.mp4" type="video/mp4" />
      </video>

      {/* 2. Glassy Optical Caustics & Liquid Light Refraction Layer */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none"
        style={{ mixBlendMode: "screen" }}
        aria-hidden="true"
      >
        {/* Organic floating liquid glass caustics */}
        <div
          className="absolute -top-[20%] -left-[10%] w-[120%] h-[100%] bg-glass-caustics opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 65% 45% at 50% 35%, rgba(56, 189, 248, 0.18) 0%, rgba(147, 197, 253, 0.1) 35%, rgba(168, 85, 247, 0.06) 60%, transparent 80%)",
          }}
        />

        {/* Secondary crystal refraction ribbon across upper atmosphere */}
        <div
          className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[min(90vw,1300px)] h-[320px] bg-glass-horizon opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 70% 30% at 50% 40%, rgba(224, 242, 254, 0.22) 0%, rgba(56, 189, 248, 0.12) 40%, rgba(0, 11, 26, 0) 75%)",
          }}
        />
      </div>

      {/* 3. Specular Glass Visor Top Sheen & Subtle Edge Refraction */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(56, 189, 248, 0.015) 15%, transparent 40%), radial-gradient(circle at 50% 0%, rgba(186, 230, 253, 0.08) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
};

export default BackgroundVideo;

