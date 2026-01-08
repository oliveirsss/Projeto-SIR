import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import User from "./pages/User";
import Event from "./pages/Event";
import Organizer from "./pages/Organizer";
import Admin from "./pages/Admin";
import RequireAuth from "./components/RequireAuth";

export default function App() {
  return (
    <Routes>

      {/* público */}
      <Route path="/" element={<Login />} />

      {/* student */}
      <Route
        path="/user"
        element={
          <RequireAuth roles={["student"]}>
            <User />
          </RequireAuth>
        }
      />

      {/* qualquer utilizador autenticado */}
      <Route
        path="/event/:id"
        element={
          <RequireAuth>
            <Event />
          </RequireAuth>
        }
      />

      {/* organizer */}
      <Route
        path="/organizer"
        element={
          <RequireAuth roles={["organizer"]}>
            <Organizer />
          </RequireAuth>
        }
      />

      {/* admin */}
      <Route
        path="/admin"
        element={
          <RequireAuth roles={["admin"]}>
            <Admin />
          </RequireAuth>
        }
      />

    </Routes>
  );
}
