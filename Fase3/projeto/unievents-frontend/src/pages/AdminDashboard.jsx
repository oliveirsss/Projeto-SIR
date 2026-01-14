import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { getImageUrl } from '../utils/config';

export default function AdminDashboard() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ users: 0, events: 0 });
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState('events'); // 'events' or 'users'
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({ title: "", message: "", action: null });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            // Events
            const eventsRes = await api.get('/events?status=all&limit=100');
            setEvents(eventsRes.data);
            setStats(prev => ({ ...prev, events: eventsRes.data.length }));

            // Users
            const usersRes = await api.get('/users');
            setUsers(usersRes.data);
            setStats(prev => ({ ...prev, users: usersRes.data.length }));

            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    }

    // --- Search Logic ---
    const filteredEvents = events.filter(ev =>
        (ev.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (ev.location?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    const filteredUsers = users.filter(u =>
        (u.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (u.email?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    // --- Actions ---

    // Delete Event
    const requestDeleteEvent = (event) => {
        setModalConfig({
            title: "Eliminar Evento?",
            message: `Tem a certeza que deseja eliminar "${event.title}"? Esta ação é irreversível.`,
            action: () => performDeleteEvent(event._id)
        });
        setModalOpen(true);
    };

    const performDeleteEvent = async (eventId) => {
        try {
            await api.delete(`/events/${eventId}`);
            setEvents(prev => prev.filter(e => e._id !== eventId));
            setStats(prev => ({ ...prev, events: prev.events - 1 }));
        } catch (e) {
            console.error(e);
            alert("Erro ao eliminar evento.");
        } finally {
            setModalOpen(false);
        }
    };

    // Ban User
    const requestBanUser = (user) => {
        const isBanning = !user.isBanned;
        setModalConfig({
            title: isBanning ? "Banir Utilizador?" : "Desbanir Utilizador?",
            message: isBanning
                ? `Tem a certeza que deseja banir ${user.name}? Ele deixará de conseguir entrar na aplicação.`
                : `Tem a certeza que deseja desbanir ${user.name}?`,
            action: () => performBanUser(user._id)
        });
        setModalOpen(true);
    };

    const performBanUser = async (userId) => {
        try {
            const res = await api.put(`/users/${userId}/ban`);
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, isBanned: res.data.isBanned } : u));
        } catch (e) {
            console.error(e);
            alert("Erro ao atualizar estado do utilizador.");
        } finally {
            setModalOpen(false);
        }
    };

    // Update User Role
    const handleRoleChange = async (userId, newType) => {
        try {
            await api.put(`/users/${userId}/type`, { type: newType });
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, type: newType } : u));
        } catch (e) {
            console.error(e);
            alert("Erro ao atualizar cargo do utilizador.");
        }
    };


    if (loading) return <LoadingSpinner />;

    return (
        <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#F9FAFB', paddingTop: '80px', maxWidth: '1200px', margin: '0 auto' }}>

            {/* Back Button */}
            <button key="back-btn" onClick={() => navigate(-1)} style={{ position: 'absolute', top: '20px', left: '20px', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'white', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111', marginBottom: '2rem' }}>Painel de Administração</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total de Eventos</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{stats.events}</p>
                </div>
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Total de Utilizadores</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-secondary)' }}>{stats.users}</p>
                </div>
            </div>

            {/* Tabs & Search */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #eee', paddingBottom: '1px' }}>
                    <button
                        onClick={() => { setActiveTab('events'); setSearchTerm(""); }}
                        style={{
                            padding: '10px 20px', border: 'none', background: 'none',
                            fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                            color: activeTab === 'events' ? 'var(--color-primary)' : '#9CA3AF',
                            borderBottom: activeTab === 'events' ? '2px solid var(--color-primary)' : 'none',
                            marginBottom: '-2px'
                        }}
                    >
                        Eventos
                    </button>
                    <button
                        onClick={() => { setActiveTab('users'); setSearchTerm(""); }}
                        style={{
                            padding: '10px 20px', border: 'none', background: 'none',
                            fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
                            color: activeTab === 'users' ? 'var(--color-primary)' : '#9CA3AF',
                            borderBottom: activeTab === 'users' ? '2px solid var(--color-primary)' : 'none',
                            marginBottom: '-2px'
                        }}
                    >
                        Utilizadores
                    </button>
                </div>

                {/* Search Bar */}
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        placeholder={activeTab === 'events' ? "Pesquisar eventos (título, local)..." : "Pesquisar utilizadores (nome, email)..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            paddingLeft: '40px',
                            borderRadius: '12px',
                            border: '1px solid #E5E7EB',
                            fontSize: '1rem',
                            outline: 'none',
                            backgroundColor: 'white'
                        }}
                    />
                    <svg
                        width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"
                        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                    >
                        <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
            </div>


            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', color: '#111' }}>
                    {activeTab === 'events' ? 'Gestão de Eventos' : 'Gestão de Utilizadores'}
                </h2>

                {activeTab === 'events' ? (
                    filteredEvents.length === 0 ? <p style={{ color: '#666' }}>Nenhum evento encontrado.</p> : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                            {filteredEvents.map(ev => (
                                <div key={ev._id} style={{ border: '1px solid #F3F4F6', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#fff' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111', marginBottom: '4px' }}>{ev.title}</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>{new Date(ev.date).toLocaleDateString()} • {ev.location}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', backgroundColor: '#F9FAFB', borderRadius: '8px' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold', color: '#4B5563' }}>{ev.organizerId?.name?.charAt(0) || '?'}</div>
                                        <span style={{ fontSize: '0.85rem', color: '#4B5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.organizerId?.name || 'Desconhecido'}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                                        <button
                                            onClick={() => navigate(`/edit/${ev._id}`)}
                                            style={{
                                                flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: 'white',
                                                color: '#374151', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                            }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => requestDeleteEvent(ev)}
                                            style={{
                                                flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #FECACA', backgroundColor: '#FEF2F2',
                                                color: '#EF4444', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                            }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    filteredUsers.length === 0 ? <p style={{ color: '#666' }}>Nenhum utilizador encontrado.</p> : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                            {filteredUsers.map(u => (
                                <div key={u._id} style={{ border: '1px solid #F3F4F6', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#fff', opacity: u.isBanned ? 0.6 : 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '48px', height: '48px', borderRadius: '50%',
                                            backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            backgroundImage: u.photo ? `url(${getImageUrl(u.photo)})` : 'none',
                                            backgroundSize: 'cover', backgroundPosition: 'center',
                                            fontSize: '1.2rem', fontWeight: 'bold', color: '#666'
                                        }}>
                                            {!u.photo && u.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#111' }}>{u.name}</h3>
                                            <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>{u.email}</p>

                                            {/* Role Selector */}
                                            {u.type === 'admin' ? (
                                                <span style={{
                                                    fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px',
                                                    backgroundColor: '#DBEAFE', color: '#1E40AF', marginTop: '4px', display: 'inline-block'
                                                }}>
                                                    Admin
                                                </span>
                                            ) : (
                                                <select
                                                    value={u.type}
                                                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                    style={{
                                                        marginTop: '4px',
                                                        padding: '2px 6px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #E5E7EB',
                                                        fontSize: '0.8rem',
                                                        color: '#374151',
                                                        backgroundColor: u.type === 'student' ? '#F3F4F6' : '#FCE7F3',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <option value="student">Estudante</option>
                                                    <option value="organizer">Organizador</option>
                                                </select>
                                            )}
                                        </div>
                                    </div>

                                    {u.isBanned && <p style={{ color: 'red', fontSize: '0.85rem', fontWeight: 'bold' }}>Banido 🚫</p>}

                                    <button
                                        onClick={() => requestBanUser(u)}
                                        disabled={u.type === 'admin'}
                                        style={{
                                            marginTop: 'auto',
                                            padding: '10px',
                                            borderRadius: '8px',
                                            border: '1px solid',
                                            borderColor: u.isBanned ? '#D1D5DB' : '#FECACA',
                                            backgroundColor: u.isBanned ? 'white' : '#FEF2F2',
                                            color: u.isBanned ? '#374151' : '#EF4444',
                                            fontSize: '0.9rem',
                                            fontWeight: '600',
                                            cursor: u.type === 'admin' ? 'not-allowed' : 'pointer',
                                            opacity: u.type === 'admin' ? 0.5 : 1
                                        }}
                                    >
                                        {u.isBanned ? 'Desbanir Conta' : 'Banir Conta'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>

            <ConfirmationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={modalConfig.action}
                title={modalConfig.title}
                message={modalConfig.message}
            />

        </div>
    );
}
