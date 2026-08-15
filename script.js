const PIN = "7890";

function unlock() {

  const entered = document.getElementById("pinInput").value;
  const error = document.getElementById("error");

  if (entered === PIN) {

    document.getElementById("lockScreen").style.display = "none";
    document.getElementById("mainApp").style.display = "block";

  } else {

    error.textContent = "Incorrect PIN";
    document.getElementById("pinInput").value = "";

  }
}
