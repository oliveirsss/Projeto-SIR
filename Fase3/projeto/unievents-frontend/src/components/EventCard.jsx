import { useNavigate } from "react-router-dom";

export default function EventCard({ event }) {
  const navigate = useNavigate();

  const imageUrl = event.image
    ? `http://localhost:4000${event.image}`
    : "/placeholder.png";

  return (
    <div className="event-card" onClick={() => navigate(`/event/${event._id}`)}>
      <img src={imageUrl} alt={event.title} />

      <h3>{event.title}</h3>
      <p>{event.location}</p>

      <span className={event.isFree ? "badge free" : "badge paid"}>
        {event.isFree ? "Gratuito" : "Pago"}
      </span>
    </div>
  );
}
