import React, { useEffect, useRef, useMemo } from 'react';

export default function HexagonBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track nodes to draw digital circuit connections
    const points = [];
    const numPoints = 25;

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        glowIntensity: Math.random() * 0.5 + 0.3,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Detect if light mode is active on document
      const isLight = document.documentElement.classList.contains('light');

      // Draw modern dark/light cyber gradient background
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        10,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      if (isLight) {
        bgGrad.addColorStop(0, 'rgba(254, 252, 246, 0.35)'); // Translucent Warm Solarpunk pearl
        bgGrad.addColorStop(0.55, 'rgba(240, 253, 244, 0.55)'); // Translucent Fresh cyber-nature mint
        bgGrad.addColorStop(1, 'rgba(224, 242, 254, 0.75)'); // Translucent Clear premium sky-blue
      } else {
        bgGrad.addColorStop(0, '#090b11');
        bgGrad.addColorStop(0.5, '#040508');
        bgGrad.addColorStop(1, '#010204');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw faint cyber grid lines
      ctx.strokeStyle = isLight ? 'rgba(29, 78, 216, 0.18)' : 'rgba(0, 242, 254, 0.015)';
      ctx.lineWidth = isLight ? 1.2 : 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw floating nodes
      points.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Boundary bounce
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (isLight ? 2.5 : 1), 0, Math.PI * 2);
        ctx.fillStyle = isLight 
          ? `rgba(29, 78, 216, ${Math.min(1, p.glowIntensity * 1.8)})` 
          : `rgba(0, 242, 254, ${p.glowIntensity})`;
        ctx.shadowBlur = isLight ? 14 : 10;
        ctx.shadowColor = isLight ? '#1d4ed8' : '#00f2fe';
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow
      });

      // Draw glowing connectivity vectors/circuits (only close nodes)
      ctx.lineWidth = isLight ? 1.8 : 0.5;
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const alpha = (1 - dist / 150) * (isLight ? 0.85 : 0.12);
            ctx.strokeStyle = isLight 
              ? `rgba(29, 78, 216, ${alpha})` 
              : `rgba(0, 242, 254, ${alpha})`;
            
            // Create nice glowing stroke
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Floating Hexagons exactly matching the layout algorithm of index.js
  const floatingHexagons = useMemo(() => {
    return Array.from({ length: 8 }, (_, idx) => {
      const left = `${8 + idx * 11}%`;
      const top = `${Math.sin(idx * 1.3) * 25 + 45}%`;
      const size = 30 + (idx % 3) * 15;
      const delay = `${idx * 0.8}s`;
      const duration = `${12 + idx * 2.5}s`;

      return (
        <div
          key={idx}
          className="absolute opacity-[0.06] pointer-events-none animate-float-slow"
          style={{
            left,
            top,
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: delay,
            animationDuration: duration,
          }}
        >
          {/* Custom SVG metallic hexagon */}
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-sky-500 dark:text-cyber-cyan stroke-current stroke-[2.5px]">
            <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
          </svg>
        </div>
      );
    });
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-50 overflow-hidden bg-transparent dark:bg-slate-950 transition-colors duration-500">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {floatingHexagons}
      </div>
    </div>
  );
}
