import { useEffect, useRef } from 'react';

interface ClickRipple {
  x: number; // Document X
  y: number; // Document Y
  radius: number;
  maxRadius: number;
  life: number;
  maxLife: number;
  amplitude: number; // wave power displacement
}

/**
 * Smart helper to determine if an element is a content element,
 * interactive control, or container holding meaningful text/media.
 */
function checkIsHoveringOverContent(el: Element | null): boolean {
  if (!el) return false;

  const tagName = el.tagName.toUpperCase();
  if (tagName === 'HTML' || tagName === 'BODY' || el.id === 'root') {
    return false;
  }

  // Direct text/media content and input controls
  const isDirectContentTag = [
    'A', 'BUTTON', 'SPAN', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
    'LI', 'LABEL', 'INPUT', 'TEXTAREA', 'IMG', 'SVG', 'PATH', 'CODE',
    'PRE', 'TABLE', 'TR', 'TD', 'TH', 'STRONG', 'EM', 'I', 'B'
  ].includes(tagName);

  if (isDirectContentTag) {
    return true;
  }

  // Check if it has direct non-whitespace text nodes
  for (let i = 0; i < el.childNodes.length; i++) {
    const node = el.childNodes[i];
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue?.trim()) {
      return true;
    }
  }

  // Inspect ascending hierarchy for interactive layers, cards, navigation, and modals
  let current: Element | null = el;
  while (current && current !== document.body && current.id !== 'root') {
    const cls = current.className || '';
    if (typeof cls === 'string' && (
      cls.includes('card') ||
      cls.includes('badge') ||
      cls.includes('btn') ||
      cls.includes('button') ||
      cls.includes('nav') ||
      cls.includes('modal') ||
      cls.includes('shadow-') ||
      cls.includes('border') ||
      current.getAttribute('role') === 'button'
    )) {
      return true;
    }
    // Handle inline link parent wrappers
    const parentTag = current.parentElement?.tagName.toUpperCase() || '';
    if (parentTag === 'A' || parentTag === 'BUTTON') {
      return true;
    }
    current = current.parentElement;
  }

  return false;
}

export default function InteractiveGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Use ref for dark mode to avoid re-renders
  const isDarkRef = useRef(false);

  // Mouse position tracking
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const lerpMouseRef = useRef({ x: -1000, y: -1000 });

  // Dynamic warp power transition state
  const warpStrengthRef = useRef(0);

  // Smart hover state
  const isHoveringOverContentRef = useRef(false);

  // Click Ripples state
  const ripplesRef = useRef<ClickRipple[]>([]);

  // Track scroll position to calculate document-space coordinates
  const scrollRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // 1. Detect dark mode state and update dynamically via ref (NOT state)
    const checkDark = () => {
      isDarkRef.current = document.documentElement.classList.contains('dark');
    };

    checkDark();

    const observer = new MutationObserver(() => {
      checkDark();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // 2. Track scroll
    const handleScroll = () => {
      scrollRef.current.x = window.scrollX;
      scrollRef.current.y = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 3. Track Mouse Position
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    // Spawn clickable ripple waves upon click
    const handleMouseClick = (e: MouseEvent) => {
      const docMouseX = e.clientX + scrollRef.current.x;
      const docMouseY = e.clientY + scrollRef.current.y;

      const gridX = Math.round(docMouseX / 40) * 40;
      const gridY = Math.round(docMouseY / 40) * 40;

      // Add physical grid wave ripple which bends coordinates outward
      ripplesRef.current.push({
        x: gridX,
        y: gridY,
        radius: 0,
        maxRadius: 360,
        life: 75,
        maxLife: 75,
        amplitude: 25 // max physical line displacement in pixels
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('click', handleMouseClick, { passive: true });

    // 4. Setup Canvas & Context
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let frameCount = 0;

    // Resize function
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();

    /**
     * Applies a 3D Convex Lens Distortion (Bulging Warp) from hover
     * and dynamic wave propagation distortion from click grid ripples.
     */
    const warpPoint = (x: number, y: number, mx: number, my: number, radius: number, strength: number) => {
      let currentX = x;
      let currentY = y;

      const dX = scrollRef.current.x;
      const dY = scrollRef.current.y;

      // 1. Mouse hover convex warp
      if (mx > -500 && strength > 0) {
        const dx = currentX - mx;
        const dy = currentY - my;
        const distSq = dx * dx + dy * dy;
        const radiusSq = radius * radius;

        if (distSq < radiusSq) {
          const dist = Math.sqrt(distSq);
          if (dist > 0) {
            const t = 1 - dist / radius;
            const shift = strength * Math.sin(t * Math.PI);
            currentX += (dx / dist) * shift;
            currentY += (dy / dist) * shift;
          }
        }
      }

      // 2. Click wave ripple physical distortion
      const activeRipples = ripplesRef.current;
      for (let r = 0; r < activeRipples.length; r++) {
        const rip = activeRipples[r];
        // Convert ripple's document coordinates to screen coordinates
        const rx = rip.x - dX;
        const ry = rip.y - dY;

        const dx = currentX - rx;
        const dy = currentY - ry;
        const distSq = dx * dx + dy * dy;
        const dist = Math.sqrt(distSq);

        if (dist > 0) {
          const waveWidth = 55; // width of the ripple wavefront
          const distFromWaveFront = Math.abs(dist - rip.radius);
          if (distFromWaveFront < waveWidth) {
            const t = distFromWaveFront / waveWidth; // 0 at center of wavefront, 1 at edge
            const ageFactor = rip.life / rip.maxLife;
            // Cosine wave for smooth wave peak transition
            const factor = (Math.cos(t * Math.PI) * 0.5 + 0.5) * ageFactor;
            const shift = factor * rip.amplitude;
            currentX += (dx / dist) * shift;
            currentY += (dy / dist) * shift;
          }
        }
      }

      return { x: currentX, y: currentY };
    };

    // 5. Start Render / Physics Loop
    const render = () => {
      // Clear canvas on every frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      frameCount++;

      const dX = scrollRef.current.x;
      const dY = scrollRef.current.y;

      // Smooth mouse follow (lerping)
      if (mouseRef.current.active) {
        if (lerpMouseRef.current.x === -1000) {
          lerpMouseRef.current.x = mouseRef.current.x;
          lerpMouseRef.current.y = mouseRef.current.y;
        } else {
          lerpMouseRef.current.x += (mouseRef.current.x - lerpMouseRef.current.x) * 0.12;
          lerpMouseRef.current.y += (mouseRef.current.y - lerpMouseRef.current.y) * 0.12;
        }
        // Smoothly inflate the warp power when mouse active
        const targetWarp = 12; // reduced convex warp offset in pixels slightly
        warpStrengthRef.current += (targetWarp - warpStrengthRef.current) * 0.1;

        // Smart background vs content detection (every 3 frames to maintain peak 120Hz performance)
        if (frameCount % 3 === 0) {
          const elementAtCursor = document.elementFromPoint(mouseRef.current.x, mouseRef.current.y);
          isHoveringOverContentRef.current = checkIsHoveringOverContent(elementAtCursor);
        }
      } else {
        // Disappear gradually if mouse goes off screen
        lerpMouseRef.current.x += (-2000 - lerpMouseRef.current.x) * 0.08;
        lerpMouseRef.current.y += (-2000 - lerpMouseRef.current.y) * 0.08;

        // Smoothly deflate the warp back to a completely flat grid
        warpStrengthRef.current += (0 - warpStrengthRef.current) * 0.12;

        isHoveringOverContentRef.current = false;
      }

      const rx = lerpMouseRef.current.x;
      const ry = lerpMouseRef.current.y;
      const warpStrength = warpStrengthRef.current;

      // Base Grid spacing properties
      const gapCoarse = 40;
      const gapFine = 10;

      // Compute starting points aligned with document scrolling
      const startX = -dX % gapCoarse;
      const startY = -dY % gapCoarse;

      // Draw Grid Lines with Highlight Hover Effects
      const isDark = isDarkRef.current;
      const baseLineColorCoarse = isDark ? 'rgba(236, 234, 228, 0.06)' : 'rgba(24, 24, 21, 0.07)';
      const baseLineColorFine = isDark ? 'rgba(236, 234, 228, 0.02)' : 'rgba(24, 24, 21, 0.03)';

      // 1. FINE BACKGROUND GRID (10px) - No warp applied to keep background steady and performant
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = baseLineColorFine;
      ctx.beginPath();

      for (let x = -dX % gapFine; x < canvas.width; x += gapFine) {
        if (x % gapCoarse !== startX) { // Skip lines shared with coarse grid
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
        }
      }
      for (let y = -dY % gapFine; y < canvas.height; y += gapFine) {
        if (y % gapCoarse !== startY) { // Skip lines shared with coarse grid
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
        }
      }
      ctx.stroke();

      // 2. COARSE GRID INTERACTIVE DRAWING & CONVEX WARPING
      const hoverRadius = 100; // Radius where warp lens distortion applies
      const activeRipples = ripplesRef.current;

      // Check if a vertical line is affected by hover or ripples
      const isVerticalLineAffected = (xVal: number) => {
        if (rx > -500 && Math.abs(xVal - rx) < hoverRadius && warpStrength > 0) {
          return true;
        }
        for (let r = 0; r < activeRipples.length; r++) {
          const rip = activeRipples[r];
          const rxRip = rip.x - dX;
          if (Math.abs(xVal - rxRip) < (rip.radius + 60)) {
            return true;
          }
        }
        return false;
      };

      // Check if a horizontal line is affected by hover or ripples
      const isHorizontalLineAffected = (yVal: number) => {
        if (ry > -500 && Math.abs(yVal - ry) < hoverRadius && warpStrength > 0) {
          return true;
        }
        for (let r = 0; r < activeRipples.length; r++) {
          const rip = activeRipples[r];
          const ryRip = rip.y - dY;
          if (Math.abs(yVal - ryRip) < (rip.radius + 60)) {
            return true;
          }
        }
        return false;
      };

      // Draw Coarse Vertical Lines with optional local bulge warp
      const drawVerticalLine = (xVal: number) => {
        const affected = isVerticalLineAffected(xVal);

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = baseLineColorCoarse;

        if (!affected) {
          ctx.moveTo(xVal, 0);
          ctx.lineTo(xVal, canvas.height);
          ctx.stroke();
        } else {
          // Curved warped section
          const steps = 24; // Fluid subdivision
          const stepSize = canvas.height / steps;

          ctx.moveTo(xVal, 0);
          for (let i = 1; i <= steps; i++) {
            const curY = i * stepSize;
            const warped = warpPoint(xVal, curY, rx, ry, hoverRadius, warpStrength);
            ctx.lineTo(warped.x, warped.y);
          }
          ctx.stroke();
        }
      };

      // Draw Coarse Horizontal Lines with optional local bulge warp
      const drawHorizontalLine = (yVal: number) => {
        const affected = isHorizontalLineAffected(yVal);

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = baseLineColorCoarse;

        if (!affected) {
          ctx.moveTo(0, yVal);
          ctx.lineTo(canvas.width, yVal);
          ctx.stroke();
        } else {
          const steps = 24;
          const stepSize = canvas.width / steps;

          ctx.moveTo(0, yVal);
          for (let i = 1; i <= steps; i++) {
            const curX = i * stepSize;
            const warped = warpPoint(curX, yVal, rx, ry, hoverRadius, warpStrength);
            ctx.lineTo(warped.x, warped.y);
          }
          ctx.stroke();
        }
      };

      // Draw Coarse Vertical Lines
      for (let x = startX; x < canvas.width; x += gapCoarse) {
        drawVerticalLine(x);
      }

      // Draw Coarse Horizontal Lines
      for (let y = startY; y < canvas.height; y += gapCoarse) {
        drawHorizontalLine(y);
      }

      // 3. UPDATE CLICK RIPPLES (Propagate PHYSICAL wave, no standalone circle drawings)
      const currentRipples = ripplesRef.current;
      for (let i = currentRipples.length - 1; i >= 0; i--) {
        const rip = currentRipples[i];

        // Propagate outward smoothly
        rip.radius += (rip.maxRadius - rip.radius) * 0.075;
        rip.life -= 1;

        if (rip.life <= 0 || rip.radius >= rip.maxRadius - 2) {
          currentRipples.splice(i, 1);
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleMouseClick);
      window.removeEventListener('resize', resizeCanvas);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10 bg-transparent transition-opacity duration-700"
      id="interactive-blueprint-grid"
    />
  );
}
