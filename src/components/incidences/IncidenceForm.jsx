/**
 * ============================================================
 * COMPONENT: IncidenceForm (Incidence Form)
 * ============================================================
 * Description: 
 *   Form to create or edit an incidence.
 *   Includes fields for title, description, priority and tags.
 * 
 * Location: src/components/incidences/IncidenceForm.jsx
 * 
 * Props:
 *   - initialData: Initial data (for editing)
 *   - onSubmit: Callback function on submit
 *   - onCancel: Callback function on cancel
 *   - loading: Loading state
 *   - isEdit: Boolean if editing (changes button text)
 * 
 * Form fields:
 *   - title: Incidence title (required)
 *   - description: Detailed description (required)
 *   - priority: Priority (low, medium, high)
 *   - status: Status (open, in_progress, closed)
 *   - tags: Comma-separated tags
 * 
 * Technical notes:
 *   - Uses controlled states with useState
 *   - Basic required field validation
 *   - Priority and status fields only visible in edit mode
 *   - Style with 2px black borders
 * ============================================================
 */

import { useState, useEffect } from 'react';

export default function IncidenceForm({ initialData = null, onSubmit, onCancel, loading = false, isEdit = false }) {
  // ============================================================
  // FORM STATES
  // ============================================================
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('open');
  const [tags, setTags] = useState('');
  const [errors, setErrors] = useState({});

  // ============================================================
  // EFFECT: Load initial data (for editing)
  // ============================================================
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'medium');
      setStatus(initialData.status || 'open');
      setTags(initialData.tags?.map(t => t.name).join(', ') || '');
    }
  }, [initialData]);

  // ============================================================
  // HANDLER: Validation and submit
  // ============================================================
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      tags: tags.trim(),
    });
  };

  return (
    /* ============================================================
        FORM
        Layout: Vertical with spacing
       ============================================================ */
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* ============================================================
          FIELD: Title
          Label + Input
          Validation: Required
       ============================================================ */}
      <div>
        <label htmlFor="title" className="block font-mono text-xs uppercase mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-4 py-3 ${errors.title ? 'border-error' : 'border-black'} bg-surface focus:outline-none focus:border-1 focus:border-primary transition-all font-mono text-sm`}
          placeholder="INCIDENCE TITLE"
        />
        {errors.title && (
          <p className="font-mono text-xs text-error mt-1">{errors.title}</p>
        )}
      </div>

      {/* ============================================================
          FIELD: Description
          Multiline textarea
       ============================================================ */}
      <div>
        <label htmlFor="description" className="block font-mono text-xs uppercase mb-2">
          Description *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className={`w-full px-4 py-3 ${errors.description ? 'border-error' : 'border-black'} bg-surface focus:outline-none focus:border-1 focus:border-primary transition-all font-mono text-sm resize-none`}
          placeholder="DETAILED INCIDENCE DESCRIPTION..."
        />
        {errors.description && (
          <p className="font-mono text-xs text-error mt-1">{errors.description}</p>
        )}
      </div>

      {/* ============================================================
          ROW: Priority and Status
       ============================================================ */}
      <div className="grid grid-cols-2 gap-4">
          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block font-mono text-xs uppercase mb-2">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-3 bg-surface focus:outline-none focus:border-1 focus:border-primary transition-all font-mono text-sm"
            >
              <option value="high">HIGH</option>
              <option value="medium">MEDIUM</option>
              <option value="low">LOW</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block font-mono text-xs uppercase mb-2">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 bg-surface focus:outline-none focus:border-1 focus:border-primary transition-all font-mono text-sm"
            >
              <option value="open">OPEN</option>
              <option value="in_progress">IN PROGRESS</option>
              <option value="closed">CLOSED</option>
            </select>
          </div>
        </div>

      {/* ============================================================
          FIELD: Tags
          Text input with example
       ============================================================ */}
      <div>
        <label htmlFor="tags" className="block font-mono text-xs uppercase mb-2">
          Tags
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-3 bg-surface focus:outline-none focus:border-1 focus:border-primary transition-all font-mono text-sm"
          placeholder="server, urgent, backend (comma separated)"
        />
        <p className="font-mono text-[10px] text-gray-500 mt-1">
          Separate tags with commas
        </p>
      </div>

      {/* ============================================================
          ACTION BUTTONS
          Cancel + Submit
       ============================================================ */}
      <div className="flex justify-end gap-4 pt-4 border-t-2 border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border-2 border-black font-sans font-bold uppercase text-sm hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary text-on-primary font-sans font-bold uppercase text-sm hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'PROCESSING...' : isEdit ? 'UPDATE' : 'CREATE INCIDENCE'}
        </button>
      </div>
    </form>
  );
}