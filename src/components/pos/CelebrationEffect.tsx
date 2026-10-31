import React, { useEffect, useState } from 'react';
import { soundEffects } from '../../utils/sound';

interface CelebrationEffectProps {
  isOpen: boolean;
  onClose?: () => void;
  invoiceNumber?: string;
  totalAmount?: string;
  paymentMethod?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  shape: 'circle' | 'square' | 'rect';
  delay: number;
  duration: number;
}

export const CelebrationEffect: React.FC<CelebrationEffectProps> = ({
  isOpen,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Play sound effect cleanly in background
      soundEffects.playPaymentSuccess();

      // Generate confetti particles in professional light blue & white palette
      const colors = [
        '#0284c7', // sky-600
        '#0ea5e9', // sky-500
        '#38bdf8', // sky-400
        '#7dd3fc', // sky-300
        '#bae6fd', // sky-200
        '#06b6d4', // cyan-500
        '#3b82f6', // blue-500
        '#ffffff', // pure white
        '#fbbf24', // golden accent
      ];

      const shapes: ('circle' | 'square' | 'rect')[] = ['circle', 'square', 'rect'];

      const newParticles: Particle[] = Array.from({ length: 48 }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // percentage across screen
        y: -10 - Math.random() * 20, // start above view
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        delay: Math.random() * 0.4,
        duration: 2.2 + Math.random() * 1.5,
      }));

      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Floating Confetti Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute animate-confetti-fall"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.shape === 'rect' ? `${p.size * 1.6}px` : `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              borderRadius: p.shape === 'circle' ? '9999px' : p.shape === 'square' ? '2px' : '3px',
              transform: `rotate(${p.rotation}deg)`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              opacity: 0.9,
              boxShadow: '0 2px 8px rgba(14, 165, 233, 0.3)',
            }}
          />
        ))}
      </div>
    </div>
  );
};
