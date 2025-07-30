import { FiPin } from 'react-icons/fi';
import { format } from 'date-fns';

interface NoteListProps {
  notes: Note[];
  currentNoteId: string | null;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onPinNote: (id: string) => void;
}

export const NoteList: React.FC<NoteListProps> = ({
  notes,
  currentNoteId,
  onSelectNote,
  onDeleteNote,
  onPinNote
}) => {
  const handlePinClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onPinNote(id);
  };

  return (
    <div className="space-y-2">
      {notes.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No notes found
        </div>
      ) : (
        notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onSelectNote(note.id)}
            className={`p-3 border rounded-lg cursor-pointer transition ${note.id === currentNoteId ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'}`}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium truncate">{note.title}</h3>
              <button
                onClick={(e) => handlePinClick(e, note.id)}
                className={`p-1 rounded-full ${note.isPinned ? 'text-yellow-500' : 'text-gray-300 hover:text-gray-500'}`}
              >
                <FiPin />
              </button>
            </div>
            <p className="text-sm text-gray-500 truncate mt-1">
              {note.content.substring(0, 60)}
              {note.content.length > 60 ? '...' : ''}
            </p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">
                {format(new Date(note.updatedAt), 'MMM d, yyyy')}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNote(note.id);
                }}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};