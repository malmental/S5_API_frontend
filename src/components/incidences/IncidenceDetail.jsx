/**
 * ============================================================
 * COMPONENTE: IncidenceDetail (Detalles de Incidencia)
 * ============================================================
 * Descripción: 
 *   Componente para mostrar los detalles de una incidencia
 *   en un modal. Muestra información completa y acciones.
 * 
 * Ubicación: src/components/incidences/IncidenceDetail.jsx
 * 
 * Props:
 *   - incidence: Objeto con datos de la incidencia
 *   - onClose: Función para cerrar el modal (opcional, se llama tras enviar comentario)
 * 
 * Información mostrada:
 *   - Título y descripción
 *   - Estado y prioridad (con badges visuales)
 *   - Usuario creador
 *   - Usuario asignado (si existe)
 *   - Etiquetas
 *   - Fechas de creación y actualización
 *   - Sección de comentarios
 * 
 * Notas técnicas:
 *   - Solo lectura - para editar usar IncidenceForm
 *   - Los badges de estado/prioridad tienen estilos específicos
 *   - Muestra "Cargando..." si incidence es null
 * ============================================================
 */

import { useState } from 'react';
import api from '../../services/api';

export default function IncidenceDetail({ incidence, onClose, showCommentForm = true }) {
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ============================================================
  // HELPERS: Obtener clase CSS según prioridad
  // ============================================================
  const getPriorityClass = (priority) => {
    if (priority === 'high' || priority === 'ALTA' || priority === 'alta') {
      return 'border-2 border-black px-2 py-1 text-xs uppercase bg-black text-white';
    }
    if (priority === 'medium' || priority === 'MEDIA' || priority === 'media') {
      return 'border-2 border-gray-400 px-2 py-1 text-xs uppercase bg-white';
    }
    return 'border-2 border-gray-300 px-2 py-1 text-xs uppercase bg-white';
  };

  // ============================================================
  // HELPERS: Obtener clase CSS según estado
  // ============================================================
  const getStatusClass = (status) => {
    if (status === 'open' || status === 'ABIERTA') {
      return 'border-2 border-black px-2 py-1 text-xs uppercase bg-white';
    }
    if (status === 'in_progress' || status === 'EN_PROCESO') {
      return 'border-2 border-black px-2 py-1 text-xs uppercase bg-white';
    }
    return 'border-2 border-gray-300 px-2 py-1 text-xs uppercase bg-white';
  };

  // ============================================================
  // HELPERS: Formatear fecha
  // ============================================================
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toISOString().slice(0, 19).replace('T', ' ');
  };

  // ============================================================
  // HANDLER: Submit comentario
  // ============================================================
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !incidence) return;

    setSubmitting(true);
    try {
      const { data } = await api.post(`/incidences/${incidence.id}/comments`, {
        body: commentText.trim()
      });
      setCommentText('');
      setSubmitting(false);
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Error al publicar el comentario');
      setSubmitting(false);
    }
  };

  // Si no hay incidencia, mostrar cargando
  if (!incidence) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="font-mono text-sm text-gray-500">CARGANDO DATOS...</p>
      </div>
    );
  }

  return (
    /* ============================================================
        CONTENEDOR PRINCIPAL
        Stack vertical con secciones
       ============================================================ */
    <div className="space-y-6">
      
      {/* ============================================================
          SECCIÓN 1: TÍTULO Y DESCRIPCIÓN
       ============================================================ */}
      <div>
        <h3 className="font-mono font-bold text-xl mb-2">
          {incidence.title || 'Sin título'}
        </h3>
        <p className="font-mono text-sm text-gray-600 whitespace-pre-wrap">
          {incidence.description || 'Sin descripción'}
        </p>
      </div>

      {/* ============================================================
          SECCIÓN 2: ESTADO Y PRIORIDAD
          Badges visuales
       ============================================================ */}
      <div className="flex gap-4">
        <span className={getStatusClass(incidence.status)}>
          {incidence.status || 'open'}
        </span>
        <span className={getPriorityClass(incidence.priority)}>
          {incidence.priority || 'medium'}
        </span>
      </div>

      {/* ============================================================
          SECCIÓN 3: INFORMACIÓN ADICIONAL
          Creador, Fechas (abajo)
       ============================================================ */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-surface-container-low border border-gray-200">
        {/* Primera fila: Creador, Fecha creación, Fecha actualización */}
        <div>
          <p className="font-mono text-[10px] uppercase text-gray-500">Creador</p>
          <p className="font-mono text-sm">
            {incidence.user?.name || 'Usuario desconocido'}
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase text-gray-500">Fecha creación</p>
          <p className="font-mono text-xs">
            {formatDate(incidence.created_at)}
          </p>
        </div>

        {/* Segunda fila: vacía y última actualización */}
        <div className="col-span-1"></div>

        <div>
          <p className="font-mono text-[10px] uppercase text-gray-500">Última actualización</p>
          <p className="font-mono text-xs">
            {formatDate(incidence.updated_at)}
          </p>
        </div>
      </div>

      {/* ============================================================
          SECCIÓN 4: ETIQUETAS
          Lista de etiquetas asociadas
       ============================================================ */}
      {incidence.tags && incidence.tags.length > 0 && (
        <div>
          <p className="font-mono text-xs uppercase text-gray-500 mb-2">Tags</p>
          <div className="flex flex-wrap gap-2">
            {incidence.tags.map((tag, index) => (
              <span 
                key={tag.id || index}
                className="px-2 py-1 text-xs bg-surface-dim text-gray-700"
              >
                #{tag.name || tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
          SECCIÓN 5: COMENTARIOS
       ============================================================ */}
      <div className="border-t-2 border-black pt-4">
        <h4 className="font-mono text-xs uppercase font-semibold mb-3">Comentarios</h4>
        
        {/* Lista de comentarios */}
        <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
          {incidence.comments && incidence.comments.length > 0 ? (
            incidence.comments.map((comment) => (
              <div key={comment.id} className="border border-gray-300 p-3 bg-surface-container-low relative">
                <div className="font-mono text-[10px] font-bold text-gray-600">
                  {comment.user?.name || 'Usuario'}
                </div>
                <div className="font-mono text-sm mt-1">
                  {comment.body || comment.content || comment.contenido}
                </div>
              </div>
            ))
          ) : (
            <p className="font-mono text-xs text-gray-500">Sin comentarios</p>
          )}
        </div>

        {/* Formulario para añadir comentario (solo si showCommentForm es true) */}
        {showCommentForm && (
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Añadir comentario..."
              className="w-full p-3 text-sm bg-surface-container-low border border-gray-300 resize-none"
              rows={3}
            />
            <button 
              type="submit" 
              disabled={submitting || !commentText.trim()}
              className="mt-2 px-4 py-2 border-2 border-black bg-black text-white text-xs uppercase hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'ENVIANDO...' : 'COMENTAR'}
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
