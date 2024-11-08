const messageOne = document.querySelector("#message-1");

const token = localStorage.getItem("authUserToken");
messageOne.textContent = "Loading...";

fetch("/users/logout", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
  },
})
  .then((response) => {
    if (response.ok) {
      // Usuwamy token po pomyślnym wylogowaniu
      localStorage.removeItem("authUserToken");
      messageOne.textContent = "User logged out";
      console.log("User logged out");
      // Przekierowanie do strony logowania
      // window.location.href = "/clublogin";
    } else {
      throw new Error("Wylogowanie nie powiodło się");
    }
  })
  .catch((error) => {
    console.error("Error:", error);
    messageOne.textContent = "An error occurred. Please try again.";
  });

//od tad
// const messageOne = document.querySelector("#message-1");

// const token = localStorage.getItem("authToken");
// messageOne.textContent = "Loading...";
// fetch("/clubs/logout", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
//   },
// })
//   .then((response) => {
//     if (response.ok) {
//       // Jeśli odpowiedź jest poprawna, ale nie ma ciała, nie parsuj jako JSON
//       if (
//         response.status === 204 ||
//         response.headers.get("Content-Length") === "0"
//       ) {
//         return null; // Nie ma treści do parsowania
//       }
//       return response.json(); // Parsuj tylko, jeśli odpowiedź ma ciało
//     } else {
//       throw new Error("Response not OK");
//     }
//   })
//   .then((data) => {
//     localStorage.removeItem("authToken");
//     console.log("User logged out");
//     messageOne.textContent = "User logged out";
//   })
//   .catch((error) => console.error("Error:", error));

//do tad

// const token = localStorage.getItem("authToken");

// fetch("/clubs/logout", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
//   },
// })
//   .then((response) => response.json())
//   .then((data) => {
//     localStorage.removeItem("authToken");
//   })
//   .then(() => {
//     console.log("user logged out");
//   })
//   .catch((error) => console.error("Error:", error));
