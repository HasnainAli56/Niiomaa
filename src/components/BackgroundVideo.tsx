"use client";

import React, { useRef, useEffect } from "react";

export const BackgroundVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Video autoplay prevented:", err);
        });
      }
    }
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0 bg-[#000B1A]">
      <video
        ref={videoRef}
        src="/upscaled-video.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
};

export default BackgroundVideo;
