import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, Circle, Trash2, Tag, X, Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AudioPlayer } from '@/components/recorder/AudioPlayer';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { useIdeaStore } from '@/stores/useIdeaStore';
import { toast } from '@/components/ui/use-toast';
import { formatDateTime, CATEGORY_COLORS, CATEGORY_LABELS } from '@/utils/time';
import type { Idea, TimeCategory } from '@/types';

const CATEGORIES: TimeCategory[] = ['today', 'thisWeek', 'future', 'inbox'];

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { ideas, updateIdea, deleteIdea, toggleComplete } = useIdeaStore();
  const idea = ideas.find((i) => i.id === id);

  const [transcription, setTranscription] = useState('');
  const [manualNote, setManualNote] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState<TimeCategory>('inbox');
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (idea) {
      setTranscription(idea.transcription);
      setManualNote(idea.manualNote);
      setTags([...idea.tags]);
      setCategory(idea.timeCategory);
      setDirty(false);
    }
  }, [idea]);

  if (!idea) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">Idea not found.</p>
        <Button variant="outline" onClick={() => navigate('/app/home')}>
          Back to Home
        </Button>
      </div>
    );
  }

  const audioSrc = idea.audioBlobUrl ?? idea.audioUrl;

  function markDirty<T>(setter: (v: T) => void) {
    return (v: T) => { setter(v); setDirty(true); };
  }

  async function handleSave() {
    setSaving(true);
    const update: Partial<Idea> = {
      transcription,
      manualNote,
      tags,
      timeCategory: category,
    };
    await updateIdea(idea!.id, update);
    toast({ title: 'Changes saved' });
    setSaving(false);
    setDirty(false);
  }

  async function handleDelete() {
    await deleteIdea(idea!.id);
    toast({ title: 'Idea deleted' });
    navigate('/app/home');
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !tags.includes(t)) {
      const next = [...tags, t];
      setTags(next);
      setDirty(true);
    }
    setTagInput('');
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
    setDirty(true);
  }

  return (
    <>
      <div className="flex flex-col h-full max-w-2xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between px-4 h-14 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold text-sm">Edit Idea</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleComplete(idea.id)}
              aria-label={idea.isCompleted ? 'Mark incomplete' : 'Mark complete'}
            >
              {idea.isCompleted
                ? <CheckCircle2 className="h-5 w-5 text-primary" />
                : <Circle className="h-5 w-5 text-muted-foreground" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* Meta */}
          <p className="text-xs text-muted-foreground">
            Created {formatDateTime(idea.createdAt)}
            {idea.isCompleted && idea.completedAt && (
              <> · Completed {formatDateTime(idea.completedAt)}</>
            )}
          </p>

          {/* Audio player */}
          {audioSrc && (
            <div className="space-y-1.5">
              <Label>Recording</Label>
              <AudioPlayer src={audioSrc} duration={idea.audioDuration} />
            </div>
          )}

          {/* Transcription */}
          <div className="space-y-1.5">
            <Label htmlFor="transcription">Transcription</Label>
            <Textarea
              id="transcription"
              value={transcription}
              onChange={(e) => markDirty(setTranscription)(e.target.value)}
              rows={5}
              placeholder="AI transcription text…"
            />
          </div>

          {/* Manual note */}
          <div className="space-y-1.5">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              value={manualNote}
              onChange={(e) => markDirty(setManualNote)(e.target.value)}
              rows={2}
              placeholder="Any additional context…"
            />
          </div>

          {/* Time category */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Category
            </Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => markDirty(setCategory)(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition-all ${
                    category === cat
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-muted text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={`gap-1 ${CATEGORY_COLORS[category] || ''}`}
                >
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="ml-0.5 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag…"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="h-9 text-sm"
              />
              <Button variant="outline" size="sm" onClick={addTag} className="shrink-0 h-9">
                Add
              </Button>
            </div>
          </div>
        </div>

        {/* Save footer */}
        {dirty && (
          <div className="px-4 py-3 border-t border-border bg-card shrink-0">
            <Button className="w-full" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this idea?</DialogTitle>
            <DialogDescription>
              This will permanently delete this idea and its recording. This can't be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
