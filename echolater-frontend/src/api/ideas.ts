import { apiClient } from '@/lib/http';
import type { Idea, TimeCategory } from '@/types';

interface BackendIdea {
  id: string;
  audioUrl: string;
  audioDuration: number;
  transcription: string;
  extractedTime: string | null;
  timeCategory: string;
  tags: string[];
  isCompleted: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

interface PagedIdeasData {
  ideas: BackendIdea[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

function normalizeCategory(value: string): TimeCategory {
  if (value === 'today' || value === 'thisWeek' || value === 'future' || value === 'inbox') {
    return value;
  }
  return 'inbox';
}

function mapIdea(idea: BackendIdea, overrides?: Partial<Idea>): Idea {
  return {
    id: idea.id,
    audioUrl: idea.audioUrl ?? null,
    audioBlobUrl: null,
    audioDuration: idea.audioDuration ?? 0,
    transcription: idea.transcription ?? '',
    manualNote: '',
    extractedTime: idea.extractedTime ?? null,
    timeCategory: normalizeCategory(idea.timeCategory),
    tags: Array.isArray(idea.tags) ? idea.tags : [],
    isCompleted: Boolean(idea.isCompleted),
    completedAt: idea.completedAt ?? null,
    createdAt: idea.createdAt,
    updatedAt: idea.updatedAt,
    ...overrides,
  };
}

async function fetchIdeasPage(page: number, limit: number): Promise<PagedIdeasData> {
  const res = await apiClient.get<ApiEnvelope<PagedIdeasData>>('/ideas', {
    params: { page, limit },
  });
  return res.data.data;
}

export async function fetchIdeas(): Promise<Idea[]> {
  const limit = 50;
  const first = await fetchIdeasPage(1, limit);
  let all = [...first.ideas];

  for (let page = 2; page <= first.pagination.totalPages; page += 1) {
    const next = await fetchIdeasPage(page, limit);
    all = all.concat(next.ideas);
  }

  return all.map((idea) => mapIdea(idea));
}

export async function fetchIdeaById(id: string): Promise<Idea | null> {
  try {
    const res = await apiClient.get<ApiEnvelope<{ idea: BackendIdea }>>(`/ideas/${id}`);
    return mapIdea(res.data.data.idea);
  } catch {
    return null;
  }
}

export async function createIdea(payload: {
  audioBlob: Blob | null;
  audioDuration: number;
  manualNote: string;
}): Promise<Idea> {
  if (!payload.audioBlob) {
    throw new Error('Audio is required');
  }

  const formData = new FormData();
  const file = new File([payload.audioBlob], `recording-${Date.now()}.webm`, {
    type: payload.audioBlob.type || 'audio/webm',
  });
  formData.append('audio', file);
  if (payload.manualNote.trim()) {
    formData.append('manualNote', payload.manualNote.trim());
  }

  const res = await apiClient.post<ApiEnvelope<{ idea: BackendIdea }>>('/ideas', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  const mapped = mapIdea(res.data.data.idea, {
    manualNote: payload.manualNote.trim(),
  });

  if (mapped.audioDuration === 0 && payload.audioDuration > 0) {
    mapped.audioDuration = payload.audioDuration;
  }

  return mapped;
}

export async function updateIdea(id: string, data: Partial<Idea>): Promise<Idea> {
  const payload: Record<string, unknown> = {};

  if (typeof data.transcription === 'string') payload.transcription = data.transcription;
  if (typeof data.extractedTime === 'string') payload.extractedTime = data.extractedTime;
  if (typeof data.timeCategory === 'string') payload.timeCategory = data.timeCategory;
  if (Array.isArray(data.tags)) payload.tags = data.tags;
  if (typeof data.isCompleted === 'boolean') payload.isCompleted = data.isCompleted;

  if (Object.keys(payload).length === 0) {
    const current = await fetchIdeaById(id);
    if (!current) throw new Error('Idea not found');
    return {
      ...current,
      manualNote: typeof data.manualNote === 'string' ? data.manualNote : current.manualNote,
    };
  }

  const res = await apiClient.put<ApiEnvelope<{ idea: BackendIdea }>>(`/ideas/${id}`, payload);
  return mapIdea(res.data.data.idea, {
    manualNote: typeof data.manualNote === 'string' ? data.manualNote : '',
  });
}

export async function deleteIdea(id: string): Promise<void> {
  await apiClient.delete(`/ideas/${id}`);
}

export async function searchIdeas(query: string): Promise<Idea[]> {
  const res = await apiClient.get<ApiEnvelope<PagedIdeasData>>('/ideas', {
    params: { search: query, page: 1, limit: 50 },
  });
  return res.data.data.ideas.map((idea) => mapIdea(idea));
}
