'use client';

import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const NotFound = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();
    const color = '#3b82f6'; 

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 20);
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ 
      color: color, 
      wireframe: true,
      transparent: true,
      opacity: 0.3
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

    function createAnimatedCube() {
      const cube = new THREE.Mesh(geometry, material);

      cube.position.x = (Math.random() - 0.5) * 20;
      cube.position.y = (Math.random() - 0.5) * 5;
      cube.position.z = (Math.random() - 0.5) * 30;

      cube.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.001,
          y: (Math.random() - 0.5) * 0.001,
          z: (Math.random() - 0.5) * 0.001
        },
        moveSpeed: {
          x: (Math.random() - 0.5) * 0.005,
          y: (Math.random() - 0.5) * 0.005,
          z: (Math.random() - 0.5) * 0.003
        }
      };
      
      scene.add(cube);
      cubes.push(cube);
    }

    for (let i = 0; i < 45; i++) {
      createAnimatedCube();
    }

    let animationId: number;
    let lastTime = 0;

    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      cubes.forEach(cube => {
        cube.rotation.x += cube.userData.rotationSpeed.x * delta;
        cube.rotation.y += cube.userData.rotationSpeed.y * delta;
        cube.rotation.z += cube.userData.rotationSpeed.z * delta;

        cube.position.x += cube.userData.moveSpeed.x * delta;
        cube.position.y += cube.userData.moveSpeed.y * delta;
        cube.position.z += cube.userData.moveSpeed.z * delta;

        if (Math.abs(cube.position.x) > 12) cube.userData.moveSpeed.x *= -1;
        if (Math.abs(cube.position.y) > 8) cube.userData.moveSpeed.y *= -1;
        if (Math.abs(cube.position.z) > 8) cube.userData.moveSpeed.z *= -1;
      });

      camera.position.x = Math.sin(time * 0.0001) * 1;
      camera.position.y = Math.cos(time * 0.0001) * 1;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 relative overflow-hidden">
      <div 
        ref={containerRef}
        className="absolute inset-0 pointer-events-none"
      />
      
      <div className="text-center max-w-2xl mx-auto animate-fade-in-up relative z-10">
        <div className="mb-8">
          <span className="text-9xl font-bold text-blue-600 animate-bounce inline-block">4</span>
          <span className="text-9xl font-bold text-blue-600 animate-bounce inline-block animate-delay-100">0</span>
          <span className="text-9xl font-bold text-blue-600 animate-bounce inline-block animate-delay-200">4</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Страница не найдена
        </h1>

        <p className="text-xl text-gray-600 mb-10 max-w-md mx-auto">
          Извините, мы не смогли найти страницу, которую вы ищете. Возможно, вы ошиблись в адресе или страница была перемещена.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/">
            <Button variant="primary" className="px-8 py-3 text-lg">
              Вернуться на главную
            </Button>
          </Link>
          
          <Link href="/courses">
            <Button variant="secondary" className="px-8 py-3 text-lg">
              Посмотреть курсы
            </Button>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-white rounded-lg shadow-md animate-fade-in-up animate-delay-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Попробуйте следующее:
          </h3>
          <ul className="text-gray-600 text-left space-y-1">
            <li>• Проверьте правильность URL адреса</li>
            <li>• Воспользуйтесь поиском по сайту</li>
            <li>• Перейдите на главную страницу</li>
            <li>• Свяжитесь с поддержкой</li>
          </ul>
        </div>
      </div>
    </div>
  );
};