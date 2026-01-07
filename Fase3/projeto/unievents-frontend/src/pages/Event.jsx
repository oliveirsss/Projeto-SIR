import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../services/api";

export default function Event() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        setError("Evento não encontrado");
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id]);

  if (loading) {
    return <p style={{ padding: 20 }}>A carregar evento...</p>;
  }

  if (error) {
    return (
      <>
        <Header title="Erro" />
        <p style={{ padding: 20 }}>{error}</p>
        <button onClick={() => navigate(-1)}>Voltar</button>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header title="Detalhes do Evento" />

      <main style={{ padding: 20 }}>
        <img
          src={event.image || "https://placehold.co/800x500"}
          alt={event.title}
          style={{ width: "100%", borderRadius: 8 }}
        />

        <h1>{event.title}</h1>
        <p>{event.description}</p>

        <p><strong>📍 Local:</strong> {event.location}</p>
        <p><strong>📅 Data:</strong> {new Date(event.date).toLocaleDateString("pt-PT")}</p>
        <p><strong>🏷 Categoria:</strong> {event.category}</p>

        <p>
          <strong>💰 Preço:</strong>{" "}
          {event.isFree ? "Gratuito" : "Pago"}
        </p>

        <button style={{ marginTop: 20 }} onClick={() => navigate(-1)}>
          ← Voltar
        </button>
      </main>

      <Footer />
    </>
  );
}
