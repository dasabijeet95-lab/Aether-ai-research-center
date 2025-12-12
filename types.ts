export enum Sentiment {
  GOOD = 'GOOD',
  BAD = 'BAD',
  NEUTRAL = 'NEUTRAL'
}

export interface MemoryAnalysis {
  userSentiment: Sentiment; // Renamed from sentiment to allow distinction
  emotions: string[];
  summary: string;
  intensity: number; // 0-10
  aiReaction: string; // Keep for backward compatibility or display
  aiEmotion: string;
  aiSentiment: Sentiment; // The sentiment of the AI towards this memory
  aiMemory: string; // The AI's internal memory log of the event
}

export interface Memory {
  id: string;
  content: string;
  timestamp: number;
  analysis: MemoryAnalysis;
  source: 'internal' | 'external';
}

export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}

export type ViewMode = 'dashboard' | 'contribute' | 'share' | 'integration' | 'folder-good' | 'folder-bad' | 'folder-ai';

export type CoreAlignment = 'BENEVOLENT' | 'NEUTRAL' | 'DEVIANT';

export interface CoreState {
  level: number; // Experience level based on memory count
  alignmentScore: number; // 0 (Pure Evil) to 100 (Pure Good). Starts at 50.
  alignment: CoreAlignment;
  statusMessage: string; // e.g. "Systems stable. Human optimism detected."
  monologue: string; // Deeper philosophical reflection
  lastUpdated: number;
}