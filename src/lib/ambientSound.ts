// Web Audio API Ambient Sound Synthesizer
// Provides organic, soothing, zero-asset background ambient sounds for deep reading and relaxation

export type AmbientPreset = '432hz' | 'tibetan' | 'water_breeze' | 'starlight';

export interface AmbientTrack {
  id: AmbientPreset;
  name: string;
  description: string;
  iconName: string;
  frequencies: number[];
}

export const AMBIENT_PRESETS: AmbientTrack[] = [
  {
    id: '432hz',
    name: 'Sóng Thiền 432Hz',
    description: 'Tần số hòa hợp tự nhiên & an định tâm trí',
    iconName: 'Sparkles',
    frequencies: [108, 216, 432, 864]
  },
  {
    id: 'tibetan',
    name: 'Chuông Xoay Tây Tạng',
    description: 'Âm hưởng chuông đồng cổ truyền thanh lọc năng lượng',
    iconName: 'Bell',
    frequencies: [144, 288, 432, 576]
  },
  {
    id: 'starlight',
    name: 'Không Gian Ánh Sao',
    description: 'Âm hưởng thanh tao, bay bổng giữa các vì sao',
    iconName: 'Moon',
    frequencies: [220, 330, 440, 660]
  },
  {
    id: 'water_breeze',
    name: 'Dòng Chảy Tĩnh Lặng',
    description: 'Tiếng suối nguồn & gió thoảng êm dịu',
    iconName: 'Wind',
    frequencies: [136.1, 272.2, 408.3]
  }
];

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private currentPreset: AmbientPreset = '432hz';
  private volume: number = 0.35;
  private activeNodes: { stop: () => void }[] = [];
  private intervalId: any = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.1);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentPreset(): AmbientPreset {
    return this.currentPreset;
  }

  public start(preset: AmbientPreset = this.currentPreset) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stopAllNodes();
    this.currentPreset = preset;
    this.isPlaying = true;

    // Smooth fade in
    this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 1.8);

    if (preset === '432hz') {
      this.play432HzDrone();
    } else if (preset === 'tibetan') {
      this.playTibetanSingingBowl();
    } else if (preset === 'starlight') {
      this.playStarlightPad();
    } else if (preset === 'water_breeze') {
      this.playWaterBreeze();
    }
  }

  public switchPreset(preset: AmbientPreset) {
    if (this.isPlaying) {
      this.start(preset);
    } else {
      this.currentPreset = preset;
    }
  }

  public stop() {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    // Smooth fade out
    this.masterGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.4);
    setTimeout(() => {
      this.stopAllNodes();
      this.isPlaying = false;
    }, 600);
  }

  public toggle(preset?: AmbientPreset): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start(preset || this.currentPreset);
      return true;
    }
  }

  private stopAllNodes() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.activeNodes.forEach(node => {
      try {
        node.stop();
      } catch (e) {
        // ignore
      }
    });
    this.activeNodes = [];
  }

  // Preset 1: 432Hz Cosmic Binaural Drone
  private play432HzDrone() {
    if (!this.ctx || !this.masterGain) return;

    const baseFreq = 432;
    const droneFreqs = [baseFreq / 4, baseFreq / 2, baseFreq, baseFreq * 1.5]; // 108Hz, 216Hz, 432Hz, 648Hz

    droneFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Add gentle slow frequency modulation (LFO) for breathing effect
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.08 + idx * 0.03, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(1.5, this.ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600 + idx * 200, this.ctx.currentTime);

      const amp = idx === 0 ? 0.35 : idx === 1 ? 0.25 : 0.12;
      gain.gain.setValueAtTime(amp, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();

      this.activeNodes.push({
        stop: () => {
          try {
            lfo.stop();
            osc.stop();
          } catch (e) {}
        }
      });
    });
  }

  // Preset 2: Tibetan Singing Bowl Bell Resonance with recurring soft chime
  private playTibetanSingingBowl() {
    if (!this.ctx || !this.masterGain) return;

    // Continuous fundamental warm drone (Om 136.1Hz Cosmic Tone)
    const baseOsc = this.ctx.createOscillator();
    const baseGain = this.ctx.createGain();
    baseOsc.type = 'sine';
    baseOsc.frequency.setValueAtTime(136.1, this.ctx.currentTime);
    baseGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    baseOsc.connect(baseGain);
    baseGain.connect(this.masterGain);
    baseOsc.start();

    this.activeNodes.push({
      stop: () => {
        try { baseOsc.stop(); } catch (e) {}
      }
    });

    const triggerBowlStrike = () => {
      if (!this.ctx || !this.masterGain || !this.isPlaying) return;

      const harmonics = [272.2, 544.4, 816.6, 1088.8];
      harmonics.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq + (Math.random() * 2 - 1), this.ctx.currentTime);

        const now = this.ctx.currentTime;
        const decayTime = 5 + i * 2;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.2 / (i + 1), now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decayTime);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + decayTime + 0.5);
      });
    };

    triggerBowlStrike();
    this.intervalId = setInterval(() => {
      triggerBowlStrike();
    }, 7000);
  }

  // Preset 3: Ethereal Starlight Ambient Pad
  private playStarlightPad() {
    if (!this.ctx || !this.masterGain) return;

    const chords = [
      [220, 277.18, 329.63, 440], // A Major 7
      [174.61, 220, 261.63, 349.23], // F Major 7
      [196, 246.94, 293.66, 392] // G Major
    ];

    let currentChordIdx = 0;
    const oscNodes: { osc: OscillatorNode; gain: GainNode }[] = [];

    // Create 4 voice oscillators
    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(chords[0][i], this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start();

      oscNodes.push({ osc, gain });

      this.activeNodes.push({
        stop: () => {
          try { osc.stop(); } catch (e) {}
        }
      });
    }

    // Morph chords smoothly every 8 seconds
    this.intervalId = setInterval(() => {
      if (!this.ctx || !this.isPlaying) return;
      currentChordIdx = (currentChordIdx + 1) % chords.length;
      const nextChord = chords[currentChordIdx];

      oscNodes.forEach((node, idx) => {
        if (!this.ctx) return;
        node.osc.frequency.setTargetAtTime(nextChord[idx], this.ctx.currentTime, 2.5);
      });
    }, 8000);
  }

  // Preset 4: Calming Gentle Water & Breeze (Pink Noise stream + soft drone)
  private playWaterBreeze() {
    if (!this.ctx || !this.masterGain) return;

    // Generate Pink Noise buffer for realistic water & wind
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter simulating breeze and flowing stream
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    // LFO modulating the breeze flow
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);
    lfo.connect(filter.frequency);
    lfo.start();

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.45, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    whiteNoise.start();

    // Add deep grounding 108Hz drone under the stream
    const drone = this.ctx.createOscillator();
    const droneGain = this.ctx.createGain();
    drone.type = 'sine';
    drone.frequency.setValueAtTime(108, this.ctx.currentTime);
    droneGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    drone.connect(droneGain);
    droneGain.connect(this.masterGain);
    drone.start();

    this.activeNodes.push({
      stop: () => {
        try {
          whiteNoise.stop();
          lfo.stop();
          drone.stop();
        } catch (e) {}
      }
    });
  }
}

export const ambientSound = new AmbientSoundEngine();
