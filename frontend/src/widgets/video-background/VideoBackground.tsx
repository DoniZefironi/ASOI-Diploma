'use client';

import { useEffect, useRef } from 'react';

export const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Просто запускаем бесконечное видео
    video.loop = true;
    video.play().catch(error => {
      console.log('Autoplay prevented:', error);
      // Если autoplay заблокирован, можно добавить кнопку воспроизведения
    });
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
        loop
      >
        <source src="/videos/planet.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
    </div>
  );
};