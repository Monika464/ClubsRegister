const token = localStorage.getItem("authManagerToken");
const arenaList = document.querySelector("#arena-list");
const userList = document.querySelector("#user-list");
const messageError = document.querySelector("#message-error");
const withdraw = document.querySelector("#withdraw-users");
const logoutLink = document.querySelector("#logout-link");
const messageOne = document.querySelector("#message-1");
let editMode = false;
const selectedUserIds = [];

const listTitle = document.querySelector("#list-title");

const readArenas = async () => {
  messageError.textContent = "";

  try {
    // console.log("czy jest token", token);
    const response = await fetch("/arenas/manager", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
      },
    });
    const data = await response.json();
    console.log("data", data);

    //zrob wysweiltanie przypadku jak data jest errorem bo np. brak autentifikacji

    data.forEach((arena) => {
      const li = document.createElement("li"); // Tworzenie nowego elementu <li>
      //console.log("arena", arena);
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
      });

      // Dodanie przycisku do elementu <li>
      li.appendChild(applyButton);
      arenaList.appendChild(li); // Dodanie elementu <li> do listy
    });

    logoutLink.style.display = "block";
  } catch (error) {
    console.error("Error:", error);
    messageOne.textContent = "Error loading arenas";
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
    const response = await fetch("/arenas/participants/manager", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        //arenaid: arenaid,
        arenaid: arena._id,
      },
    });

    const data = await response.json();
    //console.log("datauserspartic", data);

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

    //edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      editMode = !editMode;
      toggleCheckboxes(editMode);
      editButton.textContent = editMode ? "Finish Editing" : "Edit";
      withdraw.style.display = editMode ? "block" : "none";
    });
    userList.appendChild(editButton);

    //duplikaty
    const duplicateIds = findDuplicates(data);

    ///
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
      ///
      // Dodanie event listenera do checkboxa
      const checkbox = li.querySelector(".user-checkbox");
      checkbox.addEventListener("change", (event) => {
        if (event.target.checked) {
          selectedUserIds.push(user._id); // Dodanie ID użytkownika do tablicy
        } else {
          const index = selectedUserIds.indexOf(user._id);
          if (index > -1) {
            selectedUserIds.splice(index, 1); // Usunięcie ID użytkownika z tablicy
          }
        }
        //console.log("Selected user IDs:", selectedUserIds);
      });

      ///
      userList.appendChild(li); // Dodanie elementu <li> do listy
    });

    //reszta
    // Example of calling the deleteParticipants function after selecting users
    //console.log("arena", arena);
    //const withdrawButton = document.createElement("button");
    //applyButton.textContent = "Withdraw participants";
    withdraw.style.display = editMode ? "block" : "none";

    withdraw.addEventListener("click", () => {
      if (selectedUserIds.length > 0) {
        //console.log("Selected user IDs:", selectedUserIds);
        //console.log("arena :", arena);
        deleteParticipants(arena._id, selectedUserIds);
      } else {
        messageError.textContent = "No users selected for deletion.";
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

const toggleCheckboxes = (show) => {
  const checkboxes = document.querySelectorAll(".user-checkbox");
  checkboxes.forEach((checkbox) => {
    checkbox.style.display = show ? "inline-block" : "none";
  });
};

const deleteParticipants = async (arenaId, selectedUserIds) => {
  messageError.textContent = "";

  try {
    const response = await fetch("/arenas/participants/delete/manager", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        arenaId: arenaId,
        selectedUsers: selectedUserIds,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Participants successfully removed:", result);
      messageError.textContent = "Participants removed successfully!";
      // Optionally refresh the list of participants after deletion
      readUsers({ _id: arenaId });
    } else {
      console.error("Failed to remove participants:", result);
      messageError.textContent =
        result.message || "Failed to remove participants.";
    }
  } catch (error) {
    console.error("Error:", error);
    messageError.textContent =
      "An error occurred while trying to remove participants.";
  }
};
