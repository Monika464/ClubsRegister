console.log("display arenas");
const token = localStorage.getItem("authManagerToken");
const arenaList = document.querySelector("#arena-list");
const messageError = document.querySelector("#message-error");

const readArenas = async () => {
  try {
    console.log("start");
    const response = await fetch("/arenas", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
      },
    });

    const data = await response.json();
    //console.log("co mamy w data", data);
    // data.forEach((arena) => {
    //   console.log("pokaz arena", arena.description);
    // });

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

      arenaList.appendChild(li); // Dodanie elementu <li> do listy
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

// createUserButton.addEventListener("click", () => {
//   window.location.href = "/usersignupbyclub"; // Opens the specified link
// });
