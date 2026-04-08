/**
 * ============================================================
 * COMPONENT: IncidenceDetail (Incidence Details)
 * ============================================================
 * Description: 
 *   Component to display the details of an incidence
 *   in a modal. Shows complete information and actions.
 * 
 * Location: src/components/incidences/IncidenceDetail.jsx
 * 
 * Props:
 *   - incidence: Object with incidence data
 *   - onClose: Function to close modal (optional, called after submitting comment)
 * 
 * Information displayed:
 *   - Title and description
 *   - Status and priority (with visual badges)
 *   - Creator user
 *   - Assigned user (if exists)
 *   - Tags
 *   - Creation and update dates
 *   - Comments section
 * 
 * Technical notes:
 *   - Read-only - use IncidenceForm for editing
 *   - Status/priority badges have specific styles
 *   - Shows "Loading..." if incidence is null
 * ============================================================
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { getPriorityClass, getStatusClass } from '../../utils/badgeHelpers';

export default function IncidenceDetail({ incidence, onClose, showCommentForm = true, isOwner = false, onEdit = null, onCommentAdded = null, onCommentDeleted = null }) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localIncidence, setLocalIncidence] = useState(incidence);

  useEffect(() => {
    setLocalIncidence(incidence);
  }, [incidence]);

  // ============================================================
  // HELPER: canDeleteComment
  // Checks if current user can delete a comment
  // ============================================================
  const canDeleteComment = (comment) => {
    if (!comment || !user) return false;
    return Number(comment.user_id ?? comment.user?.id) === Number(user.id);
  };

  // ============================================================
  // HANDLER: Delete comment
  // ============================================================
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await api.delete(`/comments/${commentId}`);
      const updatedIncidence = {
        ...localIncidence,
        comments: localIncidence.comments.filter(c => c.id !== commentId)
      };
      setLocalIncidence(updatedIncidence);
      if (onCommentDeleted) {
        onCommentDeleted(updatedIncidence);
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Error deleting comment');
    }
  };

  // ============================================================
  // HELPERS: Format date
  // ============================================================
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toISOString().slice(0, 19).replace('T', ' ');
  };

  // ============================================================
  // HANDLER: Comment submit
  // ============================================================
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !localIncidence) return;

    setSubmitting(true);
    try {
      const { data } = await api.post(`/incidences/${localIncidence.id}/comments`, {
        body: commentText.trim()
      });
      const newComment = data.data || data;
      const updatedIncidence = {
        ...localIncidence,
        comments: [...(localIncidence.comments || []), newComment]
      };
      setLocalIncidence(updatedIncidence);
      setCommentText('');
      if (onCommentAdded) {
        onCommentAdded(updatedIncidence);
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      alert('Error posting comment');
    } finally {
      setSubmitting(false);
    }
  };

  // If no incidence, show loading
  if (!localIncidence) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="font-mono text-sm text-gray-500">LOADING DATA...</p>
      </div>
    );
  }

  return (
    /* ============================================================
        MAIN CONTAINER
        Vertical stack with sections
       ============================================================ */
    <div className="space-y-6">
      
      {/* ============================================================
          SECTION 1: TITLE AND DESCRIPTION
       ============================================================ */}
      <div>
        <h3 className="font-mono font-bold text-xl mb-2">
          {localIncidence.title || 'Untitled'}
        </h3>
        <p className="font-mono text-sm text-gray-600 whitespace-pre-wrap">
          {localIncidence.description || 'No description'}
        </p>
      </div>

      {/* ============================================================
          SECTION 2: STATUS AND PRIORITY
          Visual badges
       ============================================================ */}
      <div className="flex gap-4">
        <span className={getStatusClass(localIncidence.status)}>
          {localIncidence.status || 'open'}
        </span>
        <span className={getPriorityClass(localIncidence.priority)}>
          {localIncidence.priority || 'medium'}
        </span>
      </div>

      {/* ============================================================
          SECTION 3: ADDITIONAL INFO
          Creator, Dates (below)
       ============================================================ */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-surface-container-low border border-gray-200">
        {/* First row: Creator, Creation date, Update date */}
        <div>
          <p className="font-mono text-[10px] uppercase text-gray-500">Creator</p>
          <p className="font-mono text-sm">
            {localIncidence.user?.name || 'Unknown user'}
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase text-gray-500">Created at</p>
          <p className="font-mono text-xs">
            {formatDate(localIncidence.created_at)}
          </p>
        </div>

        {/* Second row: empty and last update */}
        <div className="col-span-1"></div>

        <div>
          <p className="font-mono text-[10px] uppercase text-gray-500">Last updated</p>
          <p className="font-mono text-xs">
            {formatDate(localIncidence.updated_at)}
          </p>
        </div>
      </div>

      {/* ============================================================
          SECTION 4: TAGS
          List of associated tags
       ============================================================ */}
      {localIncidence.tags && localIncidence.tags.length > 0 && (
        <div>
          <p className="font-mono text-xs uppercase text-gray-500 mb-2">Tags</p>
          <div className="flex flex-wrap gap-2">
            {localIncidence.tags.map((tag, index) => (
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
          SECTION 5: COMMENTS
       ============================================================ */}
      <div className="border-t-2 border-black pt-4">
        <h4 className="font-mono text-xs uppercase font-semibold mb-3">Comments</h4>
        
        {/* Comment list */}
        <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
          {localIncidence.comments && localIncidence.comments.length > 0 ? (
            localIncidence.comments.map((comment) => (
              <div key={comment.id} className="border border-gray-300 p-3 bg-surface-container-low relative">
                {canDeleteComment(comment) && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="absolute top-2 right-2 text-xs font-bold text-gray-600 hover:text-red-700"
                    title="Delete comment"
                  >
                    &times;
                  </button>
                )}
                <div className="font-mono text-[10px] font-bold text-gray-600">
                  {comment.user?.name || 'User'}
                </div>
                <div className="font-mono text-sm mt-1 pr-6">
                  {comment.body || comment.content || comment.contenido}
                </div>
              </div>
            ))
          ) : (
            <p className="font-mono text-xs text-gray-500">No comments</p>
          )}
        </div>

        {/* Form to add comment (only if showCommentForm is true) */}
        {showCommentForm && (
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add comment..."
              className="w-full p-3 text-sm bg-surface-container-low border border-gray-300 resize-none"
              rows={3}
            />
            <button 
              type="submit" 
              disabled={submitting || !commentText.trim()}
              className="mt-2 px-4 py-2 bg-primary text-white text-xs uppercase hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'SENDING...' : 'COMMENT'}
            </button>
          </form>
        )}
      </div>

      {/* ============================================================
          SECTION 6: EDIT BUTTON (only for owner)
       ============================================================ */}
      {isOwner && onEdit && (
        <div className="pt-4 flex justify-center">
          <button
            onClick={() => onEdit(localIncidence)}
            className="px-12 py-3 bg-primary text-white font-mono font-bold uppercase text-sm hover:bg-neutral-800 transition-colors"
          >
            EDIT INCIDENCE
          </button>
        </div>
      )}

    </div>
  );
}
