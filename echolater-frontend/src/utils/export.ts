import type { Idea } from '@/types';

export function exportAsJSON(ideas: Idea[]): void {
  const data = ideas.map(({ audioBlobUrl: _b, ...rest }) => rest); // strip blob URLs
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, 'echolater-ideas.json', 'application/json');
}

export function exportAsCSV(ideas: Idea[]): void {
  const headers = [
    'id',
    'transcription',
    'manualNote',
    'timeCategory',
    'tags',
    'isCompleted',
    'extractedTime',
    'audioDuration',
    'createdAt',
  ];

  const rows = ideas.map((idea) => [
    idea.id,
    `"${idea.transcription.replace(/"/g, '""')}"`,
    `"${idea.manualNote.replace(/"/g, '""')}"`,
    idea.timeCategory,
    `"${idea.tags.join(', ')}"`,
    idea.isCompleted,
    idea.extractedTime ?? '',
    idea.audioDuration,
    idea.createdAt,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadFile(csv, 'echolater-ideas.csv', 'text/csv');
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
