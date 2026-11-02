/**
 * Web Audio API Engine & Mechanical Sound Synthesizer
 * Generates realistic audio representations of engine symptoms offline
 */

let audioCtx: AudioContext | null = null;
let currentSourceNodes: { stop: () => void } | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function stopEngineSound() {
  if (currentSourceNodes) {
    try {
      currentSourceNodes.stop();
    } catch {
      // Ignored
    }
    currentSourceNodes = null;
  }
}

export function playDiagnosticSound(
  type: 'ticking' | 'knocking' | 'whining' | 'rodknock' | 'bogging' | 'healthy',
  durationSec: number = 3.5
): void {
  stopEngineSound();
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.3, now);
  masterGain.connect(ctx.destination);

  let isPlaying = true;
  const timeoutId = setTimeout(() => {
    stopEngineSound();
  }, durationSec * 1000);

  if (type === 'ticking') {
    // Valve lash ticking: rapid crisp metallic pulses (~14 clicks per sec)
    const interval = 0.075; // ~13.3 Hz
    const clicksCount = Math.floor(durationSec / interval);

    for (let i = 0; i < clicksCount; i++) {
      const clickTime = now + i * interval;
      const osc = ctx.createOscillator();
      const clickGain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2400, clickTime);
      osc.frequency.exponentialRampToValueAtTime(800, clickTime + 0.015);

      clickGain.gain.setValueAtTime(0.4, clickTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.018);

      osc.connect(clickGain);
      clickGain.connect(masterGain);

      osc.start(clickTime);
      osc.stop(clickTime + 0.02);
    }
  } else if (type === 'knocking') {
    // Piston slap / mechanical interference: hard metallic hollow strike
    const interval = 0.12;
    const strikes = Math.floor(durationSec / interval);

    for (let i = 0; i < strikes; i++) {
      const strikeTime = now + i * interval;
      const osc = ctx.createOscillator();
      const strikeGain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, strikeTime);
      osc.frequency.exponentialRampToValueAtTime(140, strikeTime + 0.04);

      strikeGain.gain.setValueAtTime(0.6, strikeTime);
      strikeGain.gain.exponentialRampToValueAtTime(0.001, strikeTime + 0.045);

      osc.connect(strikeGain);
      strikeGain.connect(masterGain);

      osc.start(strikeTime);
      osc.stop(strikeTime + 0.05);
    }
  } else if (type === 'whining') {
    // Clutch primary gear whine: frequency ramps up from 450Hz to 1800Hz
    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator();
    const whineGain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.linearRampToValueAtTime(1600, now + durationSec);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(900, now);
    subOsc.frequency.linearRampToValueAtTime(3200, now + durationSec);

    whineGain.gain.setValueAtTime(0.15, now);
    whineGain.gain.linearRampToValueAtTime(0.35, now + durationSec * 0.7);
    whineGain.gain.linearRampToValueAtTime(0.001, now + durationSec);

    osc.connect(whineGain);
    subOsc.connect(whineGain);
    whineGain.connect(masterGain);

    osc.start(now);
    subOsc.start(now);
    osc.stop(now + durationSec);
    subOsc.stop(now + durationSec);
  } else if (type === 'rodknock') {
    // Deep heavy rod knock: low resonant thud (~95Hz)
    const interval = 0.15;
    const thuds = Math.floor(durationSec / interval);

    for (let i = 0; i < thuds; i++) {
      const thudTime = now + i * interval;
      const osc = ctx.createOscillator();
      const thudGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, thudTime);
      osc.frequency.exponentialRampToValueAtTime(50, thudTime + 0.06);

      thudGain.gain.setValueAtTime(0.8, thudTime);
      thudGain.gain.exponentialRampToValueAtTime(0.001, thudTime + 0.08);

      osc.connect(thudGain);
      thudGain.connect(masterGain);

      osc.start(thudTime);
      osc.stop(thudTime + 0.09);
    }
  } else if (type === 'bogging') {
    // Carburetor bogging: air gulp followed by stalling flutter
    const osc = ctx.createOscillator();
    const noiseGain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 1.2);
    osc.frequency.setValueAtTime(50, now + 1.3);

    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.linearRampToValueAtTime(0.1, now + 1.0);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

    osc.connect(noiseGain);
    noiseGain.connect(masterGain);

    osc.start(now);
    osc.stop(now + 2.0);
  } else {
    // Healthy idle: rhythmic, balanced 4-stroke thrumming (1300 RPM => ~21Hz)
    const osc = ctx.createOscillator();
    const idleGain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(80, now);

    // Subtle LFO modulation
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(22, now);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(15, now);

    lfo.connect(osc.frequency);
    idleGain.gain.setValueAtTime(0.3, now);
    idleGain.gain.linearRampToValueAtTime(0.01, now + durationSec);

    osc.connect(idleGain);
    idleGain.connect(masterGain);

    lfo.start(now);
    osc.start(now);
    lfo.stop(now + durationSec);
    osc.stop(now + durationSec);
  }

  currentSourceNodes = {
    stop: () => {
      if (isPlaying) {
        isPlaying = false;
        clearTimeout(timeoutId);
        masterGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      }
    }
  };
}
