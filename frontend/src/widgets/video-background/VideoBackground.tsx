'use client';

import { useEffect, useRef, useState } from 'react';

export const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    
    if (!video || !section) return;

    const handleScroll = () => {
      const sectionRect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const isSectionVisible = (
        sectionRect.top < windowHeight && 
        sectionRect.bottom > 0
      );
      
      setIsVisible(isSectionVisible);

      if (isSectionVisible) {
        const scrollProgress = Math.max(0, Math.min(1, 
          (-sectionRect.top) / (sectionRect.height - windowHeight)
        ));

        if (video.duration) {
          video.currentTime = video.duration * scrollProgress;
        }
      }
    };

    const handleLoadedMetadata = () => {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); 
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        preload="metadata"
      >
        <source src="C:\Users\vladn\Downloads\Telegram Desktop\3129957-uhd_3840_2160_25fps.mp4" type="video/mp4" />
        <source src="/videos/background.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Unlock Your Potential with <span className="text-blue-400">EduTech</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto">
          Explore a wide range of courses in computer science, electronics, English, and IoT.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300">
          Get Started
        </button>
      </div>
    </section>
  );
};