async function loadEvents() {
  const res = await fetch("http://localhost:4000/api/events");
  const events = await res.json();

  const container = document.getElementById("events");
  container.innerHTML = "";

  events.forEach(event => {
    const div = document.createElement("div");
    div.className = "container";
    div.innerHTML = `
      <h3>${event.title}</h3>
      <p>${event.description}</p>
      <p><strong>Local:</strong> ${event.location}</p>
      <p><strong>Data:</strong> ${new Date(event.date).toLocaleString()}</p>
      <button onclick="viewEvent('${event._id}')">Ver Evento</button>
    `;
    container.appendChild(div);
  });
}

function viewEvent(id) {
  window.location.href = `event.html?id=${id}`;
}

loadEvents();
