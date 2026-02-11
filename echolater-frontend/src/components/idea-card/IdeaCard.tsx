import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, MoreVertical, Trash2, Share2, Pencil, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useIdeaStore } from '@/stores/useIdeaStore';
import { toast } from '@/components/ui/use-toast';
import { formatDuration, formatRelativeTime, CATEGORY_COLORS, CATEGORY_LABELS } from '@/utils/time';
import { cn } from '@/lib/utils';
import type { Idea } from '@/types';

interface IdeaCardProps {
  idea: Idea;
}

export function IdeaCard({ idea }: IdeaCardProps) {
  const navigate = useNavigate();
  const { toggleComplete, deleteIdea } = useIdeaStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const audioSrc = idea.audioBlobUrl ?? idea.audioUrl;
  const isLong = idea.transcription.length > 120;
  const preview = isLong && !expanded
    ? idea.transcription.slice(0, 120) + '…'
    : idea.transcription;

  async function handleDelete() {
    setDeleting(true);
    await deleteIdea(idea.id);
    toast({ title: 'Idea deleted' });
    setConfirmDelete(false);
  }

  function handleShare() {
    navigator.clipboard.writeText(idea.transcription);
    toast({ title: 'Copied to clipboard' });
    setMenuOpen(false);
  }

  return (
    <>
      <Card
        className={cn(
          'animate-fade-in hover:-translate-y-0.5',
          idea.isCompleted && 'opacity-60',
        )}
      >
        <CardContent className="p-4">
          {/* Top row: complete toggle + time category + overflow menu */}
          <div className="flex items-start gap-3">
            <button
              onClick={() => toggleComplete(idea.id)}
              className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors"
              aria-label={idea.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {idea.isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              {/* Transcription */}
              <p
                className={cn(
                  'text-sm leading-relaxed',
                  idea.isCompleted && 'line-through text-muted-foreground',
                )}
              >
                {preview}
                {isLong && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="ml-1 text-primary text-xs font-medium"
                  >
                    {expanded ? 'less' : 'more'}
                  </button>
                )}
              </p>

              {/* Manual note */}
              {idea.manualNote && (
                <p className="mt-1 text-xs text-muted-foreground italic">{idea.manualNote}</p>
              )}

              {/* Meta row */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  className={cn('text-xs', CATEGORY_COLORS[idea.timeCategory])}
                  variant="outline"
                >
                  {CATEGORY_LABELS[idea.timeCategory]}
                </Badge>

                {idea.tags.map((tag) => (
                  <Badge key={tag} variant="muted" className="text-xs">
                    #{tag}
                  </Badge>
                ))}

                {audioSrc && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Play className="h-3 w-3" />
                    {formatDuration(idea.audioDuration)}
                  </span>
                )}

                <span className="ml-auto text-xs text-muted-foreground">
                  {formatRelativeTime(idea.createdAt)}
                </span>
              </div>
            </div>

            {/* Overflow menu */}
            <div className="relative shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-8 z-20 w-40 rounded-xl border border-border bg-card shadow-lg py-1 animate-fade-in">
                    <button
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                      onClick={() => { navigate(`/app/detail/${idea.id}`); setMenuOpen(false); }}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4" />
                      Copy text
                    </button>
                    <button
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                      onClick={() => { setConfirmDelete(true); setMenuOpen(false); }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete idea?</DialogTitle>
            <DialogDescription>
              This will permanently delete this idea and its recording. This can't be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting…' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
