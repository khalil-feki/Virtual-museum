"use client";

import { useEffect, useRef, useState } from "react";

type AudioRig = {
  ctx: AudioContext;
  master: GainNode;
  oscillators: OscillatorNode[];
  gains: GainNode[];
  filter: BiquadFilterNode;
  lfo: OscillatorNode;
  lfoGain: GainNode;
};

export function AmbientSoundToggle() {
  const [enabled, setEnabled] = useState(false);
  const rigRef = useRef<AudioRig | null>(null);

  const stopAudio = async () => {
    const rig = rigRef.current;

    if (!rig) {
      return;
    }

    const now = rig.ctx.currentTime;
    rig.master.gain.cancelScheduledValues(now);
    rig.master.gain.setValueAtTime(rig.master.gain.value, now);
    rig.master.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    setTimeout(async () => {
      rig.oscillators.forEach((osc) => osc.stop());
      rig.lfo.stop();
      await rig.ctx.close();
      rigRef.current = null;
    }, 540);
  };

  const startAudio = async () => {
    if (rigRef.current) {
      return;
    }

    const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioCtx) {
      return;
    }

    const ctx = new AudioCtx();

    const master = ctx.createGain();
    master.gain.value = 0.0001;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    filter.Q.value = 0.8;

    const oscLow = ctx.createOscillator();
    const oscHigh = ctx.createOscillator();
    oscLow.type = "sine";
    oscHigh.type = "triangle";
    oscLow.frequency.value = 92;
    oscHigh.frequency.value = 184;

    const lowGain = ctx.createGain();
    const highGain = ctx.createGain();
    lowGain.gain.value = 0.09;
    highGain.gain.value = 0.04;

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.1;
    lfoGain.gain.value = 180;

    oscLow.connect(lowGain);
    oscHigh.connect(highGain);
    lowGain.connect(filter);
    highGain.connect(filter);
    filter.connect(master);
    master.connect(ctx.destination);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    oscLow.start();
    oscHigh.start();
    lfo.start();

    const now = ctx.currentTime;
    master.gain.exponentialRampToValueAtTime(0.16, now + 0.8);

    rigRef.current = {
      ctx,
      master,
      oscillators: [oscLow, oscHigh],
      gains: [lowGain, highGain],
      filter,
      lfo,
      lfoGain,
    };
  };

  useEffect(() => {
    if (enabled) {
      void startAudio();
      return;
    }

    void stopAudio();
  }, [enabled]);

  useEffect(() => {
    return () => {
      void stopAudio();
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => setEnabled((prev) => !prev)}
      className="tv-audio-toggle"
      aria-label={enabled ? "Desactiver le son d'ambiance" : "Activer le son d'ambiance"}
      aria-pressed={enabled}
    >
      Son d'ambiance: {enabled ? "Actif" : "Coupe"}
    </button>
  );
}
