/**
 * ============================================================
 * PAGE: Dashboard (Main Panel)
 * ============================================================
 * Description: 
 *   Main dashboard page that shows an overview of all system
 *   incidences. Includes filters by status/priority, tag search,
 *   and click-to-view details.
 * 
 * Location: src/pages/Dashboard.jsx
 * 
 * Routing:
 *   - Accessible from /dashboard
 *   - Requires authentication (protected)
 * 
 * Features:
 *   1. Filters: High, Open, In Progress, Resolved (clickable)
 *   2. Search: Filters incidences by tags
 *   3. IncidentsTable: Table with filtered incidences
 *   4. Row click opens detail modal
 * 
 * Filter states:
 *   - filter: null (all) | 'high' | 'open' | 'in_progress' | 'resolved'
 *   - searchTag: string to search in tags
 * 
 * Components used:
 *   - TopNavBar, SideNavBar, Footer (layout)
 *   - IncidentsTable (interactive table)
 *   - CreateIncidentFAB (floating button)
 *   - Modal, IncidenceDetail (detail ui)
 * ============================================================
 */

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import TopNavBar from '../components/layout/TopNavBar';
import SideNavBar from '../components/layout/SideNavBar';
import IncidentsTable from '../components/dashboard/IncidentsTable';
import Modal from '../components/ui/Modal';
import IncidenceDetail from '../components/incidences/IncidenceDetail';

export default function Dashboard() {
  // ============================================================
  // COMPONENT STATES
  // ============================================================
  const { user, logout } = useAuth();
  const [incidences, setIncidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Filters
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchTag, setSearchTag] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 });

  // Dashboard statistics
  const [statsData, setStatsData] = useState({
    total: 0,
    high: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });
  
  // Modal: View incidence details
  const [selectedIncidence, setSelectedIncidence] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // ============================================================
  // EFFECT: Load dashboard statistics
  // ============================================================
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/metrics');
        setStatsData({
          total: data.data.total || 0,
          high: data.data.by_priority?.high || 0,
          open: data.data.by_status?.open || 0,
          inProgress: data.data.by_status?.in_progress || 0,
          resolved: data.data.by_status?.resolved || 0,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    fetchStats();
  }, []);

  // ============================================================
  // EFFECT: Reset page when filter changes
  // ============================================================
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // ============================================================
  // EFFECT: Load incidences on mount and when page changes
  // ============================================================
  useEffect(() => {
    setLoading(true);
    
    let url = `/incidences?page=${currentPage}`;
    
    if (activeFilter) {
      if (activeFilter === 'critical') {
        url += '&priority=critical';
      } else if (activeFilter === 'high') {
        url += '&priority=high';
      } else {
        url += `&status=${activeFilter}`;
      }
    }
    
    if (searchTag.trim()) {
      url += `&search=${encodeURIComponent(searchTag.trim())}`;
    }
    
    api.get(url)
      .then(({ data }) => {
        const incidenceData = data.data || data;
        setIncidences(Array.isArray(incidenceData) ? incidenceData : []);
        if (data.meta) {
          setMeta(data.meta);
        }
      })
      .catch(err => {
        console.error('Error fetching incidences:', err);
        setIncidences([]);
      })
      .finally(() => setLoading(false));
  }, [currentPage, activeFilter, searchTag]);

  // ============================================================
  // HANDLER: handleLogout
  // ============================================================
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // ============================================================
  // HANDLER: handleRowClick
  // Description: Opens modal with details when clicking a row
  // ============================================================
  const handleRowClick = async (incidence) => {
    setLoadingDetail(true);
    setSelectedIncidence(incidence);
    setShowDetailModal(true);
    
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
  // HANDLER: handleCommentAdded
  // Description: Updates selectedIncidence when a comment is added
  // ============================================================
  const handleCommentAdded = (updatedIncidence) => {
    setSelectedIncidence(updatedIncidence);
    setIncidences(prev => prev.map(inc => 
      inc.id === updatedIncidence.id ? updatedIncidence : inc
    ));
  };

  // ============================================================
  // HANDLER: handleCommentDeleted
  // Description: Updates selectedIncidence when a comment is deleted
  // ============================================================
  const handleCommentDeleted = (updatedIncidence) => {
    setSelectedIncidence(updatedIncidence);
    setIncidences(prev => prev.map(inc => 
      inc.id === updatedIncidence.id ? updatedIncidence : inc
    ));
  };

  // ============================================================
  // HANDLER: handlePageChange
  // Description: Changes the pagination page
  // ============================================================
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* TOP NAV BAR */}
      <TopNavBar user={user} onLogout={handleLogout} />
      
      {/* SIDEBAR NAVIGATION */}
      <SideNavBar />
      
      {/* MAIN CONTENT AREA */}
      <main className="ml-64 pt-14 min-h-screen relative">
        {/* Background pattern */}
        <div className="absolute inset-0 stippled-bg"></div>
        
        {/* Content */}
        <div className="relative p-8 max-w-6xl">
          
          {/* ============================================================
               HEADER: Title + Subtitle
            ============================================================ */}
          <div className="mb-8">
            <span className="font-label text-xs uppercase border border-black px-2 py-0.5 bg-white">DASHBOARD MODULE</span>
            <h1 className="font-sans font-bold text-4xl mt-2">MAIN DASHBOARD</h1>
            <p className="font-label text-sm text-on-surface-variant mt-1">System incidents summary</p>
          </div>

          {/* ============================================================
               SECTION: FILTER BUTTONS - S4 Style
               Style: Compact, border-2 border-black, large numbers
            ============================================================ */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6">
              {/* Button: HIGH */}
              <button
                onClick={() => setActiveFilter(activeFilter === 'high' ? null : 'high')}
                className={`block text-center p-6 border-2 border-black transition-colors ${
                  activeFilter === 'high' 
                    ? 'bg-black text-white' 
                    : 'bg-white hover:bg-surface-dim'
                }`}
              >
                <div className="text-xs uppercase tracking-wide mb-3">High</div>
                <div className="text-5xl font-light mb-2">{statsData.high}</div>
                <div className="text-xs">High priority incidents</div>
              </button>

              {/* Button: OPEN */}
              <button 
                onClick={() => setActiveFilter(activeFilter === 'open' ? null : 'open')}
                className={`block text-center p-6 border-2 border-black transition-colors ${
                  activeFilter === 'open' 
                    ? 'bg-black text-white' 
                    : 'bg-white hover:bg-surface-dim'
                }`}
              >
                <div className="text-xs uppercase tracking-wide mb-3">Open</div>
                <div className="text-5xl font-light mb-2">{statsData.open}</div>
                <div className="text-xs">Open incidents</div>
              </button>

              {/* Button: IN PROGRESS */}
              <button 
                onClick={() => setActiveFilter(activeFilter === 'in_progress' ? null : 'in_progress')}
                className={`block text-center p-6 border-2 border-black transition-colors ${
                  activeFilter === 'in_progress' 
                    ? 'bg-black text-white' 
                    : 'bg-white hover:bg-surface-dim'
                }`}
              >
                <div className="text-xs uppercase tracking-wide mb-3">In Progress</div>
                <div className="text-5xl font-light mb-2">{statsData.inProgress}</div>
                <div className="text-xs">In progress incidents</div>
              </button>

              {/* Button: RESOLVED */}
              <button 
                onClick={() => setActiveFilter(activeFilter === 'resolved' ? null : 'resolved')}
                className={`block text-center p-6 border-2 border-black transition-colors ${
                  activeFilter === 'resolved' 
                    ? 'bg-black text-white' 
                    : 'bg-white hover:bg-surface-dim'
                }`}
              >
                <div className="text-xs uppercase tracking-wide mb-3">Resolved</div>
                <div className="text-5xl font-light mb-2">{statsData.resolved}</div>
                <div className="text-xs">Resolved incidents</div>
              </button>
            </div>

          {/* SEARCH BAR - Search by tags - S4 Style */}
          <div className="mb-6 bg-white p-4">
            <div className="flex gap-4 items-center">
              <input 
                type="text"
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                className="border-2 border-black p-2 text-xs flex-1" 
                placeholder="Search by hashtag..."
              />
              <button className="px-16 py-2 border-2 border-black bg-black text-white text-xs uppercase">
                Search
              </button>
            </div>
          </div>

          {/* INCIDENTS TABLE - Pass filtered incidences */}
          <IncidentsTable 
            incidences={incidences} 
            loading={loading}
            onRowClick={handleRowClick}
            currentPage={currentPage}
            totalPages={meta.last_page}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      {/* MODAL: INCIDENCE DETAILS */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="INCIDENCE DETAILS"
        size="lg"
      >
        <IncidenceDetail
          incidence={selectedIncidence}
          onEdit={() => navigate('/my-incidences')}
          onDelete={() => alert('Para eliminar incidencias, use la página "My Incidences"')}
          onClose={() => setShowDetailModal(false)}
          showCommentForm={true}
          onCommentAdded={handleCommentAdded}
          onCommentDeleted={handleCommentDeleted}
        />
      </Modal>
    </div>
  );
}