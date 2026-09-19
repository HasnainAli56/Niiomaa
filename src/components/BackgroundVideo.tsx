"use client";

import React, { useRef, useEffect, useState } from "react";

interface BackgroundVideoProps {
  className?: string;
  loop?: boolean;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  className = "absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 bg-[#000814]",
  loop = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;

    const onPlay = () => {
      setIsVideoPlaying(true);
    };

    const startPlay = () => {
      video.play().then(() => {
        setIsVideoPlaying(true);
      }).catch(() => {});
    };

    video.addEventListener("playing", onPlay, { once: true });

    if (video.readyState >= 2) {
      startPlay();
    } else {
      video.addEventListener("loadeddata", startPlay, { once: true });
      video.addEventListener("canplay", startPlay, { once: true });
      startPlay();
    }

    return () => {
      video.removeEventListener("playing", onPlay);
    };
  }, []);

  return (
    <div className={className}>
      {/* 0.001s Instant Poster Frame: Renders immediately with HTML parsing */}
      <img
        src="/landing_poster.webp"
        alt="NIIOMA Cosmic Hero"
        fetchPriority="high"
        decoding="sync"
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ${
          isVideoPlaying ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Lightweight faststart video: 1.48MB streamed instantly */}
      <video
        ref={videoRef}
        src="/landing-stream.mp4"
        poster="/landing_poster.webp"
        autoPlay
        muted
        playsInline
        preload="auto"
        loop={loop}
        className="w-full h-full object-cover object-center will-change-transform"
      />
    </div>
  );
};

export default BackgroundVideo;
