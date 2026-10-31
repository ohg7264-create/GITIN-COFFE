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
      {/* 1. Full-screen repeating Batik Megamendung pattern directly from user image asset */}
      <div
        className="absolute inset-0 bg-repeat bg-center transition-opacity duration-300"
        style={{
          backgroundImage: `url('/assets/aistudio/batik-mega_34341792.png')`,
          backgroundSize: bgSize,
          opacity,
        }}
      />

      {/* 2. Soft translucent overlay gradient so content remains readable while batik shines across the entire screen */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-100/40 via-sky-50/20 to-white/35 dark:from-slate-950/70 dark:via-slate-900/60 dark:to-slate-950/75" />
    </div>
  );
};
