const messageOne = document.querySelector("#message-1");

const token = localStorage.getItem("authToken");
messageOne.textContent = "Loading...";
fetch("/clubs/logout", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
  },
})
  .then((response) => {
    if (response.ok) {
      // Jeśli odpowiedź jest poprawna, ale nie ma ciała, nie parsuj jako JSON
      if (
        response.status === 204 ||
        response.headers.get("Content-Length") === "0"
      ) {
        return null; // Nie ma treści do parsowania
      }
      return response.json(); // Parsuj tylko, jeśli odpowiedź ma ciało
    } else {
      throw new Error("Response not OK");
    }
  })
  .then((data) => {
    localStorage.removeItem("authToken");
    console.log("User logged out");
    messageOne.textContent = "User logged out";
  })
  .catch((error) => console.error("Error:", error));

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
