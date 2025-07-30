import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

interface MarkdownEditorProps {
  initialContent?: string;
  onContentChange: (content: string) => void;
  onAIRequest?: (action: string) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialContent = '',
  onContentChange,
  onAIRequest
}) => {
  const [content, setContent] = useState(initialContent);
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Configure marked
  marked.setOptions({
    breaks: true,
    highlight: (code, lang) => {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  });

  useEffect(() => {
    if (isPreview && previewRef.current) {
      previewRef.current.innerHTML = marked(content);
    }
  }, [content, isPreview]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onContentChange(newContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && textareaRef.current) {
      e.preventDefault();
      const { selectionStart, selectionEnd } = textareaRef.current;
      const newContent =
        content.substring(0, selectionStart) +
        '  ' +
        content.substring(selectionEnd);
      
      setContent(newContent);
      onContentChange(newContent);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = selectionStart + 2;
          textareaRef.current.selectionEnd = selectionStart + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="editor-container border rounded-lg overflow-hidden">
      <div className="toolbar bg-gray-100 p-2 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setIsPreview(false)}
            className={`px-3 py-1 rounded ${!isPreview ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Edit
          </button>
          <button
            onClick={() => setIsPreview(true)}
            className={`px-3 py-1 rounded ${isPreview ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Preview
          </button>
        </div>
        {onAIRequest && (
          <div className="ai-tools flex space-x-2">
            <button
              onClick={() => onAIRequest('summarize')}
              className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm"
            >
              Summarize
            </button>
            <button
              onClick={() => onAIRequest('improve')}
              className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm"
            >
              Improve
            </button>
          </div>
        )}
      </div>
      
      {isPreview ? (
        <div
          ref={previewRef}
          className="preview p-4 h-96 overflow-y-auto prose max-w-none"
        />
      ) : (
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full p-4 h-96 font-mono text-sm focus:outline-none resize-none"
          placeholder="Start writing your note here..."
        />
      )}
    </div>
  );
};