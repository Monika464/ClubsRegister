const token = localStorage.getItem("authToken");
const arenaList = document.querySelector("#arena-list");
const userList = document.querySelector("#user-list");
const messageError = document.querySelector("#message-error");

const listTitle = document.querySelector("#list-title");

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
      applyButton.textContent = "Check participants";

      // Dodanie funkcji kliknięcia, która loguje arena._id
      applyButton.addEventListener("click", () => {
        console.log("Arena ID:", arena._id);
        readUsers(arena);
        //tu sie mja wyswietlic users
        //z mozliwoscia zaznaczenia wielu checkboxem
        //a pond nimi przycisk zgłos
        //i przycisk usun gdzie
      });

      // Dodanie przycisku do elementu <li>
      li.appendChild(applyButton);
      arenaList.appendChild(li); // Dodanie elementu <li> do listy

      //     // Tablica do przechowywania ID zaznaczonych użytkowników
      //     const selectedUserIds = [];

      //     data.forEach((user) => {
      //       const li = document.createElement("li"); // Tworzenie nowego elementu <li>
      //
      //       li.innerHTML = `
      //         <input type="checkbox" value="${user._id}" class="user-checkbox">
      //         ${user.name} ${user.surname} - Age: ${user.age}, Weight: ${user.weight}, Fights: ${user.fights}
      //       `;

      //       //   li.textContent = `
      //       //           ${user.name}
      //       //           ${user.surname}
      //       //           ${user.age}
      //       //           ${user.weight}
      //       //           ${user.fights}

      //       //           `;
      //       userList.appendChild(li); // Dodanie elementu <li> do listy
      //     });

      //     // Dodanie event listenera do checkboxów
      //     userList.addEventListener("change", (event) => {
      //       const checkbox = event.target;
      //       if (checkbox.classList.contains("user-checkbox")) {
      //         if (checkbox.checked) {
      //           selectedUserIds.push(checkbox.value);
      //         } else {
      //           // Usuń ID z tablicy, jeśli checkbox jest odznaczony
      //           const index = selectedUserIds.indexOf(checkbox.value);
      //           if (index > -1) {
      //             selectedUserIds.splice(index, 1);
      //           }
      //         }
      //       }
      //     });

      //     // Obsługa przycisku, który loguje tablicę ID zaznaczonych użytkowników
      //     const participateButton = document.getElementById("participate-users");
      //     participateButton.addEventListener("click", () => {
      //       console.log("Zaznaczone ID użytkowników:", selectedUserIds);
      //     });
      //   } catch (error) {
      //     console.error("Error:", error);
      //   }
      // };
    });
  } catch (error) {
    console.error("Error:", error);
    messageOne.textContent = "";
  }
};
readArenas();

const findDuplicates = (users) => {
  const duplicates = [];
  const userMap = new Map();

  users.forEach((user) => {
    const key = `${user.name}${user.surname}${user.age}${user.weight}${user.fights}`;
    if (userMap.has(key)) {
      duplicates.push(user._id);
      duplicates.push(userMap.get(key));
    } else {
      userMap.set(key, user._id);
    }
  });

  return duplicates;
};

//const readUsers = async (arenaid) => {
const readUsers = async (arena) => {
  try {
    const response = await fetch("/arenas/participants", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        //arenaid: arenaid,
        arenaid: arena._id,
      },
    });

    const data = await response.json();
    console.log("datauserspartic", data);

    // tu masz userow wlozyc a nie wyzej
    // Oczyszczanie listy użytkowników przed ponownym renderowaniem
    userList.innerHTML = "";

    //

    // Wyświetlenie danych areny na początku listy użytkowników
    const arenaDetails = document.createElement("div");
    arenaDetails.innerHTML = `
     <h2>${arena.title}</h2>
     <p>Start Time: ${arena.arenaTimeStart}</p>
     <p>Description: ${arena.description}</p>
   `;
    userList.appendChild(arenaDetails);

    ///

    // Tablica do przechowywania ID zaznaczonych użytkowników
    const selectedUserIds = [];
    const duplicateIds = findDuplicates(data);

    data.forEach((user) => {
      const li = document.createElement("li"); // Tworzenie nowego elementu <li>
      // console.log("lista userow", user);
      li.innerHTML = `
            <input type="checkbox" value="${user._id}" class="user-checkbox">
            ${user.name} ${user.surname} - Age: ${user.age}, Weight: ${user.weight}, Fights: ${user.fights}
          `;
      // Jeśli użytkownik jest duplikatem, podświetl go na czerwono
      if (duplicateIds.includes(user._id)) {
        li.style.backgroundColor = "red";
      }
      //   li.textContent = `
      //           ${user.name}
      //           ${user.surname}
      //           ${user.age}
      //           ${user.weight}
      //           ${user.fights}

      //           `;
      userList.appendChild(li); // Dodanie elementu <li> do listy
    });

    //reszta

    /////////////////
  } catch (error) {
    console.error("Error:", error);
  }
};
