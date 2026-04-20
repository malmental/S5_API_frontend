import { useState, useEffect } from 'react';

export default function IncidenceForm({ initialData = null, onSubmit, onCancel, loading = false, isEdit = false }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('open');
  const [tags, setTags] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'medium');
      setStatus(initialData.status || 'open');
      setTags(initialData.tags?.map(t => t.name).join(', ') || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block font-mono text-xs uppercase mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-4 py-3 ${errors.title ? 'border-error' : 'border-black'} bg-surface font-mono text-sm`}
          placeholder="INCIDENCE TITLE"
        />
        {errors.title && (
          <p className="font-mono text-xs text-error mt-1">{errors.title}</p>
        )}
      </div>
      <div>
        <label htmlFor="description" className="block font-mono text-xs uppercase mb-2">
          Description *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className={`w-full px-4 py-3 ${errors.description ? 'border-error' : 'border-black'} bg-surface font-mono text-sm resize-none`}
          placeholder="DETAILED INCIDENCE DESCRIPTION..."
        />
        {errors.description && (
          <p className="font-mono text-xs text-error mt-1">{errors.description}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block font-mono text-xs uppercase mb-2">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-3 bg-surface font-mono text-sm"
            >
              <option value="high">HIGH</option>
              <option value="medium">MEDIUM</option>
              <option value="low">LOW</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block font-mono text-xs uppercase mb-2">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 bg-surface font-mono text-sm"
            >
              <option value="open">OPEN</option>
              <option value="in_progress">IN PROGRESS</option>
              <option value="closed">CLOSED</option>
            </select>
          </div>
        </div>

      <div>
        <label htmlFor="tags" className="block font-mono text-xs uppercase mb-2">
          Tags
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-3 bg-surface font-mono text-sm"
          placeholder="server, urgent, backend (comma separated)"
        />
        <p className="font-mono text-[10px] text-gray-500 mt-1">
          Separate tags with commas
        </p>
      </div>
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