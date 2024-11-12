// document.addEventListener("DOMContentLoaded", () => {
//   document.querySelectorAll(".apply-button").forEach((button) => {
//     button.addEventListener("click", () => {
//       const arenaId = button.getAttribute("data-id");
//       console.log("Arena ID:", arenaId);
//     });
//   });
// });

console.log("display all arenas");
const token = localStorage.getItem("authManagerToken");
const arenaAllList = document.querySelector("#arena-all-list");
const messageError = document.querySelector("#message-error");

const readArenas = async () => {
  try {
    console.log("start");
    const response = await fetch("/arenas/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log("co mamy w data all", data);
    data.forEach((arena) => {
      console.log("pokaz arena", arena.description);
    });

    data.forEach((arena) => {
      const li = document.createElement("li"); // Tworzenie nowego elementu <li>
      // console.log("lista userow", user);
      li.textContent = `
      ${arena.title}
      ${arena.arenaTimeStart}
      ${arena.description}
      `; // Ustawienie tekstu z imieniem i nazwiskiem

      // Tworzenie przycisku "Apply"
      const applyButton = document.createElement("button");
      applyButton.textContent = "Apply";

      // Dodanie funkcji kliknięcia, która loguje arena._id
      applyButton.addEventListener("click", () => {
        console.log("Arena ID:", arena._id);
      });

      // Dodanie przycisku do elementu <li>
      li.appendChild(applyButton);

      arenaAllList.appendChild(li); // Dodanie elementu <li> do listy
    });
    // if (response.ok) {
    //   localStorage.setItem("authToken", data.token);
    //   messageOne.textContent = "";
    //   messageTwo.textContent = "User logged in";
    // } else {
    //   //   // Obsługa błędu logowania
    //   messageThree.textContent = data.error;
    // }
  } catch (error) {
    console.error("Error:", error);
    messageOne.textContent = "";
  }
};
readArenas();

// // createUserButton.addEventListener("click", () => {
// //   window.location.href = "/usersignupbyclub"; // Opens the specified link
// // });
