import React from 'react';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, confirmColor, isAlert }) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(2px)'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '24px',
                width: '90%',
                maxWidth: '400px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                textAlign: 'center',
                animation: 'scaleIn 0.2s ease-out'
            }}>
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.4rem', color: '#111827' }}>{title || 'Confirmar'}</h3>
                <p style={{ margin: '0 0 2rem 0', color: '#6B7280', fontSize: '1rem', lineHeight: '1.5' }}>
                    {message || 'Tem a certeza?'}
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    {!isAlert && (
                        <button
                            onClick={onClose}
                            style={{
                                padding: '12px 24px',
                                borderRadius: '12px',
                                border: '1px solid #E5E7EB',
                                backgroundColor: 'white',
                                color: '#374151',
                                fontSize: '1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                flex: 1
                            }}
                        >
                            {cancelText || 'Cancelar'}
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (onConfirm) onConfirm();
                            onClose();
                        }}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '12px',
                            border: 'none',
                            backgroundColor: confirmColor || (isAlert ? 'var(--color-primary)' : '#EF4444'),
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            flex: 1,
                            boxShadow: `0 4px 12px ${confirmColor || (isAlert ? 'rgba(255,152,0,0.3)' : 'rgba(239, 68, 68, 0.2)')}`
                        }}
                    >
                        {confirmText || (isAlert ? 'OK' : 'Apagar')}
                    </button>
                </div>
            </div>
            <style>
                {`
          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
            </style>
        </div>
    );
}
