import React from 'react';

/**
 * Authentic Cirebon Batik Megamendung Full-Screen Background Component
 * Uses the exact motif provided by the user (/assets/aistudio/batik-mega_34341792.png)
 * Applied seamlessly to the full-screen background of the application.
 */

interface MegamendungBackgroundProps {
  className?: string;
  patternScale?: 'sm' | 'md' | 'lg';
  opacity?: number;
}

export const MegamendungBackground: React.FC<MegamendungBackgroundProps> = ({
  className = '',
  patternScale = 'md',
  opacity = 0.65,
}) => {
  // Tile scale for the seamless cloud pattern
  const bgSize = patternScale === 'sm' ? '360px auto' : patternScale === 'md' ? '480px auto' : '650px auto';

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* 1. Full-screen repeating Batik Megamendung pattern with warm orange hue transformation */}
      <div
        className="absolute inset-0 bg-repeat bg-center transition-opacity duration-300"
        style={{
          backgroundImage: `url('/assets/aistudio/batik-mega_34341792.png')`,
          backgroundSize: bgSize,
          opacity,
          filter: 'sepia(0.9) saturate(2.5) hue-rotate(335deg)',
          transform: 'translateZ(0)',
          willChange: 'transform',
        }}
      />

      {/* 2. Soft warm orange overlay gradient so content remains readable while orange batik shines */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-100/45 via-orange-50/25 to-white/40 dark:from-slate-950/75 dark:via-slate-900/65 dark:to-slate-950/80" />
    </div>
  );
};
