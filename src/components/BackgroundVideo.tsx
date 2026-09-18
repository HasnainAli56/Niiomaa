"use client";

import React, { useRef, useEffect } from "react";

interface BackgroundVideoProps {
  className?: string;
  loop?: boolean;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  className = "absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 bg-[#000814]",
  loop = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;

    const startPlay = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    if (video.readyState >= 2) {
      startPlay();
    } else {
      video.addEventListener("loadeddata", startPlay, { once: true });
      video.addEventListener("canplay", startPlay, { once: true });
      startPlay();
    }
  }, []);

  return (
    <div className={className}>
      <video
        ref={videoRef}
        src="/upscaled-video.mp4"
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
