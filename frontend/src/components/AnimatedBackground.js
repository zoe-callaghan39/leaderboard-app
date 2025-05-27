// src/components/AnimatedBackground.js
import React, { useEffect, useRef } from "react";
import "./styles/AnimatedBackground.css";

export default function AnimatedBackground() {
  const containerRef = useRef(null);

  // helper to spawn static particles
  const createParticles = (container, count) => {
    const rect = container.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 4 + 1;
      const p = document.createElement("div");
      p.className = "particle";
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * rect.width}px`;
      p.style.top = `${Math.random() * rect.height}px`;
      p.style.opacity = (Math.random() * 0.5 + 0.1).toString();
      p.style.animationDuration = `${Math.random() * 15 + 10}s`;
      const shades = [
        "rgba(219,234,254,0.8)",
        "rgba(191,219,254,0.8)",
        "rgba(147,197,253,0.8)",
        "rgba(96,165,250,0.8)",
        "rgba(59,130,246,0.8)",
      ];
      const bg = shades[Math.floor(Math.random() * shades.length)];
      p.style.background = bg;
      p.style.boxShadow = `0 0 ${size * 2}px ${bg}`;
      container.appendChild(p);
    }
  };

  // interactive particles follow pointer
  const createInteractive = (container, count) => {
    const rect = container.getBoundingClientRect();
    let mouseX = rect.width / 2,
      mouseY = rect.height / 2;
    const parts = [];
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 3 + 2;
      const p = document.createElement("div");
      p.className = "particle";
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      const shades = [
        "rgba(219,234,254,0.9)",
        "rgba(191,219,254,0.9)",
        "rgba(147,197,253,0.9)",
        "rgba(96,165,250,0.9)",
      ];
      const bg = shades[Math.floor(Math.random() * shades.length)];
      p.style.background = bg;
      p.style.boxShadow = `0 0 ${size * 2}px ${bg}`;
      container.appendChild(p);

      parts.push({
        el: p,
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        speed: Math.random() * 0.04 + 0.02,
      });
    }

    const onMove = (e) => {
      const bounds = container.getBoundingClientRect();
      mouseX = (e.touches ? e.touches[0].clientX : e.clientX) - bounds.left;
      mouseY = (e.touches ? e.touches[0].clientY : e.clientY) - bounds.top;
    };
    container.addEventListener("mousemove", onMove);
    container.addEventListener("touchmove", onMove, { passive: false });

    const animate = () => {
      parts.forEach((p) => {
        p.x += (mouseX - p.x) * p.speed;
        p.y += (mouseY - p.y) * p.speed;
        p.el.style.left = `${p.x}px`;
        p.el.style.top = `${p.y}px`;
      });
      requestAnimationFrame(animate);
    };
    animate();
  };

  useEffect(() => {
    const root = containerRef.current;
    // gradient
    const grad = document.createElement("div");
    grad.className = "gradient-bg";
    root.appendChild(grad);
    // waves
    const waveWrap = document.createElement("div");
    waveWrap.className = "wave-container";
    [0, 1, 2].forEach(() => {
      const w = document.createElement("div");
      w.className = "wave";
      waveWrap.appendChild(w);
    });
    root.appendChild(waveWrap);
    // glows
    const glow1 = document.createElement("div");
    glow1.className = "glow";
    Object.assign(glow1.style, {
      width: "300px",
      height: "300px",
      top: "20%",
      left: "20%",
      background:
        "radial-gradient(circle, rgba(56,189,248,0.4) 0%, rgba(14,165,233,0.1) 70%)",
    });
    const glow2 = glow1.cloneNode();
    glow2.style.width = glow2.style.height = "250px";
    glow2.style.top = "60%";
    glow2.style.left = "70%";
    glow2.style.background =
      "radial-gradient(circle, rgba(37,99,235,0.4) 0%, rgba(30,64,175,0.1) 70%)";
    root.append(glow1, glow2);
    // static particles
    const particleWrap = document.createElement("div");
    particleWrap.className = "particles-container";
    root.appendChild(particleWrap);
    createParticles(particleWrap, 50);
    // interactive
    createInteractive(particleWrap, 15);

    return () => {
      // cleanup on unmount
      root.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} className="animated-bg-container" />;
}
