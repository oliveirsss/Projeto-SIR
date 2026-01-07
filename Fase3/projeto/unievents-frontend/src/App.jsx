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
      <Route path="/" element={<Login />} />

      <Route path="/user" element={
          <RequireAuth role="student">
            <User />
          </RequireAuth>
        }
      />

      <Route path="/event/:id" element={
          <RequireAuth>
            <Event />
          </RequireAuth>
        }
      />

      <Route path="/organizer" element={
          <RequireAuth role="organizer">
            <Organizer />
          </RequireAuth>
        }
      />

      <Route path="/admin" element={
          <RequireAuth role="admin">
            <Admin />
          </RequireAuth>
        }
      />

      <Route path="/event/:id" element={<Event />} />
    </Routes>
  );
}
