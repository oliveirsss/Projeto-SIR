require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const eventsRoutes = require('./routes/events.routes');
const adminRoutes = require('./routes/admin.routes');
const socketSetup = require('./sockets');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET','POST']
  }
});

// setup sockets
socketSetup(io);

// make io available in routes/controllers
app.set('io', io);

// middlewares
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/admin', adminRoutes);

// error handler
app.use(errorMiddleware);

// connect db and start server
const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGODB_URI).then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
