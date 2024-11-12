const token = localStorage.getItem("authToken");
const arenaList = document.querySelector("#arena-list");
const userList = document.querySelector("#user-list");
const messageError = document.querySelector("#message-error");

const listTitle = document.querySelector("#list-title");

const readUsers = async () => {
  try {
    const response = await fetch("/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
      },
    });
    const data = await response.json();
    console.log("datausers", data);

    // Oczyszczanie listy użytkowników przed ponownym renderowaniem
    userList.innerHTML = "";

    // Tablica do przechowywania ID zaznaczonych użytkowników
    const selectedUserIds = [];

    data.forEach((user) => {
      const li = document.createElement("li"); // Tworzenie nowego elementu <li>
      // console.log("lista userow", user);
      li.innerHTML = `
        <input type="checkbox" value="${user._id}" class="user-checkbox">
        ${user.name} ${user.surname} - Age: ${user.age}, Weight: ${user.weight}, Fights: ${user.fights}
      `;

      //   li.textContent = `
      //           ${user.name}
      //           ${user.surname}
      //           ${user.age}
      //           ${user.weight}
      //           ${user.fights}

      //           `;
      userList.appendChild(li); // Dodanie elementu <li> do listy
    });

    // Dodanie event listenera do checkboxów
    userList.addEventListener("change", (event) => {
      const checkbox = event.target;
      if (checkbox.classList.contains("user-checkbox")) {
        if (checkbox.checked) {
          selectedUserIds.push(checkbox.value);
        } else {
          // Usuń ID z tablicy, jeśli checkbox jest odznaczony
          const index = selectedUserIds.indexOf(checkbox.value);
          if (index > -1) {
            selectedUserIds.splice(index, 1);
          }
        }
      }
    });

    // Obsługa przycisku, który loguje tablicę ID zaznaczonych użytkowników
    const participateButton = document.getElementById("participate-users");
    participateButton.addEventListener("click", () => {
      console.log("Zaznaczone ID użytkowników:", selectedUserIds);
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

const readArenas = async () => {
  messageError.textContent = "";

  try {
    // console.log("czy jest token", token);
    const response = await fetch("/arenas/apply", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
      },
    });
    const data = await response.json();
    //console.log("data", data);
    data.forEach((arena) => {
      const li = document.createElement("li"); // Tworzenie nowego elementu <li>
      // console.log("arena", arena);
      li.textContent = `
    ${arena.title} 
    ${arena.arenaTimeStart}
    ${arena.description}
    `;

      // Tworzenie przycisku "Apply"
      const applyButton = document.createElement("button");
      applyButton.textContent = "Apply";

      // Dodanie funkcji kliknięcia, która loguje arena._id
      applyButton.addEventListener("click", () => {
        // console.log("Arena ID:", arena._id);
        readUsers();
        //tu sie mja wyswietlic users
        //z mozliwoscia zaznaczenia wielu checkboxem
        //a pond nimi przycisk zgłos
        //i przycisk usun gdzie
      });

      // Dodanie przycisku do elementu <li>
      li.appendChild(applyButton);

      arenaList.appendChild(li); // Dodanie elementu <li> do listy
    });
  } catch (error) {
    console.error("Error:", error);
    messageOne.textContent = "";
  }
};
readArenas();
