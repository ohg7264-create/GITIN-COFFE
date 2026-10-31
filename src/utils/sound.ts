/**
 * Audio Synthesizer for POS Payment Success & Cash Register Chimes
 * Uses browser Web Audio API for zero-latency, realistic, reliable sound without external asset dependencies.
 */

class SoundEffects {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy initialize AudioContext on user interaction
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Plays a pleasant, modern payment success chime + cash register bell sound
   */
  public playPaymentSuccess(): void {
    if (this.isMuted) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // 1. First tone: E5 (659.25 Hz)
      this.playChimeTone(ctx, 659.25, now, 0.28, 0.18);

      // 2. Second tone: G#5 (830.61 Hz)
      this.playChimeTone(ctx, 830.61, now + 0.08, 0.32, 0.2);

      // 3. Third tone: B5 (987.77 Hz)
      this.playChimeTone(ctx, 987.77, now + 0.16, 0.36, 0.22);

      // 4. Climax Bell: E6 (1318.51 Hz) - crystal clear cash register bell
      this.playCashBell(ctx, 1318.51, now + 0.26, 0.85, 0.28);

      // 5. High harmonic shimmer: G#6 (1661.22 Hz)
      this.playCashBell(ctx, 1661.22, now + 0.28, 0.7, 0.15);
    } catch {
      // Audio playback might be prevented by browser autoplay policy before user gesture
    }
  }

  private playChimeTone(ctx: AudioContext, freq: number, startTime: number, duration: number, volume: number): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Envelope: quick attack, smooth exponential decay
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  private playCashBell(ctx: AudioContext, freq: number, startTime: number, duration: number, volume: number): void {
    const osc = ctx.createOscillator();
    const oscHarmonic = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    oscHarmonic.type = 'sine';
    oscHarmonic.frequency.setValueAtTime(freq * 2.02, startTime); // slightly detuned harmonic for metallic coin/bell ring

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.00001, startTime + duration);

    osc.connect(gain);
    oscHarmonic.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    oscHarmonic.start(startTime);
    osc.stop(startTime + duration);
    oscHarmonic.stop(startTime + duration);
  }

  /**
   * Short subtle click for UI buttons
   */
  public playClick(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Ignore
    }
  }
}

export const soundEffects = new SoundEffects();
