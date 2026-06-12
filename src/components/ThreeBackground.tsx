import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ─── Scene ───────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // ─── Blueprint Grid (wireframe plane) ──────
    const gridSize = 20;
    const gridSegments = 40;
    const gridGeometry = new THREE.PlaneGeometry(gridSize, gridSize, gridSegments, gridSegments);
    const gridMaterial = new THREE.ShaderMaterial({
      transparent: true,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uOpacity;

        float gridLine(vec2 coord, float width) {
          vec2 grid = abs(fract(coord - 0.5) - 0.5);
          vec2 line = step(width, grid);
          return 1.0 - min(line.x * line.y, 1.0);
        }

        void main() {
          vec2 mouseDist = vUv - uMouse;
          float dist = length(mouseDist);
          float ripple = sin(dist * 20.0 - uTime * 2.0) * 0.02 / (dist + 0.3);
          vec2 gridCoord = vUv * 20.0 + ripple;
          float g = gridLine(gridCoord, 0.03);
          float edgeFade = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x)
                          * smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
          vec3 color = vec3(0.07, 0.07, 0.065);
          float alpha = g * 0.06 * edgeFade * uOpacity;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uOpacity: { value: 1 },
      },
    });

    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    gridMesh.rotation.x = -Math.PI * 0.35;
    gridMesh.position.y = -1.5;
    scene.add(gridMesh);

    // ─── Floating Particles ────────────────────
    const particleCount = 120;
    const particles: Particle[] = [];
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 12,
        y: (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 0.002,
        vy: (Math.random() - 0.5) * 0.002,
        life: Math.random() * Math.PI * 2,
        maxLife: Math.PI * 2,
        size: Math.random() * 2 + 1,
      });
      positions[i * 3] = particles[i].x;
      positions[i * 3 + 1] = particles[i].y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      sizes[i] = particles[i].size;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float size;
        varying float vAlpha;
        void main() {
          vAlpha = 0.3 + 0.7 * size / 3.0;
          gl_PointSize = size * (300.0 / -modelViewMatrix[3][2]);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, d) * vAlpha * 0.4;
          gl_FragColor = vec4(0.11, 0.24, 0.45, alpha);
        }
      `,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // ─── Mouse interaction ───────────────────────
    const mouse = { x: 0.5, y: 0.5 };
    const targetMouse = { x: 0.5, y: 0.5 };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.x = e.clientX / window.innerWidth;
      targetMouse.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // ─── Animation loop ──────────────────────────
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      gridMaterial.uniforms.uTime.value = elapsed;
      gridMaterial.uniforms.uMouse.value.set(mouse.x, mouse.y);

      const posArray = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        const dx = p.x - (mouse.x - 0.5) * 10;
        const dy = p.y - (mouse.y - 0.5) * 8;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 3 && dist > 0) {
          const force = (3 - dist) * 0.001;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }
        if (p.x > 6) p.x = -6;
        if (p.x < -6) p.x = 6;
        if (p.y > 4) p.y = -4;
        if (p.y < -4) p.y = 4;

        posArray[i * 3] = p.x + Math.sin(elapsed * 0.8 + i * 0.5) * 0.1;
        posArray[i * 3 + 1] = p.y + Math.cos(elapsed * 0.6 + i * 0.3) * 0.1;
        posArray[i * 3 + 2] = Math.sin(elapsed + i) * 0.5;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    // Reduced motion: render static frame only
    if (prefersReducedMotion) {
      renderer.render(scene, camera);
    } else {
      animate();
    }

    // ─── Resize ─────────────────────────────────
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // ─── Cleanup ─────────────────────────────────
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      gridGeometry.dispose();
      gridMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none -z-10"
      style={{ opacity: 0.35 }}
    />
  );
}
