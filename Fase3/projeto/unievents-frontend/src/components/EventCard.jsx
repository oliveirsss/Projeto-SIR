import { useNavigate } from "react-router-dom";

export default function EventCard({ event }) {
  const navigate = useNavigate();

  return (
    <div
      className="event-card"
      onClick={() => navigate(`/event/${event._id}`)}
    >
      <img
        src={event.image || "https://placehold.co/600x400"}
        alt={event.title}
      />

      <div className="event-info">
        <h3>{event.title}</h3>
        <p>{event.location}</p>

        <span className={event.isFree ? "badge free" : "badge paid"}>
          {event.isFree ? "Gratuito" : "Pago"}
        </span>
      </div>
    </div>
  );
}