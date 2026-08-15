/* =========================
   SETTINGS
========================= */

const CORRECT_PIN = "7890";

let apiKeys = [];


/* =========================
   LOAD SAVED KEYS
========================= */

try {

  apiKeys =
    JSON.parse(
      localStorage.getItem("keyvault_api_keys")
    ) || [];

} catch {

  apiKeys = [];

}


/* =========================
   WAIT FOR PAGE
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    /* UNLOCK BUTTON */

    document
      .getElementById("unlockButton")
      .addEventListener(
        "click",
        unlockVault
      );


    /* ENTER KEY */

    document
      .getElementById("pinInput")
      .addEventListener(
        "keydown",
        function (event) {

          if (event.key === "Enter") {

            unlockVault();

          }

        }
      );


    /* LOCK BUTTON */

    document
      .getElementById("lockButton")
      .addEventListener(
        "click",
        lockVault
      );


    /* ADD KEY */

    document
      .getElementById("addKeyButton")
      .addEventListener(
        "click",
        openAddKey
      );


    /* KEYS */

    document
      .getElementById("keysButton")
      .addEventListener(
        "click",
        showKeys
      );


    /* BALANCE */

    document
      .getElementById("balanceButton")
      .addEventListener(
        "click",
        showBalance
      );


    /* SETTINGS */

    document
      .getElementById("settingsButton")
      .addEventListener(
        "click",
        showSettings
      );


    /* SAVE */

    document
      .getElementById("saveKeyButton")
      .addEventListener(
        "click",
        saveKey
      );


    /* CANCEL */

    document
      .getElementById("cancelKeyButton")
      .addEventListener(
        "click",
        closeAddKey
      );


    /* NAVIGATION */

    document
      .getElementById("homeNav")
      .addEventListener(
        "click",
        goHome
      );


    document
      .getElementById("keysNav")
      .addEventListener(
        "click",
        showKeys
      );


    document
      .getElementById("balanceNav")
      .addEventListener(
        "click",
        showBalance
      );


    document
      .getElementById("settingsNav")
      .addEventListener(
        "click",
        showSettings
      );


    renderKeys();

  }
);


/* =========================
   UNLOCK
========================= */

function unlockVault() {

  const pin =
    document
      .getElementById("pinInput")
      .value;

  const error =
    document
      .getElementById("pinError");


  if (pin === CORRECT_PIN) {

    error.textContent = "";

    document
      .getElementById("lockScreen")
      .style.display = "none";

    document
      .getElementById("mainApp")
      .style.display = "block";

    renderKeys();

  } else {

    error.textContent =
      "❌ Incorrect PIN";

    document
      .getElementById("pinInput")
      .value = "";

  }

}


/* =========================
   LOCK
========================= */

function lockVault() {

  document
    .getElementById("mainApp")
    .style.display = "none";

  document
    .getElementById("lockScreen")
    .style.display = "flex";

  document
    .getElementById("pinInput")
    .value = "";

  document
    .getElementById("pinError")
    .textContent = "";

}


/* =========================
   ADD KEY
========================= */

function openAddKey() {

  const panel =
    document
      .getElementById("addKeyPanel");

  panel.style.display = "block";

  panel.scrollIntoView({
    behavior: "smooth"
  });

}


function closeAddKey() {

  document
    .getElementById("addKeyPanel")
    .style.display = "none";

}


/* =========================
   SAVE KEY
========================= */

function saveKey() {

  const provider =
    document
      .getElementById("providerInput")
      .value
      .trim();

  const name =
    document
      .getElementById("keyNameInput")
      .value
      .trim();

  const key =
    document
      .getElementById("apiKeyInput")
      .value
      .trim();


  if (
    provider === "" ||
    name === "" ||
    key === ""
  ) {

    alert(
      "Please fill all fields."
    );

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
    "keyvault_api_keys",
    JSON.stringify(apiKeys)
  );


  document
    .getElementById("providerInput")
    .value = "";

  document
    .getElementById("keyNameInput")
    .value = "";

  document
    .getElementById("apiKeyInput")
    .value = "";


  closeAddKey();

  renderKeys();

}


/* =========================
   SHOW KEYS
========================= */

function renderKeys() {

  const container =
    document
      .getElementById("keysContainer");

  const count =
    document
      .getElementById("keyCount");


  count.textContent =
    apiKeys.length;


  container.innerHTML = "";


  if (apiKeys.length === 0) {

    container.innerHTML = `
      <p style="
        color:#777f96;
        padding:20px 0;
      ">
        🔐 No API keys saved yet.
      </p>
    `;

    return;

  }


  apiKeys.forEach(
    function (item) {

      const card =
        document.createElement("div");

      card.className =
        "key-card";


      card.innerHTML = `

        <div style="font-size:28px;">
          🔑
        </div>

        <div class="key-info">

          <small>
            ${escapeHTML(item.provider)}
          </small>

          <strong>
            ${escapeHTML(item.name)}
          </strong>

          <div
            class="key-value"
            id="key-${item.id}"
          >
            ••••••••••••••••
          </div>

        </div>

        <div class="key-actions">

          <button
            data-action="reveal"
            data-id="${item.id}"
          >
            👁️
          </button>

          <button
            data-action="copy"
            data-id="${item.id}"
          >
            📋
          </button>

          <button
            data-action="delete"
            data-id="${item.id}"
          >
            🗑️
          </button>

        </div>

      `;


      container.appendChild(card);

    }
  );

}


/* =========================
   KEY BUTTONS
========================= */

document.addEventListener(
  "click",
  function (event) {

    const button =
      event.target.closest(
        "[data-action]"
      );


    if (!button) return;


    const id =
      Number(
        button.dataset.id
      );


    const action =
      button.dataset.action;


    if (action === "reveal") {

      revealKey(id);

    }


    if (action === "copy") {

      copyKey(id);

    }


    if (action === "delete") {

      deleteKey(id);

    }

  }
);


/* =========================
   REVEAL
========================= */

function revealKey(id) {

  const item =
    apiKeys.find(
      function (key) {

        return key.id === id;

      }
    );


  const element =
    document.getElementById(
      "key-" + id
    );


  if (!item || !element) return;


  if (
    element.dataset.revealed === "true"
  ) {

    element.textContent =
      "••••••••••••••••";

    element.dataset.revealed =
      "false";

  } else {

    element.textContent =
      item.key;

    element.dataset.revealed =
      "true";

  }

}


/* =========================
   COPY
========================= */

async function copyKey(id) {

  const item =
    apiKeys.find(
      function (key) {

        return key.id === id;

      }
    );


  if (!item) return;


  try {

    await navigator.clipboard.writeText(
      item.key
    );

    alert(
      "✅ API key copied!"
    );

  } catch {

    alert(
      "Clipboard access was blocked."
    );

  }

}


/* =========================
   DELETE
========================= */

function deleteKey(id) {

  const answer =
    confirm(
      "Delete this API key?"
    );


  if (!answer) return;


  apiKeys =
    apiKeys.filter(
      function (key) {

        return key.id !== id;

      }
    );


  localStorage.setItem(
    "keyvault_api_keys",
    JSON.stringify(apiKeys)
  );


  renderKeys();

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

  document
    .getElementById("keysSection")
    .scrollIntoView({
      behavior: "smooth"
    });

}


function showBalance() {

  alert(
    "💰 Balance will be built in Part 5."
  );

}


function showSettings() {

  alert(
    "⚙️ Settings will be built later."
  );

}


/* =========================
   ESCAPE TEXT
========================= */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}
