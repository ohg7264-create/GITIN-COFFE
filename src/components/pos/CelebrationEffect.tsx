import React, { useEffect, useState } from 'react';
import { CheckCircle2, Volume2, Sparkles, X } from 'lucide-react';
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
  onClose,
  invoiceNumber,
  totalAmount,
  paymentMethod,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Play sound effect immediately
      soundEffects.playPaymentSuccess();
      setIsPlayingSound(true);
      const timer = setTimeout(() => setIsPlayingSound(false), 1200);

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

      return () => clearTimeout(timer);
    } else {
      setParticles([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReplaySound = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEffects.playPaymentSuccess();
    setIsPlayingSound(true);
    setTimeout(() => setIsPlayingSound(false), 1200);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex flex-col items-center justify-start pt-6 sm:pt-10 px-4">
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

      {/* Celebratory Banner Popup */}
      <div className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-sky-300 dark:border-sky-600/60 rounded-2xl shadow-2xl shadow-sky-500/20 p-4 sm:p-5 max-w-md w-full mx-auto transform animate-bounce-subtle flex items-start gap-3.5 z-10">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white flex items-center justify-center shrink-0 shadow-lg shadow-sky-500/30">
          <CheckCircle2 className="w-7 h-7 text-white stroke-[2.5]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              Pembayaran Berhasil!
            </h4>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 px-2 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
              <Sparkles className="w-3 h-3 text-sky-500" />
              Selesai
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            {invoiceNumber ? `Invoice: ${invoiceNumber}` : 'Transaksi telah tercatat'}{' '}
            {totalAmount ? `• ${totalAmount}` : ''}
          </p>

          <div className="flex items-center gap-2 mt-2.5">
            <button
              onClick={handleReplaySound}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition ${
                isPlayingSound
                  ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                  : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800 hover:bg-sky-100'
              }`}
              title="Putar ulang suara konfirmasi pembayaran"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingSound ? 'animate-pulse' : ''}`} />
              <span>{isPlayingSound ? 'Memutar Suara...' : 'Putar Suara Pembayaran'}</span>
            </button>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
