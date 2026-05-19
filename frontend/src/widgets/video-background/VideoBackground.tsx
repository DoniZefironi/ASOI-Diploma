'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from '@/shared/lib/theme';
import * as THREE from 'three';

export const VideoBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 20);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: isLight ? '#1d4ed8' : '#3b82f6',
      wireframe: true,
      transparent: true,
      opacity: isLight ? 0.55 : 0.3,
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.pointerEvents = 'none';
    container.appendChild(renderer.domElement);
    camera.position.z = 5;

    const cubes: THREE.Mesh[] = [];

    for (let i = 0; i < 45; i++) {
      const cube = new THREE.Mesh(geometry, material);

      // Сохраняем начальную позицию как "центр" колебания
      const baseX = (Math.random() - 0.5) * 18;
      const baseY = (Math.random() - 0.5) * 8;
      const baseZ = (Math.random() - 0.5) * 10;

      cube.position.set(baseX, baseY, baseZ);

      cube.userData = {
        baseX,
        baseY,
        baseZ,
        // Амплитуда колебания по X (основное движение из стороны в сторону)
        ampX: 2 + Math.random() * 4,
        // Амплитуда по Y (лёгкое вертикальное смещение)
        ampY: 0.5 + Math.random() * 1.5,
        // Частота — у каждого куба своя, чтобы не двигались синхронно
        freqX: 0.0002 + Math.random() * 0.0004,
        freqY: 0.0001 + Math.random() * 0.0003,
        // Фазовый сдвиг — чтобы стартовали в разных точках цикла
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        // Вращение — медленное, непрерывное
        rotX: (Math.random() - 0.5) * 0.0008,
        rotY: (Math.random() - 0.5) * 0.0008,
        rotZ: (Math.random() - 0.5) * 0.0006,
      };

      scene.add(cube);
      cubes.push(cube);
    }

    let animationId: number;

    const animate = (time: number) => {
      cubes.forEach(c => {
        const d = c.userData;

        // Непрерывное синусоидальное движение из стороны в сторону
        c.position.x = d.baseX + Math.sin(time * d.freqX + d.phaseX) * d.ampX;
        c.position.y = d.baseY + Math.cos(time * d.freqY + d.phaseY) * d.ampY;

        // Непрерывное вращение
        c.rotation.x += d.rotX;
        c.rotation.y += d.rotY;
        c.rotation.z += d.rotZ;
      });

      camera.position.x = Math.sin(time * 0.00008) * 0.8;
      camera.position.y = Math.cos(time * 0.00008) * 0.8;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!containerRef.current) return;
      const { width: w, height: h } = containerRef.current.getBoundingClientRect();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [isLight]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--color-canvas-default)',
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
};
