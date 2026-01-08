import { useEffect, useState } from "react";
import api from "../services/api";
import EventCard from "../components/EventCard";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function User() {
  const [events, setEvents] = useState([]);
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const eventsRes = await api.get("/events");
        setEvents(eventsRes.data);

        const rsvpRes = await api.get("/rsvps/me");
        setSavedIds(rsvpRes.data.map((r) => r.eventId));
      } catch (err) {
        setError("Erro ao carregar eventos");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  function applyFilters() {
    let filtered = [...events];

    // pesquisa
    if (search) {
      filtered = filtered.filter((e) =>
        e.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // filtros
    if (filter === "today") {
      const today = new Date().toDateString();
      filtered = filtered.filter(
        (e) => new Date(e.date).toDateString() === today
      );
    }

    if (filter === "sport") {
      filtered = filtered.filter((e) => e.category === "Desporto");
    }

    if (filter === "free") {
      filtered = filtered.filter((e) => e.isFree);
    }

    if (filter === "saved") {
      filtered = filtered.filter((e) => savedIds.includes(e._id));
    }

    return filtered;
  }

  const filteredEvents = applyFilters();

  if (loading) return <p>A carregar eventos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Header />

      <main style={{ padding: "1rem" }}>
        <h1>Eventos</h1>

        {/* Pesquisa */}
        <input
          type="text"
          placeholder="Pesquisar eventos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", marginBottom: "0.5rem" }}
        />

        {/* Filtros */}
        <div style={{ marginBottom: "1rem" }}>
          <button onClick={() => setFilter("all")}>Todos</button>
          <button onClick={() => setFilter("today")}>Hoje</button>
          <button onClick={() => setFilter("sport")}>Desporto</button>
          <button onClick={() => setFilter("free")}>Gratuito</button>
          <button onClick={() => setFilter("saved")}>Guardado</button>
        </div>

        {/* Lista */}
        {filteredEvents.length === 0 && (
          <p>Sem eventos disponíveis</p>
        )}

        {filteredEvents.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            isSaved={savedIds.includes(event._id)}
          />
        ))}
      </main>

      <Footer />
    </>
  );
}
