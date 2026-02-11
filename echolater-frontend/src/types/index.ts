export type TimeCategory = 'today' | 'thisWeek' | 'future' | 'inbox';

export interface Idea {
  id: string;
  audioUrl: string | null;       // null for mock items without real audio
  audioBlobUrl: string | null;   // temporary blob URL for freshly recorded audio
  audioDuration: number;         // seconds
  transcription: string;
  manualNote: string;
  extractedTime: string | null;  // ISO date string
  timeCategory: TimeCategory;
  tags: string[];
  isCompleted: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IdeaFilters {
  search: string;
  timeCategory: TimeCategory | 'all';
  isCompleted: boolean | null;
  tags: string[];
}

export type Theme = 'light' | 'dark';
export type RecordingQuality = 'high' | 'medium' | 'low';

export interface AppSettings {
  theme: Theme;
  recordingQuality: RecordingQuality;
}
