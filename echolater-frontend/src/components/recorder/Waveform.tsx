import { cn } from '@/lib/utils';
import { useRecordStore } from '@/stores/useRecordStore';

interface WaveformProps {
  className?: string;
  barCount?: number;
}

export function Waveform({ className, barCount = 30 }: WaveformProps) {
  const { waveformData, state } = useRecordStore();
  const isActive = state === 'recording';

  return (
    <div className={cn('flex items-center justify-center gap-[3px] h-16', className)}>
      {Array.from({ length: barCount }).map((_, i) => {
        const amplitude = waveformData[i] ?? 0;
        // Idle bars show a subtle static pattern; active bars scale with audio
        const height = isActive
          ? Math.max(4, amplitude * 56)
          : 4 + Math.sin(i * 0.6) * 3;

        return (
          <div
            key={i}
            className={cn(
              'w-1 rounded-full transition-all duration-75',
              isActive ? 'bg-primary' : 'bg-muted-foreground/30',
            )}
            style={{ height: `${height}px` }}
          />
        );
      })}
    </div>
  );
}
