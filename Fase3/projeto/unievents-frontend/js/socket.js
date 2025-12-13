const socket = io("http://localhost:4000");

const eventId = new URLSearchParams(window.location.search).get("id");

socket.on("connect", () => {
  console.log("Socket ligado:", socket.id);
  socket.emit("join-event", eventId);
});

socket.on("new-comment", (comment) => {
  addComment(comment);
});
