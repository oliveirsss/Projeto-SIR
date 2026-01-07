import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return <div>A carregar...</div>;

  if (!user) return <Navigate to="/" />;

  if (role && user.type !== role) return <Navigate to="/" />;

  return children;
}
