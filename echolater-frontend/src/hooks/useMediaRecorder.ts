import { useRef, useCallback, useEffect } from 'react';
import { useRecordStore } from '@/stores/useRecordStore';
import { toast } from '@/components/ui/use-toast';

const MAX_DURATION_SECONDS = 300; // 5 minutes

export function useMediaRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const { state, duration, setState, setDuration, setAudioBlob, setWaveformData, reset } =
    useRecordStore();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopAll() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
    }
  }

  function startWaveformCapture(stream: MediaStream) {
    const audioCtx = new AudioContext();
    audioCtxRef.current = audioCtx;
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      const bars = 30;
      const step = Math.floor(bufferLength / bars);
      const waveform = Array.from({ length: bars }, (_, i) => {
        const slice = dataArray.slice(i * step, (i + 1) * step);
        const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
        return avg / 255;
      });
      setWaveformData(waveform);
    }
    draw();
  }

  const startRecording = useCallback(async () => {
    if (state === 'recording') return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      chunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        setState('stopped');
      };

      recorder.start(100); // collect data every 100ms
      setState('recording');
      startWaveformCapture(stream);

      let elapsed = 0;
      setDuration(0);
      intervalRef.current = setInterval(() => {
        elapsed += 1;
        setDuration(elapsed);
        if (elapsed >= MAX_DURATION_SECONDS) {
          stopRecording();
        }
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      if (msg.includes('Permission') || msg.includes('NotAllowed')) {
        toast({
          variant: 'destructive',
          title: 'Microphone access denied',
          description: 'Please allow microphone access in your browser settings.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Recording failed',
          description: 'Could not start recording. Please try again.',
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const stopRecording = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
    }
    setWaveformData(new Array(30).fill(0));
  }, [setWaveformData]);

  const cancelRecording = useCallback(() => {
    stopAll();
    reset();
  }, [reset]);

  return {
    state,
    duration,
    startRecording,
    stopRecording,
    cancelRecording,
  };
}
