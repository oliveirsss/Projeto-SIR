import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import socket from "../services/socket";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { getImageUrl } from "../utils/config";

import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmationModal from '../components/ConfirmationModal';

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { t, language } = useLanguage();

    const [event, setEvent] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Derived state for display
    const displayTitle = event ? ((language === 'en' && event.titleEn && event.titleEn.trim()) ? event.titleEn : event.title) : "";
    const displayDescription = event ? ((language === 'en' && event.descriptionEn && event.descriptionEn.trim()) ? event.descriptionEn : event.description) : "";
    const [isSaved, setIsSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [rsvpCount, setRsvpCount] = useState(0);
    const [isPast, setIsPast] = useState(false);

    // Modal state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [alertModalOpen, setAlertModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    // Load Data
    useEffect(() => {
        async function loadData() {
            try {
                // Fetch data with minimum delay
                const [eventRes, commentsRes] = await Promise.all([
                    api.get(`/events/${id}`),
                    api.get(`/events/${id}/comments`),
                    new Promise(resolve => setTimeout(resolve, 800))
                ]);

                setEvent(eventRes.data);
                // Get count from event data or count it
                setRsvpCount(eventRes.data.goingCount || 0);

                // Check if past
                if (new Date(eventRes.data.date) < new Date()) {
                    setIsPast(true);
                }
                setComments(commentsRes.data);

                if (user) {
                    try {
                        const rsvpRes = await api.get("/rsvps/me");
                        const saved = rsvpRes.data.some(
                            (r) => r.eventId === id || r.eventId?._id === id
                        );
                        setIsSaved(saved);
                    } catch (e) {
                        console.warn("Failed to check RSVP status", e);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [id, user]);

    // Socket Connection
    useEffect(() => {
        socket.connect();
        socket.emit("join-event", id);

        socket.on("new-comment", (comment) => {
            setComments((prev) => [comment, ...prev]);
        });

        // Listen for deletions too if your backend emits them (optional but good)
        socket.on("comment_deleted", ({ commentId }) => {
            setComments(prev => prev.filter(c => c._id !== commentId));
        });

        return () => {
            socket.off("new-comment");
            socket.off("comment_deleted");
            socket.disconnect();
        };
    }, [id]);

    // Handle RSVP
    async function toggleRsvp() {
        if (saving) return;

        if (!user) {
            navigate("/login", { state: { from: location } });
            return;
        }

        setSaving(true);
        try {
            if (isSaved) {
                await api.delete(`/rsvps/${id}`);
                setIsSaved(false);
                setRsvpCount((c) => Math.max(0, c - 1));
            } else {
                await api.post("/rsvps", { eventId: id });
                setIsSaved(true);
                setRsvpCount((c) => c + 1);
            }
        } catch {
            alert(t("error"));
        } finally {
            setSaving(false);
        }
    }

    // Handle Comment
    async function submitComment(e) {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            await api.post(`/events/${id}/comments`, { text: commentText });
            setCommentText("");
        } catch {
            alert(t("error"));
        }
    }

    // Social Sharing
    const shareUrl = window.location.href;
    const displayTitleStr = event ? ((language === 'en' && event.titleEn && event.titleEn.trim()) ? event.titleEn : event.title) : "";
    const shareText = `Check out this event: ${displayTitleStr}`;

    const handleShareWhatsapp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setAlertMessage("Link copiado para a área de transferência!");
            setAlertModalOpen(true);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const requestDeleteComment = (comment) => {
        setCommentToDelete(comment);
        setDeleteModalOpen(true);
    };

    const confirmDeleteComment = async () => {
        if (!commentToDelete) return;
        try {
            await api.delete(`/comments/${commentToDelete._id}`);
            // Optimistic update
            setComments(prev => prev.filter(c => c._id !== commentToDelete._id));
        } catch (e) {
            console.error(e);
            alert(t("error"));
        } finally {
            setDeleteModalOpen(false);
            setCommentToDelete(null);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (!event) return <div className="container center"><p>Event not found.</p></div>;

    return (
        <div style={{ paddingBottom: '80px', minHeight: '100vh', backgroundColor: '#fff' }}>

            {/* Top Navigation Overlay */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0,
                padding: '1rem', zIndex: 50,
                display: 'flex', justifyContent: 'space-between',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
                pointerEvents: 'none'
            }}>
                <button
                    onClick={() => {
                        if (location.state?.fromFeed) {
                            navigate(-1);
                        } else {
                            navigate('/');
                        }
                    }}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', pointerEvents: 'auto' }}
                >
                    {location.state?.fromFeed ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    )}
                </button>
            </nav>

            {/* Hero Image */}
            <div style={{ height: '350px', backgroundColor: '#ddd', position: 'relative' }}>
                <img
                    src={getImageUrl(event.image)}
                    alt={event.title}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/800x600?text=No+Image"; }}
                    referrerPolicy="no-referrer"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Gradient Overlay */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(to top, #fff, transparent)' }}></div>
            </div>

            {/* Content Container */}
            <div className="container" style={{ marginTop: '-80px', position: 'relative', zIndex: 10 }}>

                {/* Title & Stats */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px', color: '#111', lineHeight: 1.2 }}>
                        {displayTitle}
                    </h1>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.8rem', borderRadius: '20px' }}>
                            {t(event.category)}
                        </span>
                        <span style={{ fontSize: '0.9rem', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            {rsvpCount} {t("people_going")}
                        </span>
                    </div>
                </div>

                {/* Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {/* Date */}
                    <div style={{ backgroundColor: '#F9FAFB', padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <svg style={{ color: 'var(--color-primary)' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>{t("date_time")}</span>
                        <strong style={{ fontSize: '0.95rem' }}>{new Date(event.date).toLocaleDateString(language === 'pt' ? 'pt-PT' : 'en-US')}</strong>
                    </div>

                    {/* Location */}
                    <div style={{ backgroundColor: '#F9FAFB', padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <svg style={{ color: 'var(--color-primary)' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>{t("location")}</span>
                        <strong style={{ fontSize: '0.95rem' }}>{event.location}</strong>
                    </div>

                    {/* Price */}
                    <div style={{ backgroundColor: '#F9FAFB', padding: '1rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <svg style={{ color: 'var(--color-primary)' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>{t("price")}</span>
                        <strong style={{ fontSize: '0.95rem' }}>{event.isFree ? t("free") : t("paid")}</strong>
                    </div>
                </div>

                {/* Social Sharing */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
                    <button
                        onClick={handleShareWhatsapp}
                        style={{
                            flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                            backgroundColor: '#25D366', color: 'white', fontWeight: '600',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        WhatsApp
                    </button>
                    <button
                        onClick={handleCopyLink}
                        style={{
                            flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB',
                            backgroundColor: 'white', color: '#374151', fontWeight: '600',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        Copiar Link
                    </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', padding: '1rem', border: '1px solid #eee', borderRadius: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.8rem', color: '#666', display: 'block' }}>{t("organized_by")}</span>
                        <strong>{event.organizerId?.name || "Organizador Desconhecido"}</strong>
                    </div>
                </div>

                {/* Description */}
                <div style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{t("about_event")}</h2>
                    <p style={{ lineHeight: '1.8', color: '#444', fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
                        {displayDescription}
                    </p>
                </div>

                {/* Comments Section */}
                <div style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{t("comments")} ({comments.length})</h2>

                    {user && (
                        <form onSubmit={submitComment} style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder={t("add_comment")}
                                style={{ flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ddd', outline: 'none' }}
                            />
                            <button type="submit" className="btn btn-secondary" style={{ borderRadius: '20px' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </button>
                        </form>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {comments.map(comment => (
                            <div key={comment._id} style={{ display: 'flex', gap: '10px' }}>
                                <div
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        backgroundColor: '#f0f0f0',
                                        backgroundImage: comment.userId?.photo ? `url(${getImageUrl(comment.userId.photo)})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {!comment.userId?.photo && comment.userId?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div style={{ backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '0 12px 12px 12px', flex: 1 }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#111' }}>{comment.userId?.name || 'Utilizador'}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </span>
                                                {(user?.type === 'admin' || user?._id === comment.userId?._id) && (
                                                    <button
                                                        onClick={() => requestDeleteComment(comment)}
                                                        style={{
                                                            background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '4px'
                                                        }}
                                                    >
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.95rem', color: '#4B5563', lineHeight: '1.4' }}>{comment.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Fixed Bottom Bar (Action) */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
                padding: '1rem',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 10
            }}>
                <div>
                    {/* <span style={{ display: 'block', fontSize: '0.8rem', color: '#666' }}>{t("total_price")}</span> */}
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                        {event.isFree ? t("free") : t("paid")}
                    </span>
                </div>

                {isPast ? (
                    <div style={{
                        backgroundColor: '#E5E7EB',
                        padding: '10px 20px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <span style={{ fontWeight: 'bold', color: '#374151' }}>{t("event_ended")}</span>
                        <span style={{ backgroundColor: '#9CA3AF', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.8rem' }}>
                            {rsvpCount} {t("attendees_count")}
                        </span>
                    </div>
                ) : (
                    <button
                        onClick={toggleRsvp}
                        disabled={saving}
                        className={`btn ${isSaved ? 'btn-secondary' : 'btn-primary'}`}
                        style={{
                            padding: '12px 32px',
                            fontSize: '1.1rem',
                            borderRadius: '16px',
                            minWidth: '160px',
                            boxShadow: isSaved ? 'none' : '0 4px 15px rgba(255, 152, 0, 0.4)'
                        }}
                    >
                        {saving ? t("saving") : (isSaved ? t("subscribed") : t("subscribe"))}
                    </button>
                )}
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDeleteComment}
                title={t("delete") + "?"}
                message="Tem a certeza que pretende apagar este comentário? Esta ação é irreversível."
            />

            {/* Alert Modal */}
            <ConfirmationModal
                isOpen={alertModalOpen}
                onClose={() => setAlertModalOpen(false)}
                title="UniEvents"
                message={alertMessage}
                isAlert={true}
            />

        </div>
    );
}
