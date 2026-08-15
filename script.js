const PIN = "7890";


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

    window.scrollTo(0, 0);

  } else {

    error.textContent = "Incorrect PIN";

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

  document.getElementById("error")
    .textContent = "";

}
