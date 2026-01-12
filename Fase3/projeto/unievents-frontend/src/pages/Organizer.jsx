import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useLanguage } from "../context/LanguageContext";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { id } = useParams(); // Check if editing
  const { t } = useLanguage();

  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Outro");
  // const [price, setPrice] = useState(""); // Removed as per user request
  const [isFree, setIsFree] = useState(true);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load data if editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get(`/events/${id}`)
        .then(res => {
          const ev = res.data;
          setTitle(ev.title);
          setTitleEn(ev.titleEn || "");
          setDescription(ev.description);
          setDescriptionEn(ev.descriptionEn || "");
          setDate(ev.date ? new Date(ev.date).toISOString().slice(0, 16) : "");
          setLocation(ev.location);
          setCategory(ev.category);
          setIsFree(ev.isFree);
          // setPrice(ev.price || "");
          if (ev.image) setPreview(`http://localhost:4000${ev.image}`);
        })
        .catch(err => setError(t("error")))
        .finally(() => setLoading(false));
    }
  }, [id, t]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("titleEn", titleEn);
      formData.append("description", description);
      formData.append("descriptionEn", descriptionEn);
      formData.append("date", date);
      formData.append("location", location);
      formData.append("category", category);
      formData.append("isFree", isFree);
      // if (!isFree) formData.append("price", price);

      if (image) {
        formData.append("image", image);
      }

      if (id) {
        // Edit
        await api.put(`/events/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Create
        await api.post("/events", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/"); // Redirect to feed after success
    } catch (err) {
      console.error(err);
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div style={{ paddingBottom: '80px', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>

      {/* Header simple */}
      <div style={{
        backgroundColor: 'var(--header-bg)',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <h1 style={{ fontSize: '1.2rem', margin: 0 }}>{id ? t("edit") : t("create_new_event")}</h1>
      </div>

      <div className="container" style={{ marginTop: '2rem' }}>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Image Upload */}
          <div style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#e0e0e0',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
            cursor: 'pointer',
            border: '2px dashed #ccc'
          }} onClick={() => document.getElementById('fileInput').click()}>
            {preview ? (
              <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ textAlign: 'center', color: '#666' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginBottom: '10px' }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                <p>{t("upload_cover")}</p>
              </div>
            )}
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>

          <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#444' }}>{t("title")}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Jantar de Curso"
                required
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#444' }}>{t("title_en")}</label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="Ex: Course Dinner"
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#444' }}>{t("category")}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', backgroundColor: 'white' }}
            >
              <option value="Desporto">Desporto</option>
              <option value="Cultura">Cultura</option>
              <option value="Academico">Académico</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#444' }}>{t("date_time")}</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#444' }}>{t("location")}</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ex: ESTG - Sala 1.2"
              required
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', color: '#444', marginBottom: '10px' }}>
              <input
                type="checkbox"
                checked={isFree}
                onChange={(e) => setIsFree(e.target.checked)}
                style={{ width: '20px', height: '20px' }}
              />
              {t("is_free")}
            </label>

            {/* Price input removed as per request */}
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#444' }}>{t("description")}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("description")}
              rows={4}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', marginBottom: '1rem' }}
            />

            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#444' }}>{t("description_en")}</label>
            <textarea
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              placeholder={t("description_en")}
              rows={4}
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem' }}
            />
          </div>

          {error && <p style={{ color: "red", textAlign: 'center' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '14px', fontSize: '1.1rem', marginTop: '10px' }}
          >
            {loading ? t("publishing") : (id ? t("save_changes") : t("publish"))}
          </button>

        </form>
      </div>
    </div>
  );
}
