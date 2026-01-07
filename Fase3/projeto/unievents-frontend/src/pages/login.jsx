import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);

      const user = JSON.parse(localStorage.getItem("user"));

      if (user.type === "student") navigate("/user");
      else if (user.type === "organizer") navigate("/organizer");
      else if (user.type === "admin") navigate("/admin");
    } catch {
      setError("Credenciais inválidas");
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Entrar</button>

      {error && <p>{error}</p>}
    </form>
  );
}
