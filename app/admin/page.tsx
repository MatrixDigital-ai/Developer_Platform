'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

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
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchDevelopers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (roleFilter) params.set('role', roleFilter);

            const res = await fetch(`/api/developers?${params.toString()}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setDevelopers(data);
            }
        } catch {
            showToast('Failed to fetch developers', 'error');
        } finally {
            setLoading(false);
        }
    }, [search, roleFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDevelopers();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchDevelopers]);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}'s profile?`)) return;

        try {
            const res = await fetch(`/api/developers/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setDevelopers(developers.filter((d) => d.id !== id));
                showToast(`${name}'s profile has been deleted.`, 'success');
                if (selectedDev?.id === id) setSelectedDev(null);
            } else {
                showToast('Failed to delete developer.', 'error');
            }
        } catch {
            showToast('Network error. Please try again.', 'error');
        }
    };

    const getInitials = (name: string) =>
        name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

    const roles = [
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Developer',
        'Mobile Developer',
        'DevOps Engineer',
        'Data Scientist',
        'UI/UX Designer',
        'Game Developer',
        'Cloud Architect',
        'AI/ML Engineer',
        'Blockchain Developer',
        'Other',
    ];

    return (
        <>
            {/* Navbar */}
            <nav className="navbar">
                <Link href="/" className="navbar-logo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
                    </svg>
                    DevShowcase
                </Link>
                <Link href="/">Home</Link>
                <Link href="/#submit">Submit</Link>
                <Link href="/admin" className="admin-btn">
                    Admin
                </Link>
            </nav>

            {/* Header */}
            <div className="admin-header">
                <h1>
                    Admin Dashboard
                </h1>
                <p>View and manage all developer submissions</p>
            </div>

            {/* Controls */}
            <div className="admin-controls">
                <input
                    className="search-input"
                    type="text"
                    placeholder="Search by name, email, or bio..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="filter-select"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="">All Roles</option>
                    {roles.map((role) => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                    ))}
                </select>
                <div className="dev-count">
                    👥 {developers.length} Developer{developers.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Grid */}
            <div className="dev-grid">
                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                    </div>
                ) : developers.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📭</div>
                        <h3>No developers found</h3>
                        <p>
                            {search || roleFilter
                                ? 'Try adjusting your search or filter.'
                                : 'No submissions yet. Be the first to submit!'}
                        </p>
                    </div>
                ) : (
                    developers.map((dev) => (
                        <div
                            key={dev.id}
                            className="dev-card"
                            onClick={() => setSelectedDev(dev)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="dev-card-header">
                                <div className="dev-avatar">{getInitials(dev.name)}</div>
                                <div className="dev-card-actions">
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(dev.id, dev.name);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div className="dev-name">{dev.name}</div>
                            <div className="dev-role">{dev.role}</div>
                            <p className="dev-bio">{dev.bio}</p>
                            <div className="dev-meta">
                                <span>📧 {dev.email}</span>
                                {dev.location && <span>📍 {dev.location}</span>}
                                <span>💼 {dev.experience}</span>
                                <span>📅 {formatDate(dev.createdAt)}</span>
                            </div>
                            {dev.skills.length > 0 && (
                                <div className="dev-skills">
                                    {dev.skills.slice(0, 5).map((skill, i) => (
                                        <span key={i} className="skill-tag">
                                            {skill}
                                        </span>
                                    ))}
                                    {dev.skills.length > 5 && (
                                        <span className="skill-tag">+{dev.skills.length - 5}</span>
                                    )}
                                </div>
                            )}
                            <div className="dev-links">
                                {dev.portfolioUrl && (
                                    <a href={dev.portfolioUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                        🌐 Portfolio
                                    </a>
                                )}
                                {dev.githubUrl && (
                                    <a href={dev.githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                        🐙 GitHub
                                    </a>
                                )}
                                {dev.linkedinUrl && (
                                    <a href={dev.linkedinUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                        💼 LinkedIn
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Detail Modal */}
            {selectedDev && (
                <div className="modal-overlay" onClick={() => setSelectedDev(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedDev(null)}>
                            ×
                        </button>
                        <div className="modal-header">
                            <div className="modal-avatar">{getInitials(selectedDev.name)}</div>
                            <div>
                                <div className="modal-name">{selectedDev.name}</div>
                                <div className="dev-role">{selectedDev.role}</div>
                            </div>
                        </div>

                        <div className="modal-section">
                            <h4>Bio</h4>
                            <p>{selectedDev.bio}</p>
                        </div>

                        <div className="modal-section">
                            <h4>Details</h4>
                            <div className="dev-meta">
                                <span>📧 {selectedDev.email}</span>
                                {selectedDev.location && <span>📍 {selectedDev.location}</span>}
                                <span>💼 {selectedDev.experience}</span>
                                <span>📅 Joined {formatDate(selectedDev.createdAt)}</span>
                            </div>
                        </div>

                        {selectedDev.skills.length > 0 && (
                            <div className="modal-section">
                                <h4>Skills</h4>
                                <div className="dev-skills">
                                    {selectedDev.skills.map((skill, i) => (
                                        <span key={i} className="skill-tag">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="modal-section">
                            <h4>Links</h4>
                            <div className="dev-links">
                                {selectedDev.portfolioUrl && (
                                    <a href={selectedDev.portfolioUrl} target="_blank" rel="noopener noreferrer">
                                        🌐 Portfolio
                                    </a>
                                )}
                                {selectedDev.githubUrl && (
                                    <a href={selectedDev.githubUrl} target="_blank" rel="noopener noreferrer">
                                        🐙 GitHub
                                    </a>
                                )}
                                {selectedDev.linkedinUrl && (
                                    <a href={selectedDev.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                        💼 LinkedIn
                                    </a>
                                )}
                                {!selectedDev.portfolioUrl && !selectedDev.githubUrl && !selectedDev.linkedinUrl && (
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No links provided</span>
                                )}
                            </div>
                        </div>

                        <button
                            className="delete-btn"
                            style={{ marginTop: '16px', width: '100%', padding: '12px', fontSize: '0.85rem' }}
                            onClick={() => {
                                handleDelete(selectedDev.id, selectedDev.name);
                            }}
                        >
                            Delete this Profile
                        </button>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="footer">
                <p>© 2026 DevShowcase — Admin Panel</p>
            </footer>

            {/* Toast */}
            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </>
    );
}
