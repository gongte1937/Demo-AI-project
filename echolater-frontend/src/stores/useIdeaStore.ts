import { create } from 'zustand';
import type { Idea } from '@/types';
import * as api from '@/api/ideas';

interface IdeaState {
  ideas: Idea[];
  loading: boolean;
  error: string | null;

  fetchIdeas: () => Promise<void>;
  addIdea: (idea: Idea) => void;
  updateIdea: (id: string, data: Partial<Idea>) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
}

export const useIdeaStore = create<IdeaState>((set, get) => ({
  ideas: [],
  loading: false,
  error: null,

  fetchIdeas: async () => {
    set({ loading: true, error: null });
    try {
      const ideas = await api.fetchIdeas();
      set({ ideas, loading: false });
    } catch (e) {
      set({ error: 'Failed to load ideas', loading: false });
    }
  },

  addIdea: (idea) => {
    set((s) => ({ ideas: [idea, ...s.ideas] }));
  },

  updateIdea: async (id, data) => {
    const updated = await api.updateIdea(id, data);
    set((s) => ({ ideas: s.ideas.map((i) => (i.id === id ? updated : i)) }));
  },

  deleteIdea: async (id) => {
    await api.deleteIdea(id);
    set((s) => ({ ideas: s.ideas.filter((i) => i.id !== id) }));
  },

  toggleComplete: async (id) => {
    const idea = get().ideas.find((i) => i.id === id);
    if (!idea) return;
    const data: Partial<Idea> = {
      isCompleted: !idea.isCompleted,
      completedAt: !idea.isCompleted ? new Date().toISOString() : null,
    };
    await get().updateIdea(id, data);
  },
}));
