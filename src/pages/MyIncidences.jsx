/**
 * ============================================================
 * PAGE: MyIncidences
 * ============================================================
 * Description: 
 *   Page that shows incidences created by the logged-in user.
 *   Includes button to create new incidence (opens modal) and
 *   ability to view details of each incidence.
 * 
 * Location: src/pages/MyIncidences.jsx
 * 
 * Routing:
 *   - Accessible from /my-incidences
 *   - Requires authentication (protected)
 * 
 * Features:
 *   1. List of incidences for the current user
 *   2. Modal to create new incidence
 *   3. Modal to view incidence details
 *   4. Modal to edit incidence
 *   5. States: loading, empty, data
 * 
 * API Integration:
 *   - GET /incidences → List all (filter by user_id later)
 *   - POST /incidences → Create new
 *   - GET /incidences/:id → View details
 *   - PUT /incidences/:id → Update
 *   - DELETE /incidences/:id → Delete
 * 
 * Components used:
 *   - TopNavBar, SideNavBar, Footer (layout)
 *   - Modal (ui)
 *   - IncidenceForm (create/edit form)
 *   - IncidenceDetail (details view)
 * 
 * Technical notes:
 *   - Currently filters client-side (improve to server-side)
 *   - Edit modal reuses IncidenceForm
 *   - Deletion requires confirmation
 * ============================================================
 */

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import SideNavBar from '../components/layout/SideNavBar';
import Modal from '../components/ui/Modal';
import IncidenceForm from '../components/incidences/IncidenceForm';
import IncidenceDetail from '../components/incidences/IncidenceDetail';

export default function MyIncidences() {
  // ============================================================
  // COMPONENT STATES
  // ============================================================
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Data
  const [incidences, setIncidences] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal: Create new incidence
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  
  // Modal: View details
  const [selectedIncidence, setSelectedIncidence] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  
  // Modal: Edit incidence
  const [editingIncidence, setEditingIncidence] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 15, total: 0 });

  // ============================================================
  // EFFECT: Load incidences on mount and when page changes
  // ============================================================
  useEffect(() => {
    fetchIncidences(currentPage);
  }, [currentPage]);

  // ============================================================
  // FUNCTION: fetchIncidences
  // Description: Gets list of incidences for the authenticated user
  // ============================================================
  const fetchIncidences = async (page = 1) => {
    try {
      const { data } = await api.get(`/my-incidences?page=${page}`);
      setIncidences(data.data || []);
      if (data.meta) {
        setMeta(data.meta);
      }
    } catch (err) {
      console.error('Error fetching incidences:', err);
      setIncidences([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // HANDLER: handlePageChange
  // Description: Changes the pagination page
  // ============================================================
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ============================================================
  // HANDLER: handleLogout
  // ============================================================
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // ============================================================
  // HANDLER: handleCreate
  // Description: Create new incidence
  // ============================================================
  const handleCreate = async (formData) => {
    setCreating(true);
    try {
      await api.post('/incidences', formData);
      await fetchIncidences();
      setShowCreateModal(false);
    } catch (err) {
      console.error('Error creating incidence:', err);
      alert('Error creating incidence: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setCreating(false);
    }
  };

  // ============================================================
  // HANDLER: handleViewDetails
  // Description: View details of an incidence
  // ============================================================
  const handleViewDetails = async (incidence) => {
    setLoadingDetail(true);
    setSelectedIncidence(incidence);
    setShowDetailModal(true);
    
    // Load fresh data from API
    try {
      const { data } = await api.get(`/incidences/${incidence.id}`);
      setSelectedIncidence(data.data || data);
    } catch (err) {
      console.error('Error fetching incidence details:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // ============================================================
  // HANDLER: handleEdit
  // Description: Open edit modal
  // ============================================================
  const handleEdit = () => {
    setEditingIncidence(selectedIncidence);
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  // ============================================================
  // HANDLER: handleUpdate
  // Description: Update incidence
  // ============================================================
  const handleUpdate = async (formData) => {
    setUpdating(true);
    try {
      await api.put(`/incidences/${editingIncidence.id}`, formData);
      await fetchIncidences();
      setShowEditModal(false);
      setEditingIncidence(null);
      setShowDetailModal(false);
      setSelectedIncidence(null);
    } catch (err) {
      console.error('Error updating incidence:', err);
      alert('Error updating incidence: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setUpdating(false);
    }
  };

  // ============================================================
  // HANDLER: handleDelete
  // Description: Delete incidence
  // ============================================================
  const handleDelete = async () => {
    if (!selectedIncidence) return;
    
    if (!window.confirm('Are you sure you want to delete this incidence?')) {
      return;
    }
    
    try {
      await api.delete(`/incidences/${selectedIncidence.id}`);
      await fetchIncidences();
      setShowDetailModal(false);
      setSelectedIncidence(null);
    } catch (err) {
      console.error('Error deleting incidence:', err);
      alert('Error deleting incidence: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    /* ============================================================
        MAIN CONTAINER
        Layout: Flex column | Background: surface
       ============================================================ */
    <div className="flex flex-col min-h-screen bg-surface">
      
      {/* ============================================================
          SECTION 1: SIDE NAV BAR
          Side navigation bar
          Component: src/components/layout/SideNavBar.jsx
       ============================================================ */}
      <SideNavBar />
      
      {/* ============================================================
          SECTION 2: MAIN CONTENT
          Main area with incidence list
       ============================================================ */}
      <main className="ml-64 pt-0 min-h-screen relative">
        {/* Background pattern */}
        <div className="absolute inset-0 stippled-bg"></div>
        <div className="relative p-8 max-w-6xl">
          
          {/* ============================================================
              HEADER: Title + New button
              Title: "MY INCIDENCES"
              Button: "+ NEW INCIDENCE" → opens create modal
           ============================================================ */}
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="font-label text-xs uppercase border border-black px-2 py-0.5 bg-white">INCIDENCES MODULE</span>
              <h1 className="font-sans font-bold text-4xl mt-2">MY INCIDENCES</h1>
              <p className="font-label text-sm text-on-surface-variant mt-1">Incidences created by you</p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="font-sans font-bold uppercase tracking-wider bg-primary text-on-primary px-6 py-3 hover:bg-neutral-800 transition-colors"
            >
              + NEW INCIDENCE
            </button>
          </div>

          {/* ============================================================
              INCIDENCE LIST
              Table or message based on state
           ============================================================ */}
          {loading ? (
            <div className="border-2 border-black p-8 bg-white text-center">
              <p className="font-label text-sm">LOADING DATA...</p>
            </div>
          ) : incidences.length === 0 ? (
            <div className="p-8 bg-white text-center">
              <p className="font-label text-sm text-on-surface-variant">YOU HAVEN'T CREATED ANY INCIDENCES</p>
              <p className="font-label text-xs text-on-surface-variant mt-2">Click "+ NEW INCIDENCE" to create one</p>
            </div>
          ) : (
            /* Incidence list */
            <div className="bg-white">
              {/* Table header */}
              <div className="grid grid-cols-12 border-b-2 border-black bg-surface-container">
                <div className="col-span-1 px-4 py-3 font-label text-xs uppercase">ID</div>
                <div className="col-span-5 px-4 py-3 font-label text-xs uppercase">Title</div>
                <div className="col-span-2 px-4 py-3 font-label text-xs uppercase">Status</div>
                <div className="col-span-2 px-4 py-3 font-label text-xs uppercase">Priority</div>
                <div className="col-span-2 px-4 py-3 font-label text-xs uppercase text-right">Date</div>
              </div>
              
              {/* Data rows */}
              {incidences.map((incidence, index) => (
                <div 
                  key={incidence.id}
                  onClick={() => handleViewDetails(incidence)}
                  className={`grid grid-cols-12 cursor-pointer ${index !== incidences.length - 1 ? 'border-b border-gray-200' : ''} hover:bg-gray-50 transition-colors`}
                >
                  <div className="col-span-1 px-4 py-4 font-mono text-sm font-bold">
                    #{incidence.id}
                  </div>
                  <div className="col-span-5 px-4 py-4 font-sans font-medium">
                    {incidence.title}
                  </div>
                  <div className="col-span-2 px-4 py-4">
                    <span className={`font-mono text-xs px-2 py-1 border ${
                      incidence.status === 'open' 
                        ? 'border-black bg-white' 
                        : 'border-gray-300 bg-gray-100 text-gray-500'
                    }`}>
                      {incidence.status?.toUpperCase() || 'OPEN'}
                    </span>
                  </div>
                  <div className="col-span-2 px-4 py-4">
                    <span className={`font-mono text-xs px-2 py-1 ${
                      incidence.priority === 'high' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {incidence.priority?.toUpperCase() || 'MEDIUM'}
                    </span>
                  </div>
                  <div className="col-span-2 px-4 py-4 font-mono text-xs text-right text-gray-500">
                    {incidence.created_at ? new Date(incidence.created_at).toISOString().slice(0, 10).replace('T', '-') : '--'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {incidences.length > 0 && (
            <div className="px-6 py-4 bg-surface-dim border-t-2 border-black">
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  Showing page {currentPage} of {meta.last_page}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-black hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                  >
                    ««
                  </button>
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-black hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                  >
                    «
                  </button>
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === meta.last_page}
                    className="px-3 py-1 border border-black hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                  >
                    »
                  </button>
                  <button 
                    onClick={() => handlePageChange(meta.last_page)}
                    disabled={currentPage === meta.last_page}
                    className="px-3 py-1 border border-black hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                  >
                    »»
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ============================================================
          MODAL 1: CREATE NEW INCIDENCE
          Component: IncidenceForm
          Title: "CREATE INCIDENCE"
       ============================================================ */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="CREATE INCIDENCE"
        size="lg"
      >
        <IncidenceForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          loading={creating}
          isEdit={false}
        />
      </Modal>

      {/* ============================================================
          MODAL 2: VIEW DETAILS
          Component: IncidenceDetail
          Title: "INCIDENCE DETAILS"
       ============================================================ */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="INCIDENCE DETAILS"
        size="lg"
      >
        <IncidenceDetail
          incidence={selectedIncidence}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onClose={() => setShowDetailModal(false)}
          showCommentForm={false}
          isOwner={true}
        />
      </Modal>

      {/* ============================================================
          MODAL 3: EDIT INCIDENCE
          Component: IncidenceForm (reused)
          Title: "EDIT INCIDENCE"
       ============================================================ */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingIncidence(null);
        }}
        title="EDIT INCIDENCE"
        size="lg"
      >
        <IncidenceForm
          initialData={editingIncidence}
          onSubmit={handleUpdate}
          onCancel={() => {
            setShowEditModal(false);
            setEditingIncidence(null);
          }}
          loading={updating}
          isEdit={true}
        />
      </Modal>
    </div>
  );
}