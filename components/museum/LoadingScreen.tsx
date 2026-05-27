"use client";

import { useEffect, useMemo, useState } from "react";
import { useProgress } from "@react-three/drei";

type LoadingScreenProps = {
  onComplete: () => void;
};

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const { progress: assetProgress } = useProgress();
  const [bootProgress, setBootProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();

    const tick = () => {
      const elapsed = performance.now() - start;
      const pct = Math.min(100, (elapsed / 1500) * 100);
      setBootProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(tick);
      }
    };

    const raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
    };
  }, []);

  const effectiveProgress = useMemo(() => {
    const weighted = assetProgress * 0.72 + bootProgress * 0.28;
    return Math.min(100, weighted);
  }, [assetProgress, bootProgress]);

  useEffect(() => {
    if (done) {
      return;
    }

    if (effectiveProgress >= 100) {
      setDone(true);
      const timeout = setTimeout(() => {
        onComplete();
      }, 250);

      return () => clearTimeout(timeout);
    }
  }, [done, effectiveProgress, onComplete]);

  if (done) {
    return null;
  }

  return (
    <div className="tv-loader" role="status" aria-live="polite" aria-label="Chargement du musee">
      <div className="tv-loader-card">
        <p className="tv-loader-kicker">Musee Virtuel des Technologies Vertes</p>
        <h2 className="tv-loader-title">Technologies Vertes</h2>
        <p className="tv-loader-subtitle">Initialisation de l'experience immersive...</p>
        <div className="tv-loader-bar-shell" aria-hidden="true">
          <div className="tv-loader-bar-fill" style={{ width: `${effectiveProgress}%` }} />
        </div>
        <p className="tv-loader-percent">{Math.round(effectiveProgress)}%</p>
      </div>
    </div>
  );
}
