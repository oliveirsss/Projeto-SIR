module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected', socket.id);

    //juntar cliente a rooms por evento: front envia socket.emit('join-event', eventId)
    socket.on('join-event', (eventId) => {
      socket.join(`event_${eventId}`);
    });

    socket.on('leave-event', (eventId) => {
      socket.leave(`event_${eventId}`);
    });

    socket.on('send-message', ({ eventId, text, user }) => {
      const payload = {
        eventId,
        text,
        user,
        createdAt: new Date()
      };
      io.to(`event_${eventId}`).emit('message', payload);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected', socket.id);
    });
  });
};
