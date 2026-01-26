import React, { useState } from 'react';
import { X, PaperPlaneTilt } from '@phosphor-icons/react';
import { Button, Textarea, Skeleton } from '../ui';
import { formatDateTime, getInitials } from '../../lib/utils';
import type { ApplicationNote } from '../../types/api.types';

interface ApplicationNotesPanelProps {
  applicationId: number;
  notes?: ApplicationNote[];
  isLoading?: boolean;
  onClose: () => void;
  onAddNote: (content: string) => void;
  isAddingNote?: boolean;
}

const ApplicationNotesPanel: React.FC<ApplicationNotesPanelProps> = ({
  notes,
  isLoading,
  onClose,
  onAddNote,
  isAddingNote,
}) => {
  const [newNote, setNewNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      onAddNote(newNote);
      setNewNote('');
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 glass-card shadow-glass-lg z-50 flex flex-col animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100/50">
        <h3 className="font-semibold text-gray-900">Notes</h3>
        <button
          onClick={onClose}
          className="p-2 -m-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 rounded-xl transition-colors"
        >
          <X weight="bold" className="w-5 h-5" />
        </button>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          ))
        ) : notes && notes.length > 0 ? (
          notes.map((note) => (
            <div key={note.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-xs font-medium">
                    {getInitials(note.author.full_name)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {note.author.full_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(note.created_at)}
                  </p>
                </div>
              </div>
              <div className="bg-gray-100/80 rounded-lg p-3 ml-10">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {note.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No notes yet. Add one below.
          </div>
        )}
      </div>

      {/* Add Note Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100/50">
        <Textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
          rows={3}
          className="mb-3"
        />
        <Button
          type="submit"
          fullWidth
          isLoading={isAddingNote}
          disabled={!newNote.trim()}
          rightIcon={<PaperPlaneTilt weight="bold" className="w-4 h-4" />}
        >
          Add Note
        </Button>
      </form>
    </div>
  );
};

export default ApplicationNotesPanel;
