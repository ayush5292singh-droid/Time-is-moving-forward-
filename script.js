const PIN = "7890";

let apiKeys = JSON.parse(
  localStorage.getItem("keyvault_keys") || "[]"
);


/* =========================
   PIN SYSTEM
========================= */

function unlock() {

  const entered =
    document.getElementById("pinInput").value;

  const error =
    document.getElementById("error");

  if (entered === PIN) {

    error.textContent = "";

    document.getElementById("lockScreen")
      .style.display = "none";

    document.getElementById("mainApp")
      .style.display = "block";

    updateKeyCount();
    renderKeys();

  } else {

    error.textContent =
      "Incorrect PIN";

    document.getElementById("pinInput")
      .value = "";

  }
}


function lockVault() {

  document.getElementById("mainApp")
    .style.display = "none";

  document.getElementById("lockScreen")
    .style.display = "flex";

  document.getElementById("pinInput")
    .value = "";

}


/* =========================
   ADD KEY
========================= */

function openAddKey() {

  document.getElementById("addKeyPanel")
    .style.display = "block";

  document.getElementById("addKeyPanel")
    .scrollIntoView({
      behavior: "smooth"
    });
}


function closeAddKey() {

  document.getElementById("addKeyPanel")
    .style.display = "none";

}


function saveKey() {

  const provider =
    document.getElementById("providerInput")
      .value.trim();

  const name =
    document.getElementById("keyNameInput")
      .value.trim();

  const key =
    document.getElementById("apiKeyInput")
      .value.trim();

  if (!provider || !name || !key) {

    alert("Please fill all fields.");

    return;
  }

  const newKey = {

    id: Date.now(),

    provider: provider,

    name: name,

    key: key

  };

  apiKeys.push(newKey);

  localStorage.setItem(
    "keyvault_keys",
    JSON.stringify(apiKeys)
  );

  document.getElementById("providerInput")
    .value = "";

  document.getElementById("keyNameInput")
    .value = "";

  document.getElementById("apiKeyInput")
    .value = "";

  closeAddKey();

  updateKeyCount();

  renderKeys();

  alert("✅ API key saved.");

}


/* =========================
   DISPLAY KEYS
========================= */

function renderKeys() {

  const container =
    document.getElementById("keysContainer");

  if (apiKeys.length === 0) {

    container.innerHTML = `

      <div class="empty-vault">

        <div class="empty-icon">
          🔑
        </div>

        <h2>Your vault is empty</h2>

        <p>
          Add your first API key.
        </p>

        <button
          class="primary-button"
          onclick="openAddKey()"
        >
          + Add API Key
        </button>

      </div>

    `;

    return;
  }


  container.innerHTML = "";


  apiKeys.forEach(item => {

    const card =
      document.createElement("div");

    card.className = "stat-card";

    card.style.marginBottom = "15px";

    card.innerHTML = `

      <div class="stat-icon purple">
        🔑
      </div>

      <div style="flex:1;">

        <span>
          ${escapeHTML(item.provider)}
        </span>

        <strong>
          ${escapeHTML(item.name)}
        </strong>

        <small id="key-${item.id}">
          ••••••••••••••••
        </small>

      </div>

      <div>

        <button
          onclick="revealKey(${item.id})"
          style="margin-right:5px;"
        >
          👁️
        </button>

        <button
          onclick="copyKey(${item.id})"
          style="margin-right:5px;"
        >
          📋
        </button>

        <button
          onclick="deleteKey(${item.id})"
        >
          🗑️
        </button>

      </div>

    `;

    container.appendChild(card);

  });

}


/* =========================
   REVEAL
========================= */

function revealKey(id) {

  const item =
    apiKeys.find(key => key.id === id);

  const element =
    document.getElementById(`key-${id}`);

  if (!item || !element) return;


  if (element.dataset.revealed === "true") {

    element.textContent =
      "••••••••••••••••";

    element.dataset.revealed = "false";

  } else {

    element.textContent =
      item.key;

    element.dataset.revealed = "true";

  }

}


/* =========================
   COPY
========================= */

async function copyKey(id) {

  const item =
    apiKeys.find(key => key.id === id);

  if (!item) return;


  try {

    await navigator.clipboard.writeText(
      item.key
    );

    alert("✅ API key copied.");

  } catch {

    alert(
      "Clipboard access was blocked by the browser."
    );

  }

}


/* =========================
   DELETE
========================= */

function deleteKey(id) {

  const confirmDelete =
    confirm(
      "Delete this API key?"
    );

  if (!confirmDelete) return;


  apiKeys =
    apiKeys.filter(
      key => key.id !== id
    );


  localStorage.setItem(
    "keyvault_keys",
    JSON.stringify(apiKeys)
  );


  updateKeyCount();

  renderKeys();

}


/* =========================
   KEY COUNT
========================= */

function updateKeyCount() {

  document.getElementById("keyCount")
    .textContent = apiKeys.length;

}


/* =========================
   NAVIGATION
========================= */

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

  alert(
    "💰 Balance & usage will be built in Part 5."
  );

}


function showSettings() {

  alert(
    "⚙️ Settings will be built in Part 8."
  );

}


/* =========================
   SAFETY
========================= */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}
