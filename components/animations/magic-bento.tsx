"use client";

import { useRef, useEffect, useState, ReactNode } from "react";
import { gsap } from "gsap";

interface MagicBentoProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  tiltStrength?: number;
  magnetStrength?: number;
}

export function MagicBento({
  children,
  className = "",
  glowColor = "167, 139, 250", // Brand purple
  tiltStrength = 10,
  magnetStrength = 0.3,
}: MagicBentoProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check for mobile/touch devices
    const checkMobile = () => {
      setIsMobile(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          window.innerWidth < 768
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile || !cardRef.current || !glowRef.current) return;

    const card = cardRef.current;
    const glow = glowRef.current;
    let bounds: DOMRect;

    const handleMouseEnter = () => {
      bounds = card.getBoundingClientRect();
      gsap.to(glow, { opacity: 1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(glow, { opacity: 0, duration: 0.3 });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!bounds) return;

      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;
      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;

      // Calculate rotation based on mouse position
      const rotateX = ((mouseY - centerY) / centerY) * -tiltStrength;
      const rotateY = ((mouseX - centerX) / centerX) * tiltStrength;

      // Magnetism effect - slight pull toward cursor
      const magnetX = ((mouseX - centerX) / centerX) * magnetStrength * 10;
      const magnetY = ((mouseY - centerY) / centerY) * magnetStrength * 10;

      gsap.to(card, {
        rotateX,
        rotateY,
        x: magnetX,
        y: magnetY,
        duration: 0.3,
        ease: "power2.out",
        transformPerspective: 1000,
      });

      // Move glow to follow cursor
      gsap.to(glow, {
        x: mouseX - bounds.width / 2,
        y: mouseY - bounds.height / 2,
        duration: 0.2,
      });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);
    card.addEventListener("mousemove", handleMouseMove);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
      card.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMobile, tiltStrength, magnetStrength]);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Cursor-following glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          background: `radial-gradient(600px circle at center, rgba(${glowColor}, 0.15), transparent 40%)`,
        }}
      />
      {/* Border glow effect */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, rgba(${glowColor}, 0.3) 0%, transparent 50%, rgba(${glowColor}, 0.1) 100%)`,
          padding: "1px",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "xor",
          WebkitMaskComposite: "xor",
        }}
      />
      {children}
    </div>
  );
}

interface MagicBentoGridProps {
  children: ReactNode;
  className?: string;
}

export function MagicBentoGrid({ children, className = "" }: MagicBentoGridProps) {
  return (
    <div className={`grid gap-4 ${className}`}>
      {children}
    </div>
  );
}
