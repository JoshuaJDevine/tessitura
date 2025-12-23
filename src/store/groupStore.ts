import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { InstrumentGroup } from '@/types';

interface GroupStore {
  groups: InstrumentGroup[];
  addGroup: (group: Omit<InstrumentGroup, 'id'>) => void;
  updateGroup: (id: string, updates: Partial<InstrumentGroup>) => void;
  deleteGroup: (id: string) => void;
  getGroup: (id: string) => InstrumentGroup | undefined;
  toggleGroupCollapse: (id: string) => void;
  addInstrumentToGroup: (groupId: string, instrumentId: string) => void;
  removeInstrumentFromGroup: (groupId: string, instrumentId: string) => void;
}

export const useGroupStore = create<GroupStore>()(
  persist(
    (set, get) => ({
      groups: [],

      addGroup: (groupData) => {
        const newGroup: InstrumentGroup = {
          ...groupData,
          id: crypto.randomUUID(),
          collapsed: false,
        };
        set((state) => ({
          groups: [...state.groups, newGroup],
        }));
      },

      updateGroup: (id, updates) => {
        set((state) => ({
          groups: state.groups.map((group) => (group.id === id ? { ...group, ...updates } : group)),
        }));
      },

      deleteGroup: (id) => {
        set((state) => ({
          groups: state.groups.filter((group) => group.id !== id),
        }));
      },

      getGroup: (id) => {
        return get().groups.find((group) => group.id === id);
      },

      toggleGroupCollapse: (id) => {
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === id ? { ...group, collapsed: !group.collapsed } : group
          ),
        }));
      },

      addInstrumentToGroup: (groupId, instrumentId) => {
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === groupId && !group.instruments.includes(instrumentId)
              ? { ...group, instruments: [...group.instruments, instrumentId] }
              : group
          ),
        }));
      },

      removeInstrumentFromGroup: (groupId, instrumentId) => {
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === groupId
              ? { ...group, instruments: group.instruments.filter((id) => id !== instrumentId) }
              : group
          ),
        }));
      },
    }),
    {
      name: 'group-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
