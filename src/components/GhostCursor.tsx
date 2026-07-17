import { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay?: number;
}

const GhostCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse events
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Particles array
    const particles: Particle[] = [];
    const maxParticles = 80;

    // Helper colors
    const colors = [
      'rgba(0, 245, 255, 0.25)', // Cyan/Electric Blue
      'rgba(123, 97, 255, 0.25)', // Violet/Purple
      'rgba(110, 231, 255, 0.2)',  // Light Cyan
      'rgba(255, 255, 255, 0.15)', // Soft White Glow
    ];

    // Initialize static particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.3,
      });
    }

    // Interactive trail particles spawned on mouse move
    let lastSpawn = 0;

    const animate = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      // Spawn cursor-attached flowing energy particles
      if (mouseRef.current.active && time - lastSpawn > 40) {
        lastSpawn = time;
        particles.push({
          x: mouseRef.current.x + (Math.random() - 0.5) * 30,
          y: mouseRef.current.y + (Math.random() - 0.5) * 30,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8 - 0.2, // slight upward drift
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * (colors.length - 1))], // don't use white as much for cursor trail
          alpha: 1.0,
          decay: Math.random() * 0.015 + 0.005,
        });

        // Limit maximum particles
        if (particles.length > 200) {
          particles.splice(maxParticles, particles.length - 200);
        }
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Apply mouse attraction/gravitation
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 250) {
            // Gentle pull towards mouse
            p.vx += (dx / dist) * 0.008;
            p.vy += (dy / dist) * 0.008;
            // Cap velocities
            p.vx = Math.max(-1.5, Math.min(1.5, p.vx));
            p.vy = Math.max(-1.5, Math.min(1.5, p.vy));
          }
        }

        // Slow speed deceleration (friction)
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Boundary collision for ambient particles
        if (p.decay === undefined) {
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }

        // Fade trail particles
        if (p.decay !== undefined) {
          p.alpha -= p.decay;
          if (p.alpha <= 0) {
            particles.splice(i, 1);
            i--;
            continue;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${p.alpha})`);
        
        // Add soft white/blue glow shadows to key particles
        if (p.size > 2) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();
      }

      ctx.shadowBlur = 0; // reset shadow

      // Draw connections (neural pathway lines)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.15 * Math.min(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 245, 255, ${alpha})`; // cyan connection lines
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    let rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40 bg-transparent"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default GhostCursor;
