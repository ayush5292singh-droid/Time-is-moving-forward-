const PIN = "7890";

let keys = JSON.parse(
  localStorage.getItem("keyvaultKeys") || "[]"
);


/* PIN */

function unlock() {

  const pin = document.getElementById("pin").value;

  if (pin === PIN) {

    document.getElementById("lockScreen").style.display = "none";
    document.getElementById("app").style.display = "block";

    renderKeys();

  } else {

    document.getElementById("pinError").textContent =
      "Incorrect PIN";

    document.getElementById("pin").value = "";
  }
}


function lockVault() {

  document.getElementById("app").style.display = "none";
  document.getElementById("lockScreen").style.display = "flex";

  document.getElementById("pin").value = "";
}


/* ADD */

function openAdd() {
  document.getElementById("addBox").style.display = "block";

  document.getElementById("addBox").scrollIntoView({
    behavior: "smooth"
  });
}


function closeAdd() {
  document.getElementById("addBox").style.display = "none";
}


function saveKey() {

  const provider =
    document.getElementById("provider").value.trim();

  const name =
    document.getElementById("keyName").value.trim();

  const key =
    document.getElementById("apiKey").value.trim();

  if (!provider || !name || !key) {
    alert("Please fill all fields.");
    return;
  }

  keys.push({
    id: Date.now(),
    provider: provider,
    name: name,
    key: key
  });

  localStorage.setItem(
    "keyvaultKeys",
    JSON.stringify(keys)
  );

  document.getElementById("provider").value = "";
  document.getElementById("keyName").value = "";
  document.getElementById("apiKey").value = "";

  closeAdd();
  renderKeys();

  alert("✅ API key saved!");
}


/* DISPLAY */

function renderKeys() {

  const container =
    document.getElementById("keys");

  document.getElementById("count").textContent =
    keys.length;

  if (keys.length === 0) {

    container.innerHTML =
      "<p style='color:#777f96;'>No API keys yet.</p>";

    return;
  }

  container.innerHTML = "";

  keys.forEach(item => {

    const card =
      document.createElement("div");

    card.className = "keyCard";

    card.innerHTML = `
      <div>🔑</div>

      <div class="keyInfo">

        <small>${safe(item.provider)}</small>

        <b>${safe(item.name)}</b>

        <div class="keyValue"
             id="value-${item.id}">
          ••••••••••••••••
        </div>

      </div>

      <div class="keyActions">

        <button onclick="revealKey(${item.id})">
          👁️
        </button>

        <button onclick="copyKey(${item.id})">
          📋
        </button>

        <button onclick="deleteKey(${item.id})">
          🗑️
        </button>

      </div>
    `;

    container.appendChild(card);
  });
}


/* REVEAL */

function revealKey(id) {

  const item = keys.find(k => k.id === id);

  const element =
    document.getElementById("value-" + id);

  if (element.textContent.includes("•")) {

    element.textContent = item.key;

  } else {

    element.textContent = "••••••••••••••••";
  }
}


/* COPY */

async function copyKey(id) {

  const item = keys.find(k => k.id === id);

  try {

    await navigator.clipboard.writeText(item.key);

    alert("✅ Key copied!");

  } catch {

    alert("Could not copy the key.");
  }
}


/* DELETE */

function deleteKey(id) {

  if (!confirm("Delete this API key?")) return;

  keys = keys.filter(k => k.id !== id);

  localStorage.setItem(
    "keyvaultKeys",
    JSON.stringify(keys)
  );

  renderKeys();
}


/* NAVIGATION */

function goHome() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function showKeys() {

  document.getElementById("keysSection")
    .scrollIntoView({
      behavior: "smooth"
    });
}


function showBalance() {
  alert("💰 Balance system comes in Part 5.");
}


function showSettings() {
  alert("⚙️ Settings will come later.");
}


/* SAFETY */

function safe(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;
}
