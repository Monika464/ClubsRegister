console.log("witamy po stronie klienta clublogin");
const signupForm = document.querySelector("form");
const passwordInput = document.querySelector("#password-input");
const emailInput = document.querySelector("#email-input");
const nameInput = document.querySelector("#text-name-input");
const citylInput = document.querySelector("#text-city-input");
const regionInput = document.querySelector("#text-region-input");
const phoneInput = document.querySelector("#number-phone-input");

const messageOne = document.querySelector("#message-1");
const messageTwo = document.querySelector("#message-2");
const messageThree = document.querySelector("#message-3");

messageOne.textContent = "";
messageTwo.textContent = "";
messageThree.textContent = "";

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageOne.textContent = "Loading...";

  const email = emailInput.value;
  const password = passwordInput.value;
  const name = nameInput.value;
  const city = citylInput.value;
  const region = regionInput.value;
  const phone = phoneInput.value;

  console.log("Email:", email);
  console.log("name:", name);
  console.log("phone:", phone);

  try {
    const response = await fetch("/clubs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Informujemy serwer, że ciało żądania to JSON
      },
      body: JSON.stringify({
        email: email,
        password: password,
        name: name,
        city: city,
        region: region,
        phone: phone,
      }),
    });
    const data = await response.json();
    // console.log("co mamy w data", data);

    if (response.ok) {
      localStorage.setItem("authToken", data.token);
      messageOne.textContent = "";
      messageTwo.textContent = "User logged in";
    } else {
      //   // Obsługa błędu logowania
      messageThree.textContent = data.error;
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
