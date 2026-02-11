/**
 * Mock API layer — mirrors the real backend API contract.
 * Swap these functions with real axios calls when the backend is ready.
 *
 * Real backend base URL: import.meta.env.VITE_API_BASE_URL
 */
import type { Idea, TimeCategory } from '@/types';
import { MOCK_IDEAS, MOCK_TRANSCRIPTIONS } from './mock-data';
import { categorizeByTime } from '@/utils/time';
import dayjs from 'dayjs';

// Simulate network latency
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

let store: Idea[] = [...MOCK_IDEAS];

// ─── Ideas ────────────────────────────────────────────────────────────────────

export async function fetchIdeas(): Promise<Idea[]> {
  await delay(400);
  return [...store].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function fetchIdeaById(id: string): Promise<Idea | null> {
  await delay(200);
  return store.find((i) => i.id === id) ?? null;
}

export async function createIdea(payload: {
  audioBlob: Blob | null;
  audioDuration: number;
  manualNote: string;
}): Promise<Idea> {
  await delay(300);

  // Simulate transcription processing
  await delay(1800);

  const transcription =
    MOCK_TRANSCRIPTIONS[Math.floor(Math.random() * MOCK_TRANSCRIPTIONS.length)];

  // Mock time extraction — 60% chance of finding a time
  const hasTime = Math.random() > 0.4;
  let extractedTime: string | null = null;
  let timeCategory: TimeCategory = 'inbox';

  if (hasTime) {
    const daysOffset = [0, 1, 2, 5, 14, 30][Math.floor(Math.random() * 6)];
    extractedTime = dayjs().add(daysOffset, 'day').toISOString();
    timeCategory = categorizeByTime(extractedTime);
  }

  const audioBlobUrl = payload.audioBlob ? URL.createObjectURL(payload.audioBlob) : null;

  const newIdea: Idea = {
    id: crypto.randomUUID(),
    audioUrl: null, // would be an S3 URL in production
    audioBlobUrl,
    audioDuration: payload.audioDuration,
    transcription,
    manualNote: payload.manualNote,
    extractedTime,
    timeCategory,
    tags: [],
    isCompleted: false,
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  store = [newIdea, ...store];
  return newIdea;
}

export async function updateIdea(id: string, data: Partial<Idea>): Promise<Idea> {
  await delay(250);
  const idx = store.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error(`Idea ${id} not found`);

  const updated: Idea = {
    ...store[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  // Recalculate time category if extractedTime changed
  if (data.extractedTime !== undefined) {
    updated.timeCategory = categorizeByTime(data.extractedTime);
  }

  store = store.map((i) => (i.id === id ? updated : i));
  return updated;
}

export async function deleteIdea(id: string): Promise<void> {
  await delay(250);
  // Revoke blob URL to free memory
  const idea = store.find((i) => i.id === id);
  if (idea?.audioBlobUrl) URL.revokeObjectURL(idea.audioBlobUrl);
  store = store.filter((i) => i.id !== id);
}

export async function searchIdeas(query: string): Promise<Idea[]> {
  await delay(300);
  const q = query.toLowerCase();
  return store.filter(
    (i) =>
      i.transcription.toLowerCase().includes(q) ||
      i.manualNote.toLowerCase().includes(q) ||
      i.tags.some((t) => t.toLowerCase().includes(q)),
  );
}
