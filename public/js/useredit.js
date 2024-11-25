console.log("witamy po stronie klienta usereditpanel");
const token = localStorage.getItem("authUserToken");
const userList = document.querySelector("#user-list");
const messageError = document.querySelector("#message-error");
const messageTwo = document.querySelector("#message-2");
const messageOne = document.querySelector("#message-1");
const logoutLink = document.querySelector("#logout-link");
const listTitle = document.querySelector("#list-title");
const createUserButton = document.querySelector("#create-user");
const deleteMe = document.querySelector("#delete-link");
const fileInput = document.getElementById("single-file"); // Pole wyboru pliku
const avatarImg = document.getElementById("user-avatar"); // Obrazek awatara

const form = document.querySelector("#user-edit-form");

const emailInput = document.querySelector("#email-input");
const nameInput = document.querySelector("#text-name-input");
const surnameInput = document.querySelector("#text-surname-input");
const ageInput = document.querySelector("#number-age-input");
const weightInput = document.querySelector("#number-weight-input");
const fightamountInput = document.querySelector("#number-fightamount-input");

let isEditMode = true;

//console.log("czy w edit user jest token", token);

if (token) {
  form.style.display = "block";
}

try {
  //FUNCJA WYPELNIAJACA danymi z usera bazy form

  gettingDataFromBase = async () => {
    const response = await fetch("/userss/me", {
      method: "GET", // lub POST w zależności od operacji
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
      },
    });
    const user = await response.json();
    // console.log("co tu w user", user);

    //localStorage.setItem("userIdedit", id);

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

const updatingUser = async () => {
  const email = emailInput.value;
  const name = nameInput.value;
  const surname = surnameInput.value;
  const age = ageInput.value;
  const weight = weightInput.value;
  const fights = fightamountInput.value;

  try {
    const response = await fetch(`/userss/me`, {
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
    console.log("response", response.ok);

    if (response.ok) {
      messageError.textContent = "";
      messageTwo.textContent = "User updated successfully!";
      //localStorage.removeItem("userIdedit");
      console.log("item removed from storage");
      form.reset();
    } else {
      //   // Obsługa błędu logowania
      messageError.textContent = data.error || "Failed to update user.";
    }
  } catch (error) {
    console.error("Błąd przy aktualizacji:", error);
  }
};

gettingDataFromBase();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageOne.textContent = "Loading...";

  try {
    //const userId = localStorage.getItem("userIdedit");
    //const userId = document.querySelector('input[name="user-selection"]:checked')?.value;
    // console.log("czy jest tu id", userId);
    // if (!userId) {
    //   messageError.textContent = "Wybierz użytkownika do edycji.";
    //   return;
    // }
    updatingUser();
  } catch (error) {
    console.error("Błąd podczas aktualizacji użytkownika:", error);
    messageError.textContent =
      "Wystąpił błąd podczas aktualizacji użytkownika.";
  }
});

const updateAvatar = async () => {
  console.log("updating");
  try {
    const file = fileInput.files[0]; // Pobierz wybrany plik
    if (!file) {
      console.log("No file selected");
      return;
    }

    // Utwórz obiekt FormData
    const formData = new FormData();
    formData.append("avatar", file);

    // Wyślij żądanie PATCH do serwera
    const response = await fetch(`/users/me/avatar`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`, // Dodaj token do nagłówka
      },
      body: formData, // Prześlij plik w FormData
    });

    // Obsługa odpowiedzi
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update avatar");
    } else {
      console.log("avatar updated");
      messageOne.textContent = "Avatar updated";

      await displayAvatar();
    }
  } catch (error) {
    console.error("Error updating avatar:", error);
    alert(`Error: ${error.message}`);
  }
};

// Obsługa zmiany pliku i wywołanie funkcji
fileInput.addEventListener("change", updateAvatar);
// fileInput.addEventListener("change", () => {
//   console.log("File input changed!");
//   updateAvatar();
// });

const displayAvatar = async () => {
  try {
    const response = await fetch("users/me/avatar", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
      },
    });

    if (!response.ok) {
      throw new Error("Nie udało się pobrać awatara");
    }

    // Pobranie danych obrazu jako blob
    const blob = await response.blob();

    // Tworzenie obiektu URL dla obrazu
    const imageURL = URL.createObjectURL(blob);

    // Wyświetlenie obrazu na stronie
    const avatarImg = document.getElementById("avatar"); // Zakładamy, że masz <img id="avatar">
    avatarImg.src = imageURL;

    console.log("Awatar został wyświetlony");
  } catch (error) {
    console.error("Błąd podczas pobierania awatara:", error);
  }
};
displayAvatar();

messageError.textContent = "";
