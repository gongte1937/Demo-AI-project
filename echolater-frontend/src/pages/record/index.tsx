import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Square, Mic, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AudioPlayer } from '@/components/recorder/AudioPlayer';
import { Waveform } from '@/components/recorder/Waveform';
import { useMediaRecorder } from '@/hooks/useMediaRecorder';
import { useRecordStore } from '@/stores/useRecordStore';
import { useIdeaStore } from '@/stores/useIdeaStore';
import { toast } from '@/components/ui/use-toast';
import { formatDuration } from '@/utils/time';
import * as api from '@/api/ideas';
import { cn } from '@/lib/utils';

type SaveState = 'idle' | 'saving' | 'transcribing';

export default function RecordPage() {
  const navigate = useNavigate();
  const { state: recordState, duration, audioBlobUrl, audioBlob, reset } = useRecordStore();
  const { startRecording, stopRecording, cancelRecording } = useMediaRecorder();
  const { addIdea } = useIdeaStore();
  const [manualNote, setManualNote] = useState('');
  const [saveState, setSaveState] = useState<SaveState>('idle');

  const isRecording = recordState === 'recording';
  const hasStopped = recordState === 'stopped';

  async function handleSave() {
    setSaveState('transcribing');
    try {
      const idea = await api.createIdea({
        audioBlob,
        audioDuration: duration,
        manualNote,
      });
      addIdea(idea);
      toast({ variant: 'success' as any, title: 'Idea saved!', description: 'AI transcription complete.' });
      reset();
      navigate('/app/home');
    } catch {
      toast({ variant: 'destructive', title: 'Save failed', description: 'Please try again.' });
      setSaveState('idle');
    }
  }

  function handleCancel() {
    cancelRecording();
    navigate(-1);
  }

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 h-14 border-b border-border shrink-0">
        <Button variant="ghost" size="icon" onClick={handleCancel} aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-semibold">
          {recordState === 'idle' && 'New Recording'}
          {recordState === 'recording' && 'Recording…'}
          {recordState === 'stopped' && 'Review'}
        </h1>
      </header>

      {/* Main recording area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6 py-8">

        {/* Waveform */}
        <div className="w-full">
          <Waveform className="w-full" />
        </div>

        {/* Duration */}
        <div
          className={cn(
            'font-mono text-5xl font-light tabular-nums transition-colors',
            isRecording ? 'text-primary' : 'text-muted-foreground',
          )}
        >
          {formatDuration(duration)}
        </div>

        {/* Status message */}
        <p className="text-sm text-muted-foreground text-center">
          {recordState === 'idle' && 'Tap the button below to start recording'}
          {recordState === 'recording' && 'Tap to stop when you\'re done'}
          {recordState === 'stopped' && 'AI will transcribe and categorize your idea'}
        </p>

        {/* Audio preview after stop */}
        {hasStopped && audioBlobUrl && (
          <AudioPlayer src={audioBlobUrl} duration={duration} className="w-full" />
        )}

        {/* Manual note */}
        {hasStopped && (
          <div className="w-full space-y-2">
            <Label htmlFor="manual-note">Add a note (optional)</Label>
            <Textarea
              id="manual-note"
              placeholder="Any extra context for this idea…"
              value={manualNote}
              onChange={(e) => setManualNote(e.target.value)}
              rows={3}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="px-6 pb-8 pt-4 flex flex-col gap-3 shrink-0">
        {recordState === 'idle' && (
          <Button size="lg" className="w-full gap-2 h-14 text-base" onClick={startRecording}>
            <Mic className="h-5 w-5" />
            Start Recording
          </Button>
        )}

        {isRecording && (
          <Button
            size="lg"
            variant="destructive"
            className="w-full gap-2 h-14 text-base"
            onClick={stopRecording}
          >
            <Square className="h-5 w-5 fill-current" />
            Stop
          </Button>
        )}

        {hasStopped && (
          <>
            <Button
              size="lg"
              className="w-full gap-2 h-14 text-base"
              onClick={handleSave}
              disabled={saveState !== 'idle'}
            >
              {saveState === 'transcribing' ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Transcribing…
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Idea
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => { reset(); }}
              disabled={saveState !== 'idle'}
            >
              <RotateCcw className="h-4 w-4" />
              Record Again
            </Button>
          </>
        )}

        {(recordState === 'idle' || hasStopped) && (
          <Button variant="ghost" className="w-full" onClick={handleCancel} disabled={saveState !== 'idle'}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
