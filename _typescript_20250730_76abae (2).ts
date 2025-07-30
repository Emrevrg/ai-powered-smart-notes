import { useState } from 'react';
import { useNotesStore } from './store/useNotesStore';
import { MarkdownEditor } from './components/MarkdownEditor';
import { NoteList } from './components/NoteList';
import { AiOutlinePlus, AiOutlineLoading3Quarters } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const App = () => {
  const {
    notes,
    currentNoteId,
    addNote,
    updateNote,
    deleteNote,
    pinNote,
    getCurrentNote,
    processWithAI,
    isLoading
  } = useNotesStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const currentNote = getCurrentNote();
  
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddNote = () => {
    const title = `New Note ${notes.length + 1}`;
    addNote(title);
    toast.success('Note created successfully');
  };
  
  const handleAIRequest = async (action: string) => {
    await processWithAI(action);
    toast.info(`Note ${action}d with AI`);
  };
  
  return (
    <div className="app-container flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="sidebar w-64 bg-white border-r p-4 flex flex-col">
        <div className="search mb-4">
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button
          onClick={handleAddNote}
          className="flex items-center justify-center mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          <AiOutlinePlus className="mr-2" />
          New Note
        </button>
        
        <div className="notes-list flex-1 overflow-y-auto">
          <NoteList
            notes={filteredNotes}
            currentNoteId={currentNoteId}
            onSelectNote={(id) => useNotesStore.setState({ currentNoteId: id })}
            onDeleteNote={deleteNote}
            onPinNote={pinNote}
          />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content flex-1 flex flex-col">
        {currentNote ? (
          <>
            <div className="note-header p-4 border-b flex justify-between items-center">
              <input
                type="text"
                value={currentNote.title}
                onChange={(e) =>
                  updateNote(currentNote.id, { title: e.target.value })
                }
                className="text-xl font-semibold p-1 border-b focus:outline-none focus:border-blue-500"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => pinNote(currentNote.id)}
                  className={`p-2 rounded ${currentNote.isPinned ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100'}`}
                >
                  {currentNote.isPinned ? 'Pinned' : 'Pin'}
                </button>
                <button
                  onClick={() => deleteNote(currentNote.id)}
                  className="p-2 bg-red-100 text-red-600 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
            
            <div className="editor-container flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-500" />
                </div>
              ) : (
                <MarkdownEditor
                  initialContent={currentNote.content}
                  onContentChange={(content) =>
                    updateNote(currentNote.id, { content })
                  }
                  onAIRequest={handleAIRequest}
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <h2 className="text-2xl mb-2">No Note Selected</h2>
              <p>Select a note or create a new one</p>
            </div>
          </div>
        )}
      </div>
      
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};