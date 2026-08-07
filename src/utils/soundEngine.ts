// Web Audio API procedural sound synthesis for Momentum OS
// Zero external audio files required! Works 100% offline & reliably on Vercel.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private currentAmbientType: string | null = null;
  private activeSourceNodes: AudioNode[] = [];

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- UI SOUND EFFECTS ---

  public playClick() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio context permission or fallback
    }
  }

  public playComplete() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      // Two-tone accomplishment chime (E5 -> B5)
      const freqs = [659.25, 987.77];
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch {
      // Fallback
    }
  }

  public playTimerBell() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.3); // C6 bell ring

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch {
      // Fallback
    }
  }

  // --- PROCEDURAL AMBIENT SOUNDSCAPES ---

  public startAmbient(type: 'rain' | 'lofi' | 'space' | 'cafe' | 'forest', volume: number = 0.5) {
    this.stopAmbient();
    this.initCtx();
    if (!this.ctx) return;

    this.currentAmbientType = type;
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(volume * 0.3, this.ctx.currentTime);
    this.ambientGain.connect(this.ctx.destination);

    if (type === 'rain' || type === 'cafe' || type === 'forest') {
      this.createNoiseSoundscape(type);
    } else if (type === 'lofi' || type === 'space') {
      this.createDroneSoundscape(type);
    }
  }

  public setAmbientVolume(volume: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(volume * 0.3, this.ctx.currentTime, 0.1);
    }
  }

  public stopAmbient() {
    this.activeSourceNodes.forEach(node => {
      try {
        if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          (node as AudioScheduledSourceNode).stop();
        }
        node.disconnect();
      } catch {
        // Node already stopped
      }
    });
    this.activeSourceNodes = [];
    this.currentAmbientType = null;
  }

  public getCurrentAmbient() {
    return this.currentAmbientType;
  }

  private createNoiseSoundscape(type: 'rain' | 'cafe' | 'forest') {
    if (!this.ctx || !this.ambientGain) return;

    // Create 5 seconds buffer of pink/filtered noise
    const bufferSize = this.ctx.sampleRate * 5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    if (type === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.value = 1000;
    } else if (type === 'cafe') {
      filter.type = 'bandpass';
      filter.frequency.value = 800;
      filter.Q.value = 1.5;
    } else {
      // forest
      filter.type = 'lowpass';
      filter.frequency.value = 600;
    }

    noise.connect(filter);
    filter.connect(this.ambientGain);

    noise.start();
    this.activeSourceNodes.push(noise, filter);
  }

  private createDroneSoundscape(type: 'lofi' | 'space') {
    if (!this.ctx || !this.ambientGain) return;

    const baseFreq = type === 'lofi' ? 110 : 65; // A2 or C2
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc2.frequency.setValueAtTime(baseFreq * 1.5, this.ctx.currentTime); // Fifth harmonic

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(this.ambientGain);

    osc1.start();
    osc2.start();

    this.activeSourceNodes.push(osc1, osc2, filter);
  }
}

export const soundEngine = new SoundEngine();
