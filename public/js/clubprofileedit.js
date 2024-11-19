//wyswietlic dane klubu
//i podłożyc je jako default w formularzu
//nastepnie zrobi cprzycisk wyslij
//wysłac do bazy
//potrzebujemy patch/me nie trzeba id
//root w cbul/me/edit
const messageError = document.querySelector("#message-error");
const messageTwo = document.querySelector("#message-2");
const token = localStorage.getItem("authToken");
const form = document.querySelector("#club-edit-profile-form");

const emailInput = document.querySelector("#email-input");
const nameInput = document.querySelector("#text-name-input");
const cityInput = document.querySelector("#text-city-input");
const regionInput = document.querySelector("#text-region-input");
const phoneInput = document.querySelector("#number-phone-input");

const fetchingClubsData = async () => {
  const response = await fetch("/clubs/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json", // Informujemy serwer, że ciało żądania to JSON
      Authorization: `Bearer ${token}`,
    },
    // body: JSON.stringify({
    //   email: email,
    //   name: name,
    //   surname: surname,
    //   age: age,
    //   weight: weight,
    //   fights: fights,
    // }),
  });
  const club = await response.json();
  console.log("response", response.ok);
  console.log("respp data", club);

  document.getElementById("email-input").value = club.email;
  document.getElementById("text-name-input").value = club.name;
  document.getElementById("text-city-input").value = club.city;
  document.getElementById("text-region-input").value = club.region;
  document.getElementById("number-phone-input").value = club.phone;
};
fetchingClubsData();

const updateClub = async () => {
  const email = emailInput.value;
  const name = nameInput.value;
  const city = cityInput.value;
  const region = regionInput.value;
  const phone = phoneInput.value;

  const response = await fetch("/clubs/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json", // Informujemy serwer, że ciało żądania to JSON
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email: email,
      name: name,
      city: city,
      region: region,
      phone: phone,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    messageError.textContent = "";
    messageTwo.textContent = "Club updated successfully!";

    form.reset();
  } else {
    //   // Obsługa błędu logowania
    messageError.textContent = data.error || "Failed to update club.";
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  updateClub();
});
