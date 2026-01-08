import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import socket from "../services/socket";
import { useAuth } from "../context/AuthContext";

export default function Event() {
  const { id } = useParams();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(0);

  // carregar dados
  useEffect(() => {
    async function loadData() {
      try {
        const eventRes = await api.get(`/events/${id}`);
        setEvent(eventRes.data);
        setRsvpCount(eventRes.data.goingCount || 0);

        const commentsRes = await api.get(`/events/${id}/comments`);
        setComments(commentsRes.data);

        if (user) {
          const rsvpRes = await api.get("/rsvps/me");
          const saved = rsvpRes.data.some(
            (r) => r.eventId === id || r.eventId?._id === id
          );
          setIsSaved(saved);
        }
      } catch {
        alert("Erro ao carregar evento");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, user]);

  // 🔌 SOCKET: ligar e entrar na room
  useEffect(() => {
    socket.connect();
    socket.emit("join-event", id);

    socket.on("new-comment", (comment) => {
      setComments((prev) => [comment, ...prev]);
    });

    return () => {
      socket.off("new-comment");
      socket.disconnect();
    };
  }, [id]);

  // RSVP
  async function toggleRsvp() {
    if (!user || saving) return;

    setSaving(true);

    try {
      if (isSaved) {
        await api.delete(`/rsvps/${id}`);
        setIsSaved(false);
        setRsvpCount((c) => Math.max(0, c - 1));
      } else {
        await api.post("/rsvps", { eventId: id });
        setIsSaved(true);
        setRsvpCount((c) => c + 1);
      }
    } catch {
      alert("Erro ao atualizar RSVP");
    } finally {
      setSaving(false);
    }
  }

  // comentar
  async function submitComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await api.post(`/events/${id}/comments`, {
        text: commentText,
      });

      setCommentText("");
      // NÃO adicionamos aqui → socket trata disso
    } catch {
      alert("Erro ao comentar");
    }
  }

  if (loading) return <p>A carregar evento...</p>;
  if (!event) return <p>Evento não encontrado</p>;

  return (
    <div style={{ padding: "1rem" }}>
      {event.image && (
        <img
          src={`http://localhost:4000/uploads/${event.image}`}
          alt={event.title}
          style={{ width: "100%", marginBottom: "1rem" }}
        />
      )}

      <h1>{event.title}</h1>
      <p>{event.description}</p>

      <p><strong>Local:</strong> {event.location}</p>
      <p><strong>Data:</strong> {new Date(event.date).toLocaleDateString("pt-PT")}</p>

      <p><strong>👥 {rsvpCount} participantes</strong></p>

      {user && (
        <button onClick={toggleRsvp} disabled={saving}>
          {isSaved ? "❌ Remover dos guardados" : "❤️ Guardar evento"}
        </button>
      )}

      <hr />

      <h3>Comentários</h3>

      {user && (
        <form onSubmit={submitComment}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Escreve um comentário..."
            rows={3}
            style={{ width: "100%" }}
          />
          <button type="submit">Comentar</button>
        </form>
      )}

      {comments.map((c) => (
        <div key={c._id} style={{ borderBottom: "1px solid #ddd", marginTop: "0.5rem" }}>
          <strong>{c.userId?.name}</strong>
          <p>{c.text}</p>
          <small>{new Date(c.createdAt).toLocaleString("pt-PT")}</small>
        </div>
      ))}
    </div>
  );
}
