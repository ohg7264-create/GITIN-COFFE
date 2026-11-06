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

      // Generate confetti particles in warm orange, amber, and gold palette
      const colors = [
        '#ea580c', // orange-600
        '#f97316', // orange-500
        '#fb923c', // orange-400
        '#f59e0b', // amber-500
        '#fbbf24', // amber-400
        '#fde047', // yellow-300
        '#ffffff', // pure white
        '#d97706', // amber-600
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
              boxShadow: '0 2px 8px rgba(249, 115, 22, 0.35)',
            }}
          />
        ))}
      </div>
    </div>
  );
};
