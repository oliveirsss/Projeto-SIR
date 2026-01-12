import React from 'react';

export default function LoadingSpinner() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100%',
            backgroundColor: 'transparent' // Or specific background if needed
        }}>
            <div style={{
                width: '50px',
                height: '50px',
                border: '5px solid #f3f3f3',
                borderTop: '5px solid var(--color-primary)',
                borderRight: '5px solid var(--color-secondary)',
                borderBottom: '5px solid var(--color-primary)',
                borderLeft: '5px solid var(--color-secondary)',
                borderRadius: '50%',
                animation: 'spin 1.5s linear infinite'
            }}></div>
        </div>
    );
}
