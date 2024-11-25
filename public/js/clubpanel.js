const token = localStorage.getItem("authToken");
const userList = document.querySelector("#user-list");
const messageError = document.querySelector("#message-error");
const messageOne = document.querySelector("#message-1");
const butLink1 = document.querySelector("#but-link1");
const butLink2 = document.querySelector("#but-link2");
const butLink3 = document.querySelector("#but-link3");
const butLink4 = document.querySelector("#but-link4");
const listTitle = document.querySelector("#list-title");
const createUserButton = document.querySelector("#create-user");

messageError.textContent = "";
messageOne.textContent = "Loading...";

const panelDisplay = async () => {
  try {
    const response = await fetch("/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.error) {
      console.log(data.error);
      messageError.textContent = data.error;
      messageOne.textContent = "";
    } else {
      messageOne.textContent = "";

      // Użycie for...of zamiast forEach
      for (const user of data) {
        const li = document.createElement("li");
        li.classList.add("user-item");

        // Pobranie awatara
        const avatarImg = await getAvatar(user._id);

        // Dodanie informacji o użytkowniku i awataru
        li.innerHTML = `
          <div class="user-info">
            <img id="avataruser" src="${avatarImg}" alt="Avatar of ${user.name}" />
            <span>${user.name} ${user.surname}, Age: ${user.age}, Weight: ${user.weight}, Fights: ${user.fights}</span>
          </div>
        `;
        userList.appendChild(li);
      }

      // Wyświetlanie przycisków po załadowaniu danych
      butLink1.style.display = "block";
      butLink2.style.display = "block";
      butLink3.style.display = "block";
      butLink4.style.display = "block";
      createUserButton.style.display = "block";
      listTitle.style.display = "block";
    }
  } catch (error) {
    console.error("Błąd podczas pobierania użytkowników:", error);
  }
};

// Funkcja pobierająca awatar użytkownika
const getAvatar = async (userId) => {
  try {
    const response = await fetch(`/users/${userId}/avatar`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //console.log("jaka response ", response.ok);

    const blob = await response.blob();
    console.log("blob", blob.size);
    if (blob.size === 0) {
      console.warn(`Awatar dla użytkownika ${userId} nie został znaleziony.`);
      return "/img/anonim.png"; // Ścieżka do awatara domyślnego
    }
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error(
      `Błąd podczas pobierania awatara użytkownika ${userId}:`,
      error
    );
    return "/default-avatar.png";
  }
};

// Wywołanie funkcji głównej
panelDisplay();

// Obsługa przycisku tworzenia użytkownika
createUserButton.addEventListener("click", () => {
  window.location.href = "/usersignupbyclub";
});

// //console.log("witamy po stronie klienta clubpanel");
// const token = localStorage.getItem("authToken");

// //console.log("Token in header:", token);
// const userList = document.querySelector("#user-list");
// const messageError = document.querySelector("#message-error");
// const messageOne = document.querySelector("#message-1");
// //const logoutLink = document.querySelector("#logout-link");
// const butLink1 = document.querySelector("#but-link1");
// const butLink2 = document.querySelector("#but-link2");

// const listTitle = document.querySelector("#list-title");
// const createUserButton = document.querySelector("#create-user");
// const deleteMe = document.querySelector("#delete-link");

// const deleteButton = document.querySelector("#delete-button");
// const deleteForm = document.querySelector("#delete-form");
// const deleteInput = document.querySelector("#delete-input");
// const deleteLink = document.querySelector("#delete-link");
// //const deleteContainer = document.querySelector("#delete-container");
// //////////////////////////////////////////
// //wyswietlanie memebrs w klubie
// messageError.textContent = "";
// messageOne.textContent = "Loading...";

// const loadContent = async () => {
//   try {
//     //console.log("czy jest token", token);
//     const response = fetch("/users", {
//       method: "GET", // lub POST w zależności od operacji
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.error) {
//           console.log(data.error);
//           messageError.textContent = data.error;
//           messageOne.textContent = "";
//           //   messageThree.textContent = "";
//         } else {
//           //console.log("data jakie", data);
//           messageOne.textContent = "";
//           data.forEach((user) => {
//             const li = document.createElement("li"); // Tworzenie nowego elementu <li>
//             // console.log("lista userow", user);
//             li.textContent = `${user.name} ${user.surname} ${user.age} ${user.weight} ${user.fights}`;
//             userList.appendChild(li); // Dodanie elementu <li> do listy
// //stworzyc elememt src
// //dopiac go do userList
// //jako src ustawic wczytany avatarImg  z funkcji displayAvatar

//             // const userAvat = displayAvatar(user._id);
//             // console.log("obrazek", userAvat);
//             // console.log("userid", user._id);
//           });
//           // logoutLink.style.display = "block";
//           butLink1.style.display = "block";
//           butLink2.style.display = "block";
//           createUserButton.style.display = "block";
//           listTitle.style.display = "block";
//           //deleteContainer.style.display = "block";
//           //deleteMe.style.display = "block";
//           //loginRequired.style.display = "block";
//         }
//       });
//   } catch (error) {
//     console.log(error);
//   }
// };
// loadContent();
// createUserButton.addEventListener("click", () => {
//   window.location.href = "/usersignupbyclub"; // Opens the specified link
// });

// const displayAvatar = async (userid) => {
//   // const response = fetch(`/users/${userid}/avatar`, (res, req) => {});
//   try {
//     const response = await fetch(`/users/${userid}/avatar`, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Nie udało się pobrać awatara");
//     }
//     console.log("czy true", response.ok);

//     // Pobranie danych obrazu jako blob
//     const blob = await response.blob();
//     console.log('blob',blob)

//     // Tworzenie obiektu URL dla obrazu
//     const imageURL = URL.createObjectURL(blob);

//     // Wyświetlenie obrazu na stronie
//     const avatarImg = document.getElementById("avatar"); // Zakładamy, że masz <img id="avatar">
//     avatarImg.src = imageURL;

//     console.log("Awatar został wyświetlony");
//   } catch (error) {
//     console.error("Błąd podczas pobierania awatara:", error);
//   }
// };
