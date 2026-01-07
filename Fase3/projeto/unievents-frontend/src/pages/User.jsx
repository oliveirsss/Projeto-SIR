import { useEffect, useState } from "react";
import api from "../services/api";
import EventCard from "../components/EventCard";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function User() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Erro ao carregar eventos", err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return (
    <>
      <Header title="Eventos" />

      <main className="page">
        {loading && <p>A carregar eventos...</p>}
        {error && <p className="error">{error}</p>}

        <div className="events-list">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}