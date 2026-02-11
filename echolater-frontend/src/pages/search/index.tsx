import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IdeaCard } from '@/components/idea-card/IdeaCard';
import { useIdeaStore } from '@/stores/useIdeaStore';
import { CATEGORY_LABELS } from '@/utils/time';
import type { TimeCategory } from '@/types';

const CATEGORY_FILTERS: (TimeCategory | 'all')[] = ['all', 'today', 'thisWeek', 'future', 'inbox'];

const SEARCH_HISTORY_KEY = 'echolater-search-history';
const MAX_HISTORY = 8;

function getHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) ?? '[]');
  } catch {
    return [];
  }
}
function saveHistory(q: string) {
  const prev = getHistory().filter((h) => h !== q);
  const next = [q, ...prev].slice(0, MAX_HISTORY);
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
}
function clearHistory() {
  localStorage.removeItem(SEARCH_HISTORY_KEY);
}

export default function SearchPage() {
  const navigate = useNavigate();
  const { ideas } = useIdeaStore();
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<TimeCategory | 'all'>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [history, setHistory] = useState<string[]>(getHistory);
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const trimmed = query.trim().toLowerCase();

  const results = trimmed
    ? ideas.filter((idea) => {
        const matchText =
          idea.transcription.toLowerCase().includes(trimmed) ||
          idea.manualNote.toLowerCase().includes(trimmed) ||
          idea.tags.some((t) => t.includes(trimmed));
        const matchCategory =
          categoryFilter === 'all' || idea.timeCategory === categoryFilter;
        const matchCompleted = showCompleted || !idea.isCompleted;
        return matchText && matchCategory && matchCompleted;
      })
    : [];

  function handleSearch(q: string) {
    setQuery(q);
    if (q.trim()) saveHistory(q.trim());
    setHistory(getHistory());
  }

  function handleClearHistory() {
    clearHistory();
    setHistory([]);
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {/* Search bar header */}
      <header className="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search ideas, notes, tags…"
            className="pl-9 pr-9"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? 'text-primary' : ''}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </header>

      {/* Filters */}
      {showFilters && (
        <div className="px-4 py-3 border-b border-border space-y-3 bg-muted/30">
          {/* Category filter */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_FILTERS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                    categoryFilter === cat
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Completed toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Show completed ideas</span>
          </label>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {!trimmed ? (
          /* Search history */
          history.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground font-medium">Recent searches</p>
                <button onClick={handleClearHistory} className="text-xs text-muted-foreground hover:text-foreground">
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map((h) => (
                  <button
                    key={h}
                    onClick={() => setQuery(h)}
                    className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-sm text-foreground hover:bg-muted/80"
                  >
                    <Search className="h-3 w-3 text-muted-foreground" />
                    {h}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">Type to search your ideas</p>
            </div>
          )
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground text-sm">
              No results for "<strong>{query}</strong>"
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            {results.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
