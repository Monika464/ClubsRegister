console.log("witamy w panelu usera");
//console.log("witamy po stronie klienta clubpanel");
const token = localStorage.getItem("authUserToken");
//const userList = document.querySelector("#user-list"); // Złapanie kontenera listy
const messageError = document.querySelector("#message-error");
//const logoutLink = document.querySelector("#logout-link");
//const listTitle = document.querySelector("#list-title");
//const createUserButton = document.querySelector("#create-user");
// const deleteMe = document.querySelector("#delete-link");
const userInfo = document.querySelector("#user-info");
const profileUserAuth = document.querySelector("#profile-user-auth");
const warningAuth = document.querySelector("#warning-auth");
const deleteButton = document.querySelector("#delete-button");
const deleteForm = document.querySelector("#delete-form");
const deleteInput = document.querySelector("#delete-input");
const deleteLink = document.querySelector("#delete-link");
const deleteContainer = document.querySelector("#delete-container");
const avatar = document.querySelector("#user-avatar");

if (token) {
  profileUserAuth.style.display = "block";
  warningAuth.style.display = "none";
}

//messageError.textContent = "";
const showProfile = async () => {
  try {
    const response = await fetch("/userss/me", {
      method: "GET", // lub POST w zależności od operacji
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
      },
    });

    const data = await response.json();
    //console.log("arena", data);

    //console.log("data", data);

    // logoutLink.style.display = "block";
    // userInfo.style.display = "block";
    userInfo.textContent = `
     name ${data.name}, 
     surname ${data.surname},
     age ${data.age},
     weight ${data.weight},
     fights ${data.fights},
     `;

    // console.log("data2", data.avatar);

    // Check if avatar exists
    // if (data.avatar) {
    //   console.log("tu data avatar", data.avatar);
    //   const avatarBuffer = data.avatar;
    //   const avatarSrc = `data:image/png;base64,${btoa(
    //     String.fromCharCode(...new Uint8Array(avatarBuffer))
    //   )}`;

    //   // const avatarSrc = `data:image/png;base64,${btoa(
    //   //   String.fromCharCode(...new Uint8Array(data.avatar))
    //   // )}`;
    //   console.log("avatarbuffer", avatarBuffer);
    //   console.log("avatarSrc", avatarSrc);
    //   // Set the avatar image source
    //   const avatarImg = document.createElement("img");
    //   avatarImg.src = avatarSrc;
    //   avatarImg.alt = "User Avatar";
    //   avatarImg.style.width = "100px"; // Set avatar size (optional)
    //   avatarImg.style.height = "100px";
    //   avatar.appendChild(avatarImg); // Add to the DOM
    // } else {
    //   avatar.textContent = "No avatar uploaded.";
    // }
    deleteContainer.style.display = "block";
  } catch (error) {
    console.log(error);
    messageError.textContent = error;
  }
};

showProfile();

//createUserButton.style.display = "block";

// Obsługa kliknięcia przycisku "Delete"
deleteButton.addEventListener("click", () => {
  deleteForm.style.display = "block"; // Pokazanie formularza
  deleteButton.style.display = "none"; // Ukrycie przycisku
});

// Obsługa przesłania formularza
deleteForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Zatrzymanie domyślnego działania formularza
  const userInput = deleteInput.value.trim().toLowerCase();

  if (userInput === "delete") {
    deleteLink.style.display = "block"; // Pokazanie linku
    deleteForm.style.display = "none"; // Ukrycie formularza
  } else {
    alert("You must type 'delete' to confirm.");
  }
});

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

//displayAvatar();

displayAvatar();
