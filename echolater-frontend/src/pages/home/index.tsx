import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { IdeaCard } from '@/components/idea-card/IdeaCard';
import { useIdeaStore } from '@/stores/useIdeaStore';
import type { TimeCategory } from '@/types';
import { cn } from '@/lib/utils';

const TABS: { value: TimeCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'thisWeek', label: 'This Week' },
  { value: 'future', label: 'Future' },
  { value: 'inbox', label: 'Inbox' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { ideas, loading, fetchIdeas } = useIdeaStore();
  const [activeTab, setActiveTab] = useState<TimeCategory | 'all'>('all');

  useEffect(() => {
    fetchIdeas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = activeTab === 'all' ? ideas : ideas.filter((i) => i.timeCategory === activeTab);
  const incomplete = filtered.filter((i) => !i.isCompleted);
  const completed = filtered.filter((i) => i.isCompleted);

  const countFor = (tab: TimeCategory | 'all') => {
    const list = tab === 'all' ? ideas : ideas.filter((i) => i.timeCategory === tab);
    return list.filter((i) => !i.isCompleted).length;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary md:hidden" />
            <h1 className="font-semibold text-base">My Ideas</h1>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fetchIdeas()}
              disabled={loading}
              aria-label="Refresh"
            >
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/app/search')}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 pb-3 overflow-x-auto scrollbar-none">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="w-max gap-1 bg-transparent p-0 h-auto">
              {TABS.map(({ value, label }) => {
                const count = countFor(value);
                return (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className={cn(
                      'rounded-full px-3 py-1.5 text-xs font-medium border border-transparent',
                      'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary',
                      'data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground',
                    )}
                  >
                    {label}
                    {count > 0 && (
                      <span className="ml-1.5 rounded-full bg-background/20 px-1.5 py-0.5 text-[10px] tabular-nums">
                        {count}
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {loading && ideas.length === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-4xl mb-3">🎤</div>
            <p className="text-muted-foreground text-sm">
              {activeTab === 'all'
                ? 'No ideas yet. Tap the mic button to record your first one!'
                : `No ideas in "${TABS.find((t) => t.value === activeTab)?.label}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-w-2xl">
            {/* Incomplete */}
            {incomplete.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}

            {/* Completed section */}
            {completed.length > 0 && (
              <details className="group">
                <summary className="flex items-center gap-2 cursor-pointer py-2 text-xs text-muted-foreground select-none list-none">
                  <span className="flex-1 border-t border-dashed border-border" />
                  <span>Completed ({completed.length})</span>
                  <span className="flex-1 border-t border-dashed border-border" />
                </summary>
                <div className="mt-3 space-y-3">
                  {completed.map((idea) => (
                    <IdeaCard key={idea.id} idea={idea} />
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
