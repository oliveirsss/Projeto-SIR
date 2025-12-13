const API_URL = "http://localhost:4000/api";
const token = localStorage.getItem("token");

const eventId = new URLSearchParams(window.location.search).get("id");

function goBack() {
  window.location.href = "events.html";
}

async function loadEvent() {
  const res = await fetch(`${API_URL}/events`);
  const events = await res.json();
  const event = events.find(e => e._id === eventId);

  const div = document.getElementById("event");
  div.innerHTML = `
    <h2>${event.title}</h2>
    <p>${event.description}</p>
    <p><strong>Local:</strong> ${event.location}</p>
    <p><strong>Data:</strong> ${new Date(event.date).toLocaleString()}</p>
  `;
}

async function loadComments() {
  const res = await fetch(`${API_URL}/events/${eventId}/comments`);
  const comments = await res.json();

  document.getElementById("comments").innerHTML = "";
  comments.forEach(addComment);
}

function addComment(comment) {
  const div = document.createElement("div");
  div.className = "container";
  div.innerHTML = `<strong>${comment.userId.name}</strong>: ${comment.text}`;
  document.getElementById("comments").appendChild(div);
}

async function sendComment() {
  const text = document.getElementById("commentText").value;

  await fetch(`${API_URL}/events/${eventId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  });

  document.getElementById("commentText").value = "";
}

async function rsvp() {
  await fetch(`${API_URL}/events/${eventId}/rsvp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ status: "going" })
  });

  alert("RSVP registado!");
}

loadEvent();
loadComments();
