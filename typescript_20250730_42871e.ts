import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AIService } from '../api/aiService';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
}

interface NotesState {
  notes: Note[];
  currentNoteId: string | null;
  isLoading: boolean;
  error: string | null;
  addNote: (title: string) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  pinNote: (id: string) => void;
  getCurrentNote: () => Note | null;
  processWithAI: (action: string) => Promise<void>;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      currentNoteId: null,
      isLoading: false,
      error: null,
      
      addNote: (title) => {
        const newNote: Note = {
          id: Date.now().toString(),
          title,
          content: '',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isPinned: false
        };
        
        set((state) => ({
          notes: [newNote, ...state.notes],
          currentNoteId: newNote.id
        }));
      },
      
      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date() }
              : note
          )
        }));
      },
      
      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
          currentNoteId:
            state.currentNoteId === id ? null : state.currentNoteId
        }));
      },
      
      pinNote: (id) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, isPinned: !note.isPinned }
              : note
          )
        }));
      },
      
      getCurrentNote: () => {
        const { notes, currentNoteId } = get();
        return notes.find((note) => note.id === currentNoteId) || null;
      },
      
      processWithAI: async (action) => {
        const { getCurrentNote, updateNote } = get();
        const currentNote = getCurrentNote();
        
        if (!currentNote) return;
        
        set({ isLoading: true, error: null });
        
        try {
          let result: string;
          
          switch (action) {
            case 'summarize':
              result = await AIService.summarizeText(currentNote.content);
              break;
            case 'improve':
              result = await AIService.improveText(currentNote.content);
              break;
            default:
              throw new Error('Invalid AI action');
          }
          
          updateNote(currentNote.id, { content: result });
        } catch (error) {
          set({ error: 'Failed to process with AI' });
          console.error(error);
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'neuro-notes-storage',
      partialize: (state) => ({ notes: state.notes }),
    }
  )
);