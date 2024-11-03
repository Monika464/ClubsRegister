console.log("witamy po stronie klienta clubpanel");
const token = localStorage.getItem("authToken");
const userList = document.querySelector("#user-list"); // Złapanie kontenera listy

//wyswietlanie memebrs w klubie

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
      messageOne.textContent = data.error;
      //   messageTwo.textContent = "";
      //   messageThree.textContent = "";
    } else {
      console.log("data".data);
      data.forEach((user) => {
        const li = document.createElement("li"); // Tworzenie nowego elementu <li>
        li.textContent = `${user.name} ${user.surname}`; // Ustawienie tekstu z imieniem i nazwiskiem
        userList.appendChild(li); // Dodanie elementu <li> do listy
      });

      //messageThree.textContent = `Location: ${data.address}`;
      //alert(`Location: ${data.address}`);
      //   messageOne.textContent = "";
      //   messageTwo.textContent = `Weather: ${data.forecast}, Temperature: ${data.temperature}°C`;
      //   messageThree.textContent = `Location: ${data.location};`;

      //console.log("moon", data.forecast);
      //console.log("hej z clubpanel", data);
      // messageOne.textContent = "";
    }
  });
