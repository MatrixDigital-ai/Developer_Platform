'use client';

import { useState, useEffect, useCallback } from 'react';

interface Developer {
  id: string;
  name: string;
  email: string;
  role: string;
  bio: string;
  skills: string[];
  portfolioUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  experience: string;
  location: string | null;
  createdAt: string;
}

export default function AdminPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedDev, setSelectedDev] = useState<Developer | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [navSolid, setNavSolid] = useState(false);
  const [view, setView] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    const onS = () => setNavSolid(window.scrollY > 20);
    window.addEventListener('scroll', onS);
    onS();
    return () => window.removeEventListener('scroll', onS);
  }, []);

  const flash = useCallback((msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const fetchDevelopers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);
      const res = await fetch(`/api/developers?${params.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) setDevelopers(data);
    } catch {
      flash('Failed to fetch developers', false);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, flash]);

  useEffect(() => {
    const t = setTimeout(fetchDevelopers, 300);
    return () => clearTimeout(t);
  }, [fetchDevelopers]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}'s profile? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/developers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDevelopers(prev => prev.filter(d => d.id !== id));
        flash(`${name}'s profile deleted.`, true);
        if (selectedDev?.id === id) setSelectedDev(null);
      } else flash('Failed to delete.', false);
    } catch {
      flash('Network error.', false);
    }
  };

  const initials = (n: string) => n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const roles = [
    'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'Mobile Developer', 'DevOps Engineer', 'Data Scientist',
    'UI/UX Designer', 'AI/ML Engineer', 'Cloud Architect', 'Other',
  ];

  const stats = {
    total: developers.length,
    thisWeek: developers.filter(d => {
      const created = new Date(d.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return created >= weekAgo;
    }).length,
    topRole: developers.length
      ? Object.entries(developers.reduce<Record<string, number>>((acc, d) => { acc[d.role] = (acc[d.role] || 0) + 1; return acc; }, {}))
          .sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
      : '—',
  };

  return (<>
    {/* ─── Nav ─── */}
    <nav className={`nav${navSolid ? ' nav--solid' : ''}`} style={{ background: navSolid ? 'rgba(255,255,255,.85)' : 'rgba(255,255,255,.85)', backdropFilter: 'blur(12px)' }}>
      <div className="nav-inner">
        <a href="/" className="nav-brand">
          <img src="/Matrix_logo.jpg" alt="Matrix Digital" className="nav-logo" />
          <span>Matrix Digital</span>
        </a>
        <div className="nav-links hide-mobile">
          <a href="/">Home</a>
          <a href="/#apply">Submit</a>
        </div>
        <span className="admin-nav-badge">Admin</span>
      </div>
    </nav>

    {/* ─── Header ─── */}
    <div className="admin-hero">
      <div className="admin-hero-inner">
        <div>
          <span className="admin-hero-tag">Dashboard</span>
          <h1>Developer <span className="text-accent">Directory</span></h1>
          <p className="admin-hero-desc">Manage, review, and monitor all developer submissions from one place.</p>
        </div>
        <div className="admin-stats">
          <div className="admin-stat">
            <span className="admin-stat-num">{stats.total}</span>
            <span className="admin-stat-label">Total Developers</span>
          </div>
          <div className="admin-stat">
            <span className="admin-stat-num">{stats.thisWeek}</span>
            <span className="admin-stat-label">This Week</span>
          </div>
          <div className="admin-stat admin-stat--wide">
            <span className="admin-stat-num admin-stat-num--sm">{stats.topRole}</span>
            <span className="admin-stat-label">Top Role</span>
          </div>
        </div>
      </div>
    </div>

    {/* ─── Toolbar ─── */}
    <div className="admin-toolbar">
      <div className="admin-toolbar-inner">
        <div className="admin-search-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <input
            className="admin-search"
            type="text"
            placeholder="Search by name, email, or bio..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="admin-search-clear" onClick={() => setSearch('')} aria-label="Clear search">&times;</button>
          )}
        </div>
        <select className="admin-filter" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <div className="admin-view-toggle">
          <button className={`admin-view-btn${view === 'grid' ? ' admin-view-btn--active' : ''}`} onClick={() => setView('grid')} title="Grid view">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
          </button>
          <button className={`admin-view-btn${view === 'table' ? ' admin-view-btn--active' : ''}`} onClick={() => setView('table')} title="Table view">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
        </div>
        <div className="admin-count-pill">
          {developers.length} result{developers.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>

    {/* ─── Content ─── */}
    <div className="admin-content">
      {loading ? (
        <div className="admin-loading">
          <div className="spinner" style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)' }} />
          <p>Loading developers...</p>
        </div>
      ) : developers.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
          </div>
          <h3>No developers found</h3>
          <p>{search || roleFilter ? 'Try adjusting your search or filter criteria.' : 'No submissions yet. Developers will appear here once they sign up.'}</p>
          {(search || roleFilter) && (
            <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={() => { setSearch(''); setRoleFilter(''); }}>Clear Filters</button>
          )}
        </div>
      ) : view === 'grid' ? (
        <div className="dev-grid">
          {developers.map(dev => (
            <div key={dev.id} className="dev-card" onClick={() => setSelectedDev(dev)}>
              <div className="dev-card-header">
                <div className="dev-avatar">{initials(dev.name)}</div>
                <div className="dev-card-actions">
                  <button className="delete-btn" onClick={e => { e.stopPropagation(); handleDelete(dev.id, dev.name); }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                  </button>
                </div>
              </div>
              <div className="dev-name">{dev.name}</div>
              <div className="dev-role">{dev.role}</div>
              <p className="dev-bio">{dev.bio}</p>
              <div className="dev-meta">
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  {dev.email}
                </span>
                {dev.location && (
                  <span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    {dev.location}
                  </span>
                )}
                <span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>
                  {dev.experience}
                </span>
              </div>
              {dev.skills.length > 0 && (
                <div className="dev-skills">
                  {dev.skills.slice(0, 4).map((s, i) => <span key={i} className="tag">{s}</span>)}
                  {dev.skills.length > 4 && <span className="tag" style={{ background: '#F3F4F6', color: 'var(--text-3)', border: '1px solid var(--border)' }}>+{dev.skills.length - 4}</span>}
                </div>
              )}
              <div className="dev-links">
                {dev.portfolioUrl && <a href={dev.portfolioUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
                  Portfolio
                </a>}
                {dev.githubUrl && <a href={dev.githubUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" /></svg>
                  GitHub
                </a>}
                {dev.linkedinUrl && <a href={dev.linkedinUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                  LinkedIn
                </a>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table view */
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Developer</th>
                <th>Role</th>
                <th>Experience</th>
                <th>Location</th>
                <th>Skills</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {developers.map(dev => (
                <tr key={dev.id} onClick={() => setSelectedDev(dev)}>
                  <td>
                    <div className="admin-table-dev">
                      <div className="dev-avatar" style={{ width: 32, height: 32, fontSize: '.72rem' }}>{initials(dev.name)}</div>
                      <div>
                        <div className="admin-table-name">{dev.name}</div>
                        <div className="admin-table-email">{dev.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="dev-role">{dev.role}</span></td>
                  <td className="admin-table-muted">{dev.experience}</td>
                  <td className="admin-table-muted">{dev.location || '—'}</td>
                  <td>
                    <div className="dev-skills" style={{ marginBottom: 0 }}>
                      {dev.skills.slice(0, 2).map((s, i) => <span key={i} className="tag">{s}</span>)}
                      {dev.skills.length > 2 && <span className="tag" style={{ background: '#F3F4F6', color: 'var(--text-3)', border: '1px solid var(--border)' }}>+{dev.skills.length - 2}</span>}
                    </div>
                  </td>
                  <td className="admin-table-muted">{fmtDate(dev.createdAt)}</td>
                  <td>
                    <button className="delete-btn" onClick={e => { e.stopPropagation(); handleDelete(dev.id, dev.name); }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {/* ─── Detail Modal ─── */}
    {selectedDev && (
      <div className="modal-overlay" onClick={() => setSelectedDev(null)}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setSelectedDev(null)}>&times;</button>

          {/* Header */}
          <div className="modal-header">
            <div className="modal-avatar">{initials(selectedDev.name)}</div>
            <div>
              <div className="modal-name">{selectedDev.name}</div>
              <div className="dev-role">{selectedDev.role}</div>
            </div>
          </div>

          {/* Bio */}
          <div className="modal-section">
            <h4>Bio</h4>
            <p>{selectedDev.bio}</p>
          </div>

          {/* Details */}
          <div className="modal-section">
            <h4>Details</h4>
            <div className="modal-detail-grid">
              <div className="modal-detail">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                <span>{selectedDev.email}</span>
              </div>
              {selectedDev.location && (
                <div className="modal-detail">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  <span>{selectedDev.location}</span>
                </div>
              )}
              <div className="modal-detail">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>
                <span>{selectedDev.experience}</span>
              </div>
              <div className="modal-detail">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                <span>Joined {fmtDate(selectedDev.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          {selectedDev.skills.length > 0 && (
            <div className="modal-section">
              <h4>Skills</h4>
              <div className="dev-skills" style={{ marginBottom: 0 }}>
                {selectedDev.skills.map((s, i) => <span key={i} className="tag">{s}</span>)}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="modal-section">
            <h4>Links</h4>
            <div className="modal-links-grid">
              {selectedDev.portfolioUrl && (
                <a href={selectedDev.portfolioUrl} target="_blank" rel="noopener noreferrer" className="modal-link-card">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
                  <span>Portfolio</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 'auto', opacity: .4 }}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                </a>
              )}
              {selectedDev.githubUrl && (
                <a href={selectedDev.githubUrl} target="_blank" rel="noopener noreferrer" className="modal-link-card">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" /></svg>
                  <span>GitHub</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 'auto', opacity: .4 }}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                </a>
              )}
              {selectedDev.linkedinUrl && (
                <a href={selectedDev.linkedinUrl} target="_blank" rel="noopener noreferrer" className="modal-link-card">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                  <span>LinkedIn</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 'auto', opacity: .4 }}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                </a>
              )}
              {!selectedDev.portfolioUrl && !selectedDev.githubUrl && !selectedDev.linkedinUrl && (
                <p style={{ color: 'var(--text-3)', fontSize: '.84rem' }}>No links provided</p>
              )}
            </div>
          </div>

          {/* Delete */}
          <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)', marginTop: 8 }}>
            <button
              className="admin-delete-full"
              onClick={() => handleDelete(selectedDev.id, selectedDev.name)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
              Delete Profile
            </button>
          </div>
        </div>
      </div>
    )}

    {/* ─── Footer ─── */}
    <footer className="footer">
      <div className="footer-bottom" style={{ borderTop: 'none', paddingTop: 0 }}>
        <p>&copy; {new Date().getFullYear()} Matrix Digital — Admin Panel</p>
      </div>
    </footer>

    {/* Toast */}
    {toast && <div className={`toast${toast.ok ? ' toast--ok' : ' toast--err'}`}>{toast.ok ? '✓' : '✕'}&ensp;{toast.msg}</div>}
  </>);
}
