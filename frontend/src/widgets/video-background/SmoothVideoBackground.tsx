'use client';

import { useEffect, useRef, useState } from 'react';

export const SmoothVideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const requestRef = useRef<number>();
  const previousScrollRef = useRef<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isScrolling: NodeJS.Timeout;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      // Очищаем предыдущий таймер
      clearTimeout(isScrolling);

      // Определяем направление скролла
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      lastScrollY = currentScrollY;

      // Запускаем анимацию
      const animateVideo = () => {
        if (!video.duration) return;

        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Прогресс скролла по всей странице (0 до 1)
        const scrollProgress = scrollTop / (documentHeight - windowHeight);
        
        // Плавное изменение времени видео
        const targetTime = video.duration * scrollProgress;
        const currentTime = video.currentTime;
        
        // Плавный переход к целевому времени
        const diff = targetTime - currentTime;
        video.currentTime += diff * 0.1; // Коэффициент плавности

        if (Math.abs(diff) > 0.01) {
          requestRef.current = requestAnimationFrame(animateVideo);
        }
      };

      // Запускаем анимацию только при активном скролле
      isScrolling = setTimeout(() => {
        cancelAnimationFrame(requestRef.current!);
      }, 100);

      requestRef.current = requestAnimationFrame(animateVideo);
    };

    // Оптимизированный слушатель скролла
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(isScrolling);
      cancelAnimationFrame(requestRef.current!);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        loop
        preload="auto"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
        <source src="/videos/background.webm" type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
    </div>
  );
};