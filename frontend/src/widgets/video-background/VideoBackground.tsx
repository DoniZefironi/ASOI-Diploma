'use client';

import { useEffect, useRef, useState } from 'react';

export const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;
    let lastScrollTop = window.scrollY;
    let lastTime = performance.now();
    let currentTime = 0;

    const animate = () => {
      const now = performance.now();
      const deltaTime = Math.min(now - lastTime, 100) / 1000; // ограничиваем deltaTime
      lastTime = now;

      const scrollTop = window.scrollY;
      const scrollDelta = scrollTop - lastScrollTop;
      lastScrollTop = scrollTop;

      if (!isVideoReady || !video.duration || Math.abs(scrollDelta) < 0.1) {
        rafId = requestAnimationFrame(animate);
        return;
      }

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;

      if (maxScroll <= 0) {
        rafId = requestAnimationFrame(animate);
        return;
      }

      // Прямое управление скоростью перемотки на основе скорости скролла
      const scrollSpeed = Math.abs(scrollDelta) / windowHeight;
      const rewindSpeed = 0.05 + scrollSpeed * 0.5; // Настройте множители для нужной скорости
      
      if (scrollDelta > 0) {
        // Скролл вниз - вперед
        currentTime = Math.min(video.duration, currentTime + rewindSpeed);
      } else {
        // Скролл вверх - назад
        currentTime = Math.max(0, currentTime - rewindSpeed);
      }

      video.currentTime = currentTime;
      rafId = requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      // Запускаем анимацию при первом скролле
      if (!rafId) {
        rafId = requestAnimationFrame(animate);
      }
    };

    const handleLoadedData = () => {
      console.log('Video loaded, duration:', video.duration);
      setIsVideoReady(true);
      currentTime = 0;
      video.currentTime = 0;
      
      // Запускаем анимационный цикл сразу
      rafId = requestAnimationFrame(animate);
      window.addEventListener('scroll', handleScroll, { passive: true });
    };

    video.addEventListener('loadeddata', handleLoadedData);

    if (video.readyState >= 2) {
      handleLoadedData();
    }

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isVideoReady]);

  return (
    <div className="fixed inset-0 -z-10">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
      >
        <source src="/videos/planet.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {!isVideoReady && (
        <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded text-sm">
          Loading video...
        </div>
      )}
    </div>
  );
};