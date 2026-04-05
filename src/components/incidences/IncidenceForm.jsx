/**
 * ============================================================
 * COMPONENTE: IncidenceForm (Formulario de Incidencia)
 * ============================================================
 * Descripción: 
 *   Formulario para crear o editar una incidencia.
 *   Incluye campos para título, descripción, prioridad y etiquetas.
 * 
 * Ubicación: src/components/incidences/IncidenceForm.jsx
 * 
 * Props:
 *   - initialData: Datos iniciales (para edición)
 *   - onSubmit: Función callback al enviar
 *   - onCancel: Función callback al cancelar
 *   - loading: Estado de carga
 *   - isEdit: Booleano si es edición (cambia texto del botón)
 * 
 * Campos del formulario:
 *   - title: Título de la incidencia (requerido)
 *   - description: Descripción detallada (requerido)
 *   - priority: Prioridad (low, medium, high)
 *   - status: Estado (open, in_progress, closed)
 *   - tags: Etiquetas separadas por coma
 * 
 * Notas técnicas:
 *   - Usa estados controlados con useState
 *   - Validación básica de campos requeridos
 *   - Los campos priority y status solo visibles en edición
 *   - Estilo con bordes negros 2px
 * ============================================================
 */

import { useState, useEffect } from 'react';

export default function IncidenceForm({ initialData = null, onSubmit, onCancel, loading = false, isEdit = false }) {
  // ============================================================
  // ESTADOS DEL FORMULARIO
  // ============================================================
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('open');
  const [tags, setTags] = useState('');
  const [errors, setErrors] = useState({});

  // ============================================================
  // EFECTO: Cargar datos iniciales (para edición)
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
  // HANDLER: Validación y envío
  // ============================================================
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'El título es requerido';
    if (!description.trim()) newErrors.description = 'La descripción es requerida';
    
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
        FORMULARIO
        Layout: Vertical con espacios
       ============================================================ */
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* ============================================================
          CAMPO: Título
          Etiqueta + Input
          Validación: Required
       ============================================================ */}
      <div>
        <label htmlFor="title" className="block font-mono text-xs uppercase mb-2">
          Título *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full px-4 py-3 ${errors.title ? 'border-error' : 'border-black'} bg-surface focus:outline-none focus:border-1 focus:border-primary transition-all font-mono text-sm`}
          placeholder="TÍTULO DE LA INCIDENCIA"
        />
        {errors.title && (
          <p className="font-mono text-xs text-error mt-1">{errors.title}</p>
        )}
      </div>

      {/* ============================================================
          CAMPO: Descripción
          Textarea multilínea
       ============================================================ */}
      <div>
        <label htmlFor="description" className="block font-mono text-xs uppercase mb-2">
          Descripción *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className={`w-full px-4 py-3 ${errors.description ? 'border-error' : 'border-black'} bg-surface focus:outline-none focus:border-1 focus:border-primary transition-all font-mono text-sm resize-none`}
          placeholder="DESCRIPCIÓN DETALLADA DE LA INCIDENCIA..."
        />
        {errors.description && (
          <p className="font-mono text-xs text-error mt-1">{errors.description}</p>
        )}
      </div>

      {/* ============================================================
          FILA: Prioridad y Estado
       ============================================================ */}
      <div className="grid grid-cols-2 gap-4">
          {/* Prioridad */}
          <div>
            <label htmlFor="priority" className="block font-mono text-xs uppercase mb-2">
              Prioridad
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-3 bg-surface focus:outline-none focus:border-1 focus:border-primary transition-all font-mono text-sm"
            >
              <option value="high">ALTA</option>
              <option value="medium">MEDIA</option>
              <option value="low">BAJA</option>
            </select>
          </div>

          {/* Estado */}
          <div>
            <label htmlFor="status" className="block font-mono text-xs uppercase mb-2">
              Estado
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 bg-surface focus:outline-none focus:border-1 focus:border-primary transition-all font-mono text-sm"
            >
              <option value="open">ABIERTA</option>
              <option value="in_progress">EN PROCESO</option>
              <option value="closed">CERRADA</option>
            </select>
          </div>
        </div>

      {/* ============================================================
          CAMPO: Etiquetas
          Input de texto con ejemplo
       ============================================================ */}
      <div>
        <label htmlFor="tags" className="block font-mono text-xs uppercase mb-2">
          Etiquetas
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-4 py-3 bg-surface focus:outline-none focus:border-1 focus:border-primary transition-all font-mono text-sm"
          placeholder="server, urgent, backend (separadas por coma)"
        />
        <p className="font-mono text-[10px] text-gray-500 mt-1">
          Separe las etiquetas con comas
        </p>
      </div>

      {/* ============================================================
          BOTONES DE ACCIÓN
          Cancelar + Enviar
       ============================================================ */}
      <div className="flex justify-end gap-4 pt-4 border-t-2 border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border-2 border-black font-sans font-bold uppercase text-sm hover:bg-gray-100 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary text-on-primary font-sans font-bold uppercase text-sm hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'PROCESANDO...' : isEdit ? 'ACTUALIZAR' : 'CREAR INCIDENCIA'}
        </button>
      </div>
    </form>
  );
}