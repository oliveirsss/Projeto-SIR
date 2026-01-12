import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/api";
import LoadingSpinner from '../components/LoadingSpinner';

export default function Profile() {
    const navigate = useNavigate();
    const { user, logout, updateUser } = useAuth();
    const { language, setLanguage, t } = useLanguage();

    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");

    // Preview state for immediate feedback
    const [preview, setPreview] = useState(
        user?.photo ? `http://localhost:4000/uploads/${user.photo}` : null
    );

    const [isHoveringPhoto, setIsHoveringPhoto] = useState(false);
    const [saving, setSaving] = useState(false);

    // Sync local state if user context updates from elsewhere (unlikely here but good practice)
    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            if (user.photo && !preview?.startsWith('blob:')) {
                setPreview(`http://localhost:4000/uploads/${user.photo}`);
            }
        }
    }, [user]);

    // Ensure user is loaded
    if (!user) return <LoadingSpinner />;

    // Auto-save logic
    const saveChanges = async (updates) => {
        setSaving(true);
        try {
            const formData = new FormData();

            // If updating name
            if (updates.name !== undefined) {
                formData.append("name", updates.name);
            }
            // If updating image
            if (updates.image) {
                formData.append("image", updates.image);
            }

            const res = await api.put("/auth/update", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            // Update global context without reload
            updateUser({ name: res.data.name, photo: res.data.photo });

        } catch (err) {
            console.error(err);
            alert(t("error"));
        } finally {
            setSaving(false);
        }
    };

    const handleBlurName = () => {
        if (name !== user.name) {
            saveChanges({ name });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            // Immediately save when image is selected
            saveChanges({ image: file, name }); // Send name too to be safe, or just image if backend allows partial
        }
    };

    return (
        <div style={{
            paddingBottom: '80px',
            minHeight: '100vh',
            backgroundColor: '#F9FAFB',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '60px' // Space for fixed back button
        }}>

            {/* Back Button (Floating) */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    border: '1px solid #eee',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    color: '#666'
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>

            {/* Main Card */}
            <div style={{
                width: '100%',
                maxWidth: '480px',
                backgroundColor: 'white',
                borderRadius: '32px',
                padding: '2.5rem 2rem',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem'
            }}>

                {/* Header Text */}
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.5rem' }}>{t("profile_settings")}</h1>
                    <p style={{ color: '#999', fontSize: '0.95rem' }}>{t("manage_data_preferences")}</p>
                </div>

                {/* Photo Upload Section */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div
                        onMouseEnter={() => setIsHoveringPhoto(true)}
                        onMouseLeave={() => setIsHoveringPhoto(false)}
                        onClick={() => document.getElementById('profileInput').click()}
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            backgroundColor: '#F3F4F6',
                            backgroundImage: preview ? `url(${preview})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                            cursor: 'pointer',
                            border: '4px solid white',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.2s'
                        }}
                    >
                        {/* Initials fallback */}
                        {!preview && (
                            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ccc' }}>
                                {user?.name?.charAt(0).toUpperCase()}
                            </span>
                        )}

                        {/* Edit Overlay */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: isHoveringPhoto ? 1 : 0,
                            transition: 'opacity 0.2s'
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                        </div>

                        {/* Camera Icon Badge */}
                        <div style={{
                            position: 'absolute',
                            bottom: '0',
                            right: '0',
                            backgroundColor: 'var(--color-primary)',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '3px solid white'
                        }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </div>
                    </div>
                    <input
                        id="profileInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                    {/* Name Input */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#4B5563' }}>{t("name")}</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onBlur={handleBlurName}
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    borderRadius: '16px',
                                    border: '2px solid #E5E7EB',
                                    fontSize: '1rem',
                                    outline: 'none',
                                    transition: 'border-color 0.2s',
                                    backgroundColor: '#F9FAFB'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                                onBlurCapture={(e) => {
                                    e.target.style.borderColor = '#E5E7EB';
                                    handleBlurName();
                                }}
                            />
                            {saving && (
                                <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                                    <LoadingSpinner style={{ width: '20px', height: '20px', border: '2px solid #ddd', borderTop: '2px solid var(--color-primary)' }} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Email Input (Read-only) */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#4B5563' }}>{t("email")}</label>
                        <div style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '16px',
                            backgroundColor: '#F3F4F6',
                            color: '#9CA3AF',
                            border: '2px solid transparent',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            {email}
                        </div>
                    </div>

                    {/* Language Segmented Control */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 600, color: '#4B5563' }}>{t("language")}</label>
                        <div style={{
                            display: 'flex',
                            backgroundColor: '#F3F4F6',
                            padding: '4px',
                            borderRadius: '16px'
                        }}>
                            <button
                                type="button"
                                onClick={() => setLanguage('pt')}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    backgroundColor: language === 'pt' ? 'white' : 'transparent',
                                    boxShadow: language === 'pt' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                                    fontWeight: 600,
                                    color: language === 'pt' ? 'var(--color-primary)' : '#6B7280',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Português
                            </button>
                            <button
                                type="button"
                                onClick={() => setLanguage('en')}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '12px',
                                    border: 'none',
                                    backgroundColor: language === 'en' ? 'white' : 'transparent',
                                    boxShadow: language === 'en' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                                    fontWeight: 600,
                                    color: language === 'en' ? 'var(--color-primary)' : '#6B7280',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                English
                            </button>
                        </div>
                    </div>

                    {/* Management Section (Admin/Organizer) */}
                    {(user?.type === 'admin' || user?.type === 'organizer') && (
                        <div>
                            <label style={{ display: 'block', marginBottom: '12px', fontSize: '0.9rem', fontWeight: 600, color: '#4B5563' }}>Gestão</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {user.type === 'admin' && (
                                    <button
                                        type="button"
                                        onClick={() => navigate('/admin')}
                                        style={{
                                            padding: '14px',
                                            borderRadius: '16px',
                                            border: 'none',
                                            backgroundColor: '#1F2937',
                                            color: 'white',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            boxShadow: '0 4px 12px rgba(31, 41, 55, 0.2)'
                                        }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                        Painel de Admin
                                    </button>
                                )}
                                {user.type === 'organizer' && (
                                    <button
                                        type="button"
                                        onClick={() => navigate('/create')}
                                        style={{
                                            padding: '14px',
                                            borderRadius: '16px',
                                            border: 'none',
                                            backgroundColor: 'var(--color-secondary)',
                                            color: 'white',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            boxShadow: '0 4px 12px rgba(0, 51, 102, 0.2)'
                                        }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                        Criar Evento
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>

                        {/* Remove save button, auto save now */}

                        <button
                            type="button"
                            onClick={() => { logout(); navigate('/login'); }}
                            style={{
                                padding: '14px',
                                fontSize: '1rem',
                                background: 'transparent',
                                border: 'none',
                                color: '#EF4444',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                opacity: 0.8
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            {t("logout")}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
