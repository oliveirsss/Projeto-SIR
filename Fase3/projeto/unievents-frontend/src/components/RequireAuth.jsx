import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <div>A carregar...</div>;

  if (!user) return <Navigate to="/" replace />;

  if (roles && !roles.includes(user.type)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
