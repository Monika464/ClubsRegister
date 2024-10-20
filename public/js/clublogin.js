console.log("witamy po stronie klienta clublogin");
const loginForm = document.querySelector("form");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const messageOne = document.querySelector("#message-1");
const messageTwo = document.querySelector("#message-2");

messageOne.textContent = "";
messageTwo.textContent = "";

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  messageOne.textContent = "Loading...";

  const email = emailInput.value;
  const password = passwordInput.value;

  console.log("Email:", email);
  console.log("Password:", password);

  fetch("/clubs/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Informujemy serwer, że ciało żądania to JSON
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("tu", data.token);
      localStorage.setItem("authToken", data.token);
      messageOne.textContent = "";
      messageTwo.textContent = "User logged in";
    })
    .catch((error) => {
      console.error("Error:", error);
      messageOne.textContent = "";
    });
});
//tu jest fetch adresu htto
//i wyglad strony

// fetch("/clubs/login", {
//   method: "POST", // lub POST w zależności od operacji
//   // headers: {
//   //   "Content-Type": "application/json",
//   //   Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
//   // },
// })
//   .then((response) => response.json())
//   .then((data) => {
//     if (data.error) {
//       console.log(data.error);
//       messageOne.textContent = data.error;
//     } else {
//       console.log("data".data);

//       //console.log("moon", data.forecast);
//       console.log("hej z clublogin");
//       // messageOne.textContent = "";
//     }
//   });
