import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Template } from '@/types';

interface TemplateStore {
  templates: Template[];
  addTemplate: (template: Omit<Template, 'id'>) => void;
  updateTemplate: (id: string, updates: Partial<Template>) => void;
  deleteTemplate: (id: string) => void;
  getTemplate: (id: string) => Template | undefined;
  loadTemplate: (id: string) => void;
}

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set, get) => ({
      templates: [],

      addTemplate: (templateData) => {
        const newTemplate: Template = {
          ...templateData,
          id: crypto.randomUUID(),
        };
        set((state) => ({
          templates: [...state.templates, newTemplate],
        }));
      },

      updateTemplate: (id, updates) => {
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id ? { ...template, ...updates } : template
          ),
        }));
      },

      deleteTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((template) => template.id !== id),
        }));
      },

      getTemplate: (id) => {
        return get().templates.find((template) => template.id === id);
      },

      loadTemplate: (id) => {
        const template = get().templates.find((t) => t.id === id);
        if (!template) return;

        const { useInstrumentStore } = require('@/store/instrumentStore');
        const instrumentStore = useInstrumentStore.getState();

        // Get current viewport center for placement
        const viewportCenter = { x: 400, y: 300 }; // Default, could be improved with ReactFlow instance

        // Create instruments from template
        // In a real implementation, we'd need to store instrument data in template
        // For now, this is a placeholder
        template.instruments.forEach(() => {
          // Placeholder for future implementation
        });

        // Create pairings
        template.pairings.forEach((pairing) => {
          instrumentStore.createPairing(pairing.from, pairing.to);
        });

        // Update positions based on layout
        Object.entries(template.layout).forEach(([instrumentId, position]) => {
          const adjustedPosition = {
            x: viewportCenter.x + position.x,
            y: viewportCenter.y + position.y,
          };
          instrumentStore.updateInstrument(instrumentId, { position: adjustedPosition });
        });
      },
    }),
    {
      name: 'template-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
