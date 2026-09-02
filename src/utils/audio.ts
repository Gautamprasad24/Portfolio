// Web Audio API cinematic ambient soundtrack generator & tactile interactive feedback

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true; // starts muted for browser autoplay policy
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isPlayingMusic: boolean = false;

  // Music generation nodes & timers
  private musicInterval: number | null = null;
  private padOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private filterNode: BiquadFilterNode | null = null;
  private lfoNode: OscillatorNode | null = null;
  private chordIndex: number = 0;

  // Cinematic ambient chord progression frequencies (Hz) - D minor / F / C / Bb ambient atmospheric
  private chords = [
    [146.83, 220.00, 261.63, 329.63, 440.00], // D3, A3, C4, E4, A4 (Dm9)
    [116.54, 174.61, 233.08, 293.66, 349.23], // Bb2, F3, Bb3, D4, F4 (Bbmaj7)
    [130.81, 196.00, 261.63, 329.63, 392.00], // C3, G3, C4, E4, G4 (Cadd9)
    [174.61, 220.00, 261.63, 349.23, 523.25], // F3, A3, C4, F4, C5 (Fmaj9)
  ];

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        
        // Master Gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(1, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Music Sub-gain
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        // SFX Sub-gain
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);
      }
    }
  }

  public async toggleMute(): Promise<boolean> {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.isMuted = !this.isMuted;

    if (!this.isMuted) {
      this.startMusic();
      this.playChime();
    } else {
      this.stopMusic();
    }

    return !this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public isMusicActive(): boolean {
    return !this.isMuted && this.isPlayingMusic;
  }

  // Starts the generative cinematic ambient soundtrack
  private startMusic() {
    if (!this.ctx || !this.musicGain) return;
    this.isPlayingMusic = true;

    // Smooth fade in master music
    const now = this.ctx.currentTime;
    this.musicGain.gain.cancelScheduledValues(now);
    this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
    this.musicGain.gain.linearRampToValueAtTime(0.18, now + 2.0);

    // Setup master lowpass filter with slow LFO breathing
    if (!this.filterNode) {
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(650, now);
      this.filterNode.Q.setValueAtTime(1.5, now);
      this.filterNode.connect(this.musicGain);

      // Filter LFO for subtle analog warmth
      this.lfoNode = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      this.lfoNode.type = 'sine';
      this.lfoNode.frequency.setValueAtTime(0.12, now); // 8 second gentle cycle
      lfoGain.gain.setValueAtTime(180, now);
      this.lfoNode.connect(lfoGain);
      lfoGain.connect(this.filterNode.frequency);
      this.lfoNode.start();
    }

    // Play next chord immediately and sequence progression every 7 seconds
    this.playNextChord();
    if (this.musicInterval) clearInterval(this.musicInterval);
    this.musicInterval = window.setInterval(() => {
      if (!this.isMuted) {
        this.playNextChord();
      }
    }, 7000);
  }

  // Smoothly plays the next lush polyphonic chord pad
  private playNextChord() {
    if (!this.ctx || !this.filterNode || this.isMuted) return;

    const currentChord = this.chords[this.chordIndex % this.chords.length];
    this.chordIndex++;

    const now = this.ctx.currentTime;
    const chordDuration = 7.5;

    // Clean up old oscillators
    this.padOscillators = this.padOscillators.filter(item => {
      try {
        return item.gain.gain.value > 0.0001;
      } catch {
        return false;
      }
    });

    currentChord.forEach((freq, idx) => {
      if (!this.ctx || !this.filterNode) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Alternate warm sine and soft triangle oscillators
      osc.type = idx === 0 ? 'sine' : (idx % 2 === 0 ? 'sine' : 'triangle');
      
      // Slight detune for rich analog chorusing effect
      const detuneCents = (Math.random() - 0.5) * 8;
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(detuneCents, now);

      // Volume envelope for gentle swell and fade
      const voiceGain = idx === 0 ? 0.09 : 0.04;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(voiceGain, now + 2.5);
      gain.gain.exponentialRampToValueAtTime(voiceGain * 0.7, now + 5.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + chordDuration);

      osc.connect(gain);
      gain.connect(this.filterNode);

      osc.start(now);
      osc.stop(now + chordDuration + 0.1);

      this.padOscillators.push({ osc, gain });
    });

    // Add a soft high-register harmonic ping (celesta / glass shimmer)
    if (Math.random() > 0.2) {
      this.playShimmerNote(currentChord);
    }
  }

  // Soft sparkle notes on top of ambient pad
  private playShimmerNote(chord: number[]) {
    if (!this.ctx || !this.filterNode || this.isMuted) return;
    const now = this.ctx.currentTime;
    const delay = 1.0 + Math.random() * 3.5;
    const shimmerFreq = chord[Math.floor(Math.random() * chord.length)] * 2; // 1 octave higher

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(shimmerFreq, now + delay);

    gain.gain.setValueAtTime(0.0001, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.025, now + delay + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 2.0);

    osc.connect(gain);
    gain.connect(this.filterNode);

    osc.start(now + delay);
    osc.stop(now + delay + 2.1);
  }

  // Smoothly fades out and stops the ambient music
  private stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }

    if (this.ctx && this.musicGain) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
      this.musicGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
    }
  }

  public playHover() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx || !this.sfxGain) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // AudioContext error safeguard
    }
  }

  public playClick() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx || !this.sfxGain) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // AudioContext error safeguard
    }
  }

  public playChime() {
    try {
      this.init();
      if (!this.ctx || !this.sfxGain) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const startTime = this.ctx!.currentTime + idx * 0.04;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.03, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch {
      // AudioContext error safeguard
    }
  }
}

export const sound = new SoundEngine();

