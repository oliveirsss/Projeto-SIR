async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await apiRequest("/auth/login", "POST", { email, password });

    if (res.token) {
      localStorage.setItem("token", res.token);
      window.location.href = "events.html";
    } else {
      document.getElementById("message").innerText = res.message || "Erro no login";
    }
  } catch (err) {
    document.getElementById("message").innerText = "Erro no servidor";
  }
}

async function register() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const type = document.getElementById("registerType").value;

  try {
    const res = await apiRequest("/auth/register", "POST", {
      name, email, password, type
    });

    if (res.token) {
      localStorage.setItem("token", res.token);
      window.location.href = "events.html";
    } else {
      document.getElementById("message").innerText = res.message || "Erro no registo";
    }
  } catch (err) {
    document.getElementById("message").innerText = "Erro no servidor";
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

// proteção simples
if (window.location.pathname.includes("events.html")) {
  if (!localStorage.getItem("token")) {
    window.location.href = "index.html";
  }
}
