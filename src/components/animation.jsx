"use client";

import React, { useEffect, useRef } from "react";

const WIDTH = 624;
const HEIGHT = 352;
const FPS = 24;
const FRAME_COUNT = 114;
const COLS = 10;
const FRAME_MS = 1000 / FPS;

const SPRITE = "/animation_sprite.webp";

export default function ExactAnimation({ className = "", style = {} }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true
    });

    ctx.imageSmoothingEnabled = true;

    const image = new Image();
    image.decoding = "async";
    image.src = SPRITE;

    let animationFrame;
    let startTime = null;
    let stopped = false;

    const draw = (frame) => {
      const col = frame % COLS;
      const row = Math.floor(frame / COLS);

      ctx.drawImage(
        image,
        col * WIDTH,
        row * HEIGHT,
        WIDTH,
        HEIGHT,
        0,
        0,
        WIDTH,
        HEIGHT
      );
    };

    const animate = (time) => {
      if (stopped) return;

      if (startTime === null) {
        startTime = time;
        draw(0);
      }

      const elapsed = time - startTime;
      const frame = Math.floor(
        (elapsed % (FRAME_COUNT * FRAME_MS)) / FRAME_MS
      );

      draw(frame);
      animationFrame = requestAnimationFrame(animate);
    };

    image.onload = () => {
      if (!stopped) {
        draw(0);
        animationFrame = requestAnimationFrame(animate);
      }
    };

    return () => {
      stopped = true;
      cancelAnimationFrame(animationFrame);
      image.onload = null;
      image.src = "";
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={WIDTH}
      height={HEIGHT}
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "auto",
        aspectRatio: `${WIDTH} / ${HEIGHT}`,
        ...style
      }}
    />
  );
}
