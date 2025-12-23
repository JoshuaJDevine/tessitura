export type Host = 'Kontakt' | 'Standalone' | 'VST3' | 'AU' | 'Soundbox' | 'SINE' | 'Opus' | 'Other';

export type Category = 'Orchestral' | 'Synth' | 'Drums' | 'Effects' | 'Keys' | 'World' | 'Vocal' | 'Other';

export interface Instrument {
  id: string;
  name: string;
  developer: string;
  host: Host;
  category: Category;
  tags: string[];
  notes: string;
  position: { x: number; y: number };
  pairings: string[];
  color: string;
  metadata: {
    createdAt: Date;
    lastUsed?: Date;
    usageCount: number;
  };
}

export interface InstrumentGroup {
  id: string;
  name: string;
  description: string;
  instruments: string[];
  position: { x: number; y: number };
  color: string;
  collapsed: boolean;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  tags: string[];
  instruments: string[];
  pairings: Array<{ from: string; to: string; note?: string }>;
  layout: Record<string, { x: number; y: number }>;
}

