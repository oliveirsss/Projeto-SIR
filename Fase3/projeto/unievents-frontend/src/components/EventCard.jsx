import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getImageUrl } from '../utils/config';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const displayTitle = (language === 'en' && event.titleEn && event.titleEn.trim()) ? event.titleEn : event.title;

  return (
    <div
      onClick={() => navigate(`/evento/${event._id}`, { state: { fromFeed: true } })}
      style={{
        backgroundColor: 'var(--color-primary)', // Laranja background card
        padding: '10px 10px 0 10px',
        borderRadius: '16px',
        cursor: 'pointer',
        marginBottom: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}
    >
      {/* Image Container */}
      <div style={{
        width: '100%',
        height: '180px',
        borderRadius: '12px 12px 0 0',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#ddd'
      }}>
        <img
          src={getImageUrl(event.image)}
          alt={displayTitle}
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400?text=Sem+Imagem"; }}
          referrerPolicy="no-referrer"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />

        {/* Overlay Text inside image (optional, as seen in mockup 'Tecnologias desenvolvidas...') */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          right: '10px',
          backgroundColor: 'rgba(255, 152, 0, 0.9)', // Orange opacity
          color: 'white',
          padding: '5px 10px',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          borderRadius: '4px'
        }}>
          {displayTitle}
        </div>
      </div>

      {/* Footer Information */}
      <div style={{
        backgroundColor: 'var(--color-surface)',
        padding: '12px',
        borderRadius: '0 0 12px 12px',
        marginTop: '-4px', // Connect with top
        marginBottom: '10px', // Space before bottom of orange card
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{
          fontSize: '1rem',
          fontWeight: 'bold',
          color: '#000',
          margin: 0,
          maxWidth: '60%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {displayTitle}
        </h3>

        <div style={{ textAlign: 'right' }}>
          <span style={{
            fontSize: '0.75rem',
            color: '#000',
            fontWeight: 'bold',
            display: 'block'
          }}>
            {t("location")}:
          </span>
          <span style={{
            fontSize: '0.75rem',
            color: '#000'
          }}>
            {event.location}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
