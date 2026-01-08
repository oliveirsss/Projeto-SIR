const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const path = require("path");

const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/events.routes");
const rsvpRoutes = require("./routes/rsvp.routes");

const app = express();
const server = http.createServer(app);

// SOCKET
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// tornar socket acessível nos controllers
app.set("io", io);

// middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/rsvps", rsvpRoutes);

// mongo
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

// socket logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-event", (eventId) => {
    socket.join(eventId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log("Server running on port", PORT)
);
