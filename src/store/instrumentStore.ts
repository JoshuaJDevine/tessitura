import { create } from 'zustand';
import { Instrument } from '@/types';
import { persist, createJSONStorage } from 'zustand/middleware';

interface InstrumentStore {
  instruments: Instrument[];
  addInstrument: (instrument: Omit<Instrument, 'id' | 'metadata' | 'position'>) => void;
  updateInstrument: (id: string, updates: Partial<Instrument>) => void;
  deleteInstrument: (id: string) => void;
  getInstrument: (id: string) => Instrument | undefined;
  createPairing: (id1: string, id2: string) => void;
  removePairing: (id1: string, id2: string) => void;
  markAsUsed: (id: string) => void;
}

const defaultColors: Record<string, string> = {
  Orchestral: '#3b82f6',
  Synth: '#8b5cf6',
  Drums: '#ef4444',
  Effects: '#10b981',
  Keys: '#f59e0b',
  World: '#ec4899',
  Vocal: '#06b6d4',
  Other: '#6b7280',
};

export const useInstrumentStore = create<InstrumentStore>()(
  persist(
    (set, get) => ({
      instruments: [],

      addInstrument: (instrumentData) => {
        const newInstrument: Instrument = {
          ...instrumentData,
          id: crypto.randomUUID(),
          position: { x: Math.random() * 800, y: Math.random() * 600 },
          pairings: [],
          color: defaultColors[instrumentData.category] || defaultColors.Other,
          metadata: {
            createdAt: new Date(),
            usageCount: 0,
          },
        };
        set((state) => ({
          instruments: [...state.instruments, newInstrument],
        }));
      },

      updateInstrument: (id, updates) => {
        set((state) => ({
          instruments: state.instruments.map((inst) =>
            inst.id === id ? { ...inst, ...updates } : inst
          ),
        }));
      },

      deleteInstrument: (id) => {
        set((state) => {
          const instrument = state.instruments.find((inst) => inst.id === id);
          if (!instrument) return state;

          // Remove all pairings with this instrument
          const updatedInstruments = state.instruments
            .filter((inst) => inst.id !== id)
            .map((inst) => ({
              ...inst,
              pairings: inst.pairings.filter((pairId) => pairId !== id),
            }));

          return { instruments: updatedInstruments };
        });
      },

      getInstrument: (id) => {
        return get().instruments.find((inst) => inst.id === id);
      },

      createPairing: (id1, id2) => {
        if (id1 === id2) return;

        set((state) => ({
          instruments: state.instruments.map((inst) => {
            if (inst.id === id1 && !inst.pairings.includes(id2)) {
              return { ...inst, pairings: [...inst.pairings, id2] };
            }
            if (inst.id === id2 && !inst.pairings.includes(id1)) {
              return { ...inst, pairings: [...inst.pairings, id1] };
            }
            return inst;
          }),
        }));
      },

      removePairing: (id1, id2) => {
        set((state) => ({
          instruments: state.instruments.map((inst) => {
            if (inst.id === id1) {
              return { ...inst, pairings: inst.pairings.filter((id) => id !== id2) };
            }
            if (inst.id === id2) {
              return { ...inst, pairings: inst.pairings.filter((id) => id !== id1) };
            }
            return inst;
          }),
        }));
      },

      markAsUsed: (id) => {
        set((state) => ({
          instruments: state.instruments.map((inst) =>
            inst.id === id
              ? {
                  ...inst,
                  metadata: {
                    ...inst.metadata,
                    lastUsed: new Date(),
                    usageCount: inst.metadata.usageCount + 1,
                  },
                }
              : inst
          ),
        }));
      },
    }),
    {
      name: 'instrument-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ instruments: state.instruments }),
    }
  )
);

