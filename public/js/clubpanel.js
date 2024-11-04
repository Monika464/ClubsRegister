console.log("witamy po stronie klienta clubpanel");
const token = localStorage.getItem("authToken");
const userList = document.querySelector("#user-list"); // Złapanie kontenera listy
const messageError = document.querySelector("#message-error");
const logoutLink = document.querySelector("#logout-link");
const listTitle = document.querySelector("#list-title");
const createUserButton = document.querySelector("#create-user");
//wyswietlanie memebrs w klubie
messageError.textContent = "";

fetch("/users", {
  method: "GET", // lub POST w zależności od operacji
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
  },
})
  .then((response) => response.json())
  .then((data) => {
    if (data.error) {
      console.log(data.error);
      messageError.textContent = data.error;
      //   messageTwo.textContent = "";
      //   messageThree.textContent = "";
    } else {
      data.forEach((user) => {
        const li = document.createElement("li"); // Tworzenie nowego elementu <li>
        li.textContent = `${user.name} ${user.surname}`; // Ustawienie tekstu z imieniem i nazwiskiem
        userList.appendChild(li); // Dodanie elementu <li> do listy
      });
      logoutLink.style.display = "block";
      createUserButton.style.display = "block";
      listTitle.style.display = "block";
      //messageThree.textContent = `Location: ${data.address}`;
      //alert(`Location: ${data.address}`);
      //   messageError.textContent = "";
      //   messageTwo.textContent = `Weather: ${data.forecast}, Temperature: ${data.temperature}°C`;
      //   messageThree.textContent = `Location: ${data.location};`;

      //console.log("moon", data.forecast);
      //console.log("hej z clubpanel", data);
      // messageError.textContent = "";
    }
  });
