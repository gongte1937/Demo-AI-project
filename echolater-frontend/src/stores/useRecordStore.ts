import { create } from 'zustand';

export type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';

interface RecordState {
  state: RecordingState;
  duration: number;       // seconds elapsed
  audioBlob: Blob | null;
  audioBlobUrl: string | null;
  waveformData: number[]; // 0–1 amplitude per bar

  setState: (s: RecordingState) => void;
  setDuration: (d: number) => void;
  setAudioBlob: (blob: Blob | null) => void;
  setWaveformData: (data: number[]) => void;
  reset: () => void;
}

export const useRecordStore = create<RecordState>((set, get) => ({
  state: 'idle',
  duration: 0,
  audioBlob: null,
  audioBlobUrl: null,
  waveformData: new Array(30).fill(0),

  setState: (s) => set({ state: s }),
  setDuration: (d) => set({ duration: d }),

  setAudioBlob: (blob) => {
    const prev = get().audioBlobUrl;
    if (prev) URL.revokeObjectURL(prev);
    const url = blob ? URL.createObjectURL(blob) : null;
    set({ audioBlob: blob, audioBlobUrl: url });
  },

  setWaveformData: (data) => set({ waveformData: data }),

  reset: () => {
    const prev = get().audioBlobUrl;
    if (prev) URL.revokeObjectURL(prev);
    set({
      state: 'idle',
      duration: 0,
      audioBlob: null,
      audioBlobUrl: null,
      waveformData: new Array(30).fill(0),
    });
  },
}));
