import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';

const EventFeed = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState(() => sessionStorage.getItem('feed_filter') || "all");
    const [statusFilter, setStatusFilter] = useState(() => sessionStorage.getItem('feed_status') || "upcoming");
    const [search, setSearch] = useState(() => sessionStorage.getItem('feed_search') || "");
    const [savedIds, setSavedIds] = useState([]);

    // Persistence: Save filters and search
    useEffect(() => {
        sessionStorage.setItem('feed_filter', filter);
        sessionStorage.setItem('feed_status', statusFilter);
        sessionStorage.setItem('feed_search', search);
    }, [filter, statusFilter, search]);

    // Scroll Restoration
    useEffect(() => {
        const scrollPosition = sessionStorage.getItem('feed_scroll');
        if (scrollPosition) {
            window.scrollTo(0, parseInt(scrollPosition));
        }

        const handleScroll = () => {
            sessionStorage.setItem('feed_scroll', window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading]); // Restore after loading

    useEffect(() => {
        async function loadData() {
            try {
                // Fetch events with a minimum delay to show spinner
                const [eventsRes] = await Promise.all([
                    api.get("/events", { params: { status: statusFilter } }),
                    new Promise(resolve => setTimeout(resolve, 800))
                ]);
                setEvents(eventsRes.data);

                // Fetch saved RSVPs to mark them
                try {
                    const rsvpRes = await api.get("/rsvps/me");
                    setSavedIds(rsvpRes.data.map((r) => r.eventId));
                } catch (e) {
                    console.warn("Could not fetch RSVPs", e);
                }

            } catch (err) {
                console.error(err);
                setError("Erro ao carregar eventos");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [statusFilter]);

    const applyFilters = () => {
        let filtered = [...events];

        // Search
        if (search) {
            filtered = filtered.filter((e) =>
                e.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Filters
        if (filter === "today") {
            const today = new Date().toDateString();
            filtered = filtered.filter(
                (e) => new Date(e.date).toDateString() === today
            );
        }



        if (filter === "free") {
            filtered = filtered.filter((e) => e.isFree);
        }

        if (filter === "saved") {
            filtered = filtered.filter((e) => savedIds.includes(e._id));
        }

        return filtered;
    };

    const filteredEvents = applyFilters();

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="container"><p>{error}</p></div>;



    return (
        <div style={{ paddingBottom: '80px', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
            {/* Header Section */}
            <div style={{ backgroundColor: 'var(--header-bg)', color: 'white', padding: '1rem 1rem 3rem 1rem', borderRadius: '0 0 24px 24px', marginBottom: '-24px', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>{t("welcome")}, {user?.name?.split(' ')[0] || 'Visitante'}!</h1>
                    <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>{t("find_best_events")}</p>
                </div>

                {/* Avatar */}
                <div
                    onClick={() => window.location.href = '/profile'}
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        backgroundImage: user?.photo ? `url(http://localhost:4000/uploads/${user.photo})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--color-primary)',
                        fontWeight: 'bold',
                        border: '2px solid rgba(255,255,255,0.2)'
                    }}
                >
                    {!user?.photo && user?.name?.charAt(0).toUpperCase()}
                </div>
            </div>

            <div className="container">
                {/* Search Bar (Floating) */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '50px',
                    padding: '8px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                    marginBottom: '1.5rem'
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" style={{ marginRight: '10px' }}>
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder={t("search_placeholder")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            outline: 'none',
                            width: '100%',
                            fontSize: '1rem',
                            color: '#333'
                        }}
                    />
                </div>

                {/* Filter Buttons (Scrollable) */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '1.5rem',
                    overflowX: 'auto',
                    paddingBottom: '5px',
                    scrollbarWidth: 'none'
                }}>
                    {[
                        { id: 'all', label: t("all") },
                        { id: 'today', label: t("today") },
                        // { id: 'sport', label: t("sport") },
                        { id: 'free', label: t("free") },
                        { id: 'saved', label: t("saved") },
                        { id: 'past', label: t("past_events") }
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => {
                                if (f.id === 'past') {
                                    setStatusFilter('past');
                                    setFilter('all'); // Reset other filters
                                } else {
                                    setStatusFilter('upcoming');
                                    setFilter(f.id);
                                }
                            }}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: 'none',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                backgroundColor: (f.id === 'past' ? statusFilter === 'past' : (filter === f.id && statusFilter === 'upcoming')) ? 'var(--color-primary)' : 'white',
                                color: (f.id === 'past' ? statusFilter === 'past' : (filter === f.id && statusFilter === 'upcoming')) ? 'white' : '#666',
                                boxShadow: (f.id === 'past' ? statusFilter === 'past' : (filter === f.id && statusFilter === 'upcoming')) ? '0 2px 8px rgba(255, 152, 0, 0.3)' : '0 1px 3px rgba(0,0,0,0.05)'
                            }}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Loading / Error States */}
                {loading && <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>A carregar relatórios...</div>}
                {error && <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>}

                {/* Event List */}
                <div className="event-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {!loading && filteredEvents.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '3rem', color: '#999' }}>
                            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Nenhum evento encontrado.</p>
                            <p style={{ fontSize: '0.9rem' }}>Tenta mudar os filtros.</p>
                        </div>
                    ) : (
                        filteredEvents.map(event => (
                            <EventCard key={event._id} event={event} />
                        ))
                    )}
                </div>

                {/* Floating Action Button (Create) - Use Standard FAB again */}
                {user?.type === 'organizer' && (
                    <button
                        onClick={() => window.location.href = '/create'}
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            boxShadow: '0 4px 10px rgba(255, 152, 0, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 100
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default EventFeed;
