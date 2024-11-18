//console.log("witamy po stronie klienta clubpanel");
const token = localStorage.getItem("authToken");
const userList = document.querySelector("#user-list");
const messageError = document.querySelector("#message-error");
const logoutLink = document.querySelector("#logout-link");
const listTitle = document.querySelector("#list-title");
const createUserButton = document.querySelector("#create-user");
const deleteMe = document.querySelector("#delete-link");

const form = document.querySelector("#club-edit-form");

const emailInput = document.querySelector("#email-input");
const nameInput = document.querySelector("#text-name-input");
const surnameInput = document.querySelector("#text-surname-input");
const ageInput = document.querySelector("#number-age-input");
const weightInput = document.querySelector("#number-weight-input");
const fightamountInput = document.querySelector("#number-fightamount-input");

let isEditMode = true;

try {
  //FUNCJA WYPELNIAJACA danymi z usera bazy form

  gettingDataFromBase = async (id) => {
    const response = await fetch(`/users/${id}`, {
      method: "GET", // lub POST w zależności od operacji
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
      },
    });
    const user = await response.json();
    console.log("czy tu jest data", user);
    localStorage.setItem("userIdedit", id);

    document.getElementById("email-input").value = user.email;
    document.getElementById("text-name-input").value = user.name;
    document.getElementById("text-surname-input").value = user.surname;
    document.getElementById("number-age-input").value = user.age;
    document.getElementById("number-weight-input").value = user.weight;
    document.getElementById("number-fightamount-input").value = user.fights;
  };
} catch (error) {
  console.log(error);
}

//wysylanie aktualizacji do bazy

const updatingUser = async (id) => {
  const email = emailInput.value;

  const name = nameInput.value;
  const surname = surnameInput.value;
  const age = ageInput.value;
  const weight = weightInput.value;
  const fights = fightamountInput.value;

  try {
    const response = await fetch(`/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json", // Informujemy serwer, że ciało żądania to JSON
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: email,
        name: name,
        surname: surname,
        age: age,
        weight: weight,
        fights: fights,
      }),
    });
    const data = await response.json();
    console.log("response", data);
    if (response.ok) {
      messageOne.textContent = "";
      messageTwo.textContent = "User updated successfully!";
      form.reset();
      localStorage.removeItem("userIdedit");
    } else {
      //   // Obsługa błędu logowania
      messageThree.textContent = data.error || "Failed to update user.";
    }
  } catch (error) {
    console.error("Błąd przy aktualizacji:", error);
  }
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  //messageOne.textContent = "Loading...";

  try {
    const userId = localStorage.getItem("userIdedit");
    //const userId = document.querySelector('input[name="user-selection"]:checked')?.value;
    console.log("czy jest tu id", userId);
    if (!userId) {
      messageError.textContent = "Wybierz użytkownika do edycji.";
      return;
    }

    updatingUser(userId);
  } catch (error) {
    console.error("Błąd podczas aktualizacji użytkownika:", error);
    messageError.textContent =
      "Wystąpił błąd podczas aktualizacji użytkownika.";
  }
});

//wyswietlanie memebrs w klubie

messageError.textContent = "";

//console.log("czy jest token", token);
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
      //console.log("data jakie", data);
      data.forEach((user) => {
        const li = document.createElement("li"); // Tworzenie nowego elementu <li>

        li.innerHTML = `
        <input type="radio" name="user-selection" value="${user._id}" class="user-checkbox">
        ${user.name} ${user.surname} - Age: ${user.age}, Weight: ${user.weight}, Fights: ${user.fights}
      `;

        const checkbox = li.querySelector(".user-checkbox");
        data.forEach((user) => {
          //console.log("uss", user);
        });
        //trzeba podłaczyć wybranego usera do pol default forma
        checkbox.addEventListener("change", (event) => {
          const existingButtons =
            document.querySelectorAll("#user-list button");
          existingButtons.forEach((btn) => btn.remove());
          if (event.target.checked) {
            console.log("event", event.target.value);

            //tutaj warunek i funkcje(ebent target value)
            gettingDataFromBase(event.target.value);

            const editButton = document.createElement("button");
            editButton.textContent = "Editing";
            editButton.addEventListener("click", () => {
              console.log("usssid", event.target.value);

              editButton.textContent = isEditMode ? "Finish Editing" : "Edit";
              isEditMode = !isEditMode;
            });
            if (isEditMode) {
              form.style.display = "block";
            }
            li.appendChild(editButton);
          } else {
            const existingButton = li.querySelector("button");
            if (existingButton) {
              li.removeChild(existingButton);
            }
            //const index = selectedUserIds.indexOf(user._id);
          }
        });

        userList.appendChild(li); // Dodanie elementu <li> do listy
      });
      logoutLink.style.display = "block";
      //createUserButton.style.display = "block";
      listTitle.style.display = "block";
      //deleteMe.style.display = "block";
      //loginRequired.style.display = "block";
    }
  });

// createUserButton.addEventListener("click", () => {
//   window.location.href = "/usersignupbyclub"; // Opens the specified link
// });
