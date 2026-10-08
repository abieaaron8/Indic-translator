import React, { useRef, useEffect } from 'react';
import { audioCapture } from '../../services/audioCapture';

interface WaveformProps {
  isActive: boolean;
}

export const Waveform: React.FC<WaveformProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const barCount = 20;
    const barWidth = 3;
    const barSpacing = 4;
    const maxBarHeight = 20;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const levels = isActive
        ? audioCapture.getAudioLevels(barCount)
        : new Array(barCount).fill(0.15);

      const totalWidth = barCount * (barWidth + barSpacing) - barSpacing;
      const startX = (canvas.width - totalWidth) / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < barCount; i++) {
        const level = levels[i];
        const barHeight = Math.max(3, level * maxBarHeight);
        const x = startX + i * (barWidth + barSpacing);
        const y = centerY - barHeight / 2;

        ctx.fillStyle = isActive ? '#4A6B53' : '#CCD5CC';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 1.5);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive]);

  return (
    <div className="flex items-center justify-center h-6 select-none" aria-hidden="true">
      <canvas
        ref={canvasRef}
        width={160}
        height={24}
        className="w-[160px] h-[24px]"
      />
    </div>
  );
};
