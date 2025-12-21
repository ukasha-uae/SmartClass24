import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LabNote {
  labId: string;
  content: string;
  lastModified: string;
  createdAt: string;
}

interface LabNotesState {
  notes: Record<string, LabNote>;
  saveNote: (labId: string, content: string) => void;
  getNote: (labId: string) => LabNote | undefined;
  deleteNote: (labId: string) => void;
  getAllNotes: () => LabNote[];
}

export const useLabNotes = create<LabNotesState>()(
  persist(
    (set, get) => ({
      notes: {},
      
      saveNote: (labId: string, content: string) => {
        const now = new Date().toISOString();
        const existingNote = get().notes[labId];
        
        set((state) => ({
          notes: {
            ...state.notes,
            [labId]: {
              labId,
              content,
              lastModified: now,
              createdAt: existingNote?.createdAt || now,
            },
          },
        }));
      },
      
      getNote: (labId: string) => {
        return get().notes[labId];
      },
      
      deleteNote: (labId: string) => {
        set((state) => {
          const newNotes = { ...state.notes };
          delete newNotes[labId];
          return { notes: newNotes };
        });
      },
      
      getAllNotes: () => {
        return Object.values(get().notes);
      },
    }),
    {
      name: 'lab-notes-storage',
    }
  )
);
