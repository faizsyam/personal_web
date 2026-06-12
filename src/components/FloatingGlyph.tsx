import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * A subtle, floating 3D wireframe icosahedron that sits as an overlay
 * in the hero section. It rotates gently and responds to mouse proximity
 * without interfering with the 2D canvas grid background.
 */
export default function FloatingGlyph() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ─── Scene
    const scene = new THREE.Scene();
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // ─── Wireframe icosahedron
    const geometry = new THREE.IcosahedronGeometry(1.2, 1);
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#1B3E74'),
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ─── Inner sphere (subtle fill)
    const fillGeometry = new THREE.IcosahedronGeometry(0.9, 0);
    const fillMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#2B4C7E'),
      transparent: true,
      opacity: 0.03,
    });
    const fillMesh = new THREE.Mesh(fillGeometry, fillMaterial);
    scene.add(fillMesh);

    // ─── Mouse
    let mouseX = 0;
    let mouseY = 0;
    let targetRotateX = 0;
    let targetRotateY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // ─── Animation
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow ambient rotation
      mesh.rotation.y = elapsed * 0.3;
      mesh.rotation.x = Math.sin(elapsed * 0.2) * 0.3;
      fillMesh.rotation.y = elapsed * 0.3;
      fillMesh.rotation.x = Math.sin(elapsed * 0.2) * 0.3;

      // Mouse proximity response (gentle tilt)
      targetRotateX = mouseY * 0.1;
      targetRotateY = mouseX * 0.1;

      mesh.rotation.x += (targetRotateX - mesh.rotation.x) * 0.05;
      mesh.rotation.y += (targetRotateY - mesh.rotation.y) * 0.05;
      fillMesh.rotation.x = mesh.rotation.x;
      fillMesh.rotation.y = mesh.rotation.y;

      renderer.render(scene, camera);
    };

    if (!prefersReducedMotion) {
      animate();
    } else {
      renderer.render(scene, camera);
    }

    // ─── Resize
    const handleResize = () => {
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 300;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // ─── Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      fillGeometry.dispose();
      fillMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 right-0 w-[300px] h-[300px] pointer-events-none hidden lg:block"
      aria-hidden="true"
    />
  );
}
