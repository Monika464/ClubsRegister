const messageOne = document.querySelector("#message-1");

const token = localStorage.getItem("authManagerToken");
messageOne.textContent = "Loading...";

fetch("/managers/logout", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
  },
})
  .then((response) => {
    if (response.ok) {
      // Usuwamy token po pomyślnym wylogowaniu
      localStorage.removeItem("authManagerToken");
      messageOne.textContent = "Manager logged out";
      console.log("Manager logged out");
      // Przekierowanie do strony logowania
      // window.location.href = "/clublogin";
    } else {
      throw new Error("Logout unsuccessful");
    }
  })
  .catch((error) => {
    console.error("Error:", error);
    messageOne.textContent = "An error occurred. Please try again.";
  });
