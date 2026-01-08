import { useState } from "react";
import api from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Organizer() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("date", date);
      formData.append("location", location);
      formData.append("category", category);
      formData.append("isFree", isFree);

      if (image) {
        formData.append("image", image); // ⚠️ TEM de ser "image"
      }

      await api.post("/events", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);

      // limpar formulário
      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
      setCategory("");
      setIsFree(true);
      setImage(null);
    } catch (err) {
      console.error(err);
      setError("Erro ao criar evento");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />

      <main style={{ padding: "1rem" }}>
        <h1>Criar Evento</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <textarea
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Local"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Categoria"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <label>
            <input
              type="checkbox"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
            />
            Evento gratuito
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button type="submit" disabled={loading}>
            {loading ? "A criar..." : "Criar evento"}
          </button>

          {error && <p style={{ color: "red" }}>❌ {error}</p>}
          {success && <p style={{ color: "green" }}>✅ Evento criado com sucesso</p>}
        </form>
      </main>

      <Footer />
    </>
  );
}
