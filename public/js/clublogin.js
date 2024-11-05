//console.log("witamy po stronie klienta clublogin");
const loginForm = document.querySelector("#club-login-form");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const messageOne = document.querySelector("#message-1");
const messageTwo = document.querySelector("#message-2");
const messageThree = document.querySelector("#message-3");

messageOne.textContent = "";
messageTwo.textContent = "";
messageThree.textContent = "";

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageOne.textContent = "Loading...";

  const email = emailInput.value;
  const password = passwordInput.value;

  // console.log("Email:", email);
  // console.log("Password:", password);

  try {
    const response = await fetch("/clubs/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Informujemy serwer, że ciało żądania to JSON
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const data = await response.json();
    // console.log("co jest w data", data);
    if (response.ok) {
      localStorage.setItem("authToken", data.token);
      messageOne.textContent = "";
      messageTwo.textContent = "Club logged in";
      console.log("club wlasnie sie zalogowal");
      messageOne.textContent = "";
    } else {
      //   // Obsługa błędu logowania
      messageThree.textContent = data.error;
      messageOne.textContent = "";
      console.log("response", response);
    }

    // if (response.ok) {
    //   // Przekierowanie na clubpanel po zalogowaniu
    //   window.location.href = data.redirectTo;
    // } else {
    //   // Obsługa błędu logowania
    //   messageThree.textContent = data.error;
    // }
  } catch (error) {
    console.error("Error:", error);
    messageOne.textContent = "";
  }

  //do przerobki
  // fetch("/clubs/login", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json", // Informujemy serwer, że ciało żądania to JSON
  //   },
  //   body: JSON.stringify({
  //     email: email,
  //     password: password,
  //   }),
  // })
  // .then((response) => response.json())
  // .then((data) => {
  //   //console.log("tu", data.token);
  //   localStorage.setItem("authToken", data.token);
  //   messageOne.textContent = "";
  //   messageTwo.textContent = "User logged in";
  // })
  // .catch((error) => {
  //   console.error("Error:", error);
  //   messageOne.textContent = "";
  // });
});

///dotad ok
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
