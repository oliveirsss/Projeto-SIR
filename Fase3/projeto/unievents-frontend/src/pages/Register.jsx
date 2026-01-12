import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { register } = useAuth();
    const navigate = useNavigate();
    const { t } = useLanguage();

    async function handleRegister(e) {
        e.preventDefault();
        setError("");

        try {
            await register(name, email, password);
            // If successful, register function in context handles token storage
            // and we just redirect to home
            navigate("/");
        } catch (err) {
            setError(t("error"));
        }
    }

    return (
        <div className="login-page">
            {/* Left Side - Image/Brand */}
            <div className="login-image">
                {/* Dark Overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3))' }}></div>

                <div style={{ position: 'relative', zIndex: 10 }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.1 }}>
                        UniEvents
                    </h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '400px', lineHeight: 1.6 }}>
                        {t("find_best_events")}
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="login-side">
                {/* Mobile-only background hint (soft gradient) */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(249,250,251,1) 100%)',
                    zIndex: -1
                }}></div>

                <div style={{ width: '100%', maxWidth: '420px' }}>

                    <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>{t("create_account")}</h2>
                        <p style={{ color: '#6B7280', fontSize: '1rem' }}>Junte-se à comunidade académica!</p>
                    </div>

                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                        {/* Name Input */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>{t("name")}</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Ex: Ana Silva"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '14px 14px 14px 48px',
                                        borderRadius: '12px',
                                        border: '2px solid #E5E7EB',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        backgroundColor: '#F9FAFB'
                                    }}
                                    onFocus={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.borderColor = 'var(--color-primary)'; }}
                                    onBlur={(e) => { e.target.style.backgroundColor = '#F9FAFB'; e.target.style.borderColor = '#E5E7EB'; }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>{t("email")}</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                </div>
                                <input
                                    type="email"
                                    placeholder="exemplo@ipvc.pt"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '14px 14px 14px 48px',
                                        borderRadius: '12px',
                                        border: '2px solid #E5E7EB',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        backgroundColor: '#F9FAFB'
                                    }}
                                    onFocus={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.borderColor = 'var(--color-primary)'; }}
                                    onBlur={(e) => { e.target.style.backgroundColor = '#F9FAFB'; e.target.style.borderColor = '#E5E7EB'; }}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>{t("password")}</label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '14px 14px 14px 48px',
                                        borderRadius: '12px',
                                        border: '2px solid #E5E7EB',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'all 0.2s',
                                        backgroundColor: '#F9FAFB'
                                    }}
                                    onFocus={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.borderColor = 'var(--color-primary)'; }}
                                    onBlur={(e) => { e.target.style.backgroundColor = '#F9FAFB'; e.target.style.borderColor = '#E5E7EB'; }}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div style={{ backgroundColor: '#FEF2F2', color: '#B91C1C', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                                padding: '16px',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                borderRadius: '14px',
                                background: 'linear-gradient(135deg, var(--color-primary) 0%, #FFB74D 100%)',
                                boxShadow: '0 4px 15px rgba(255, 152, 0, 0.25)',
                                marginTop: '1rem'
                            }}
                        >
                            {t("register")}
                        </button>
                    </form>

                    <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                        <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
                            {t("have_account")} <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '700', textDecoration: 'none' }}>{t("login")}</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
