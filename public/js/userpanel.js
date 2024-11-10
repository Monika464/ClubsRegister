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
//wyswietlanie users w klubie
//sprobij na const responce = a potem jak w ktoryms
//messageError.textContent = "";

fetch("/users/me", {
  method: "GET", // lub POST w zależności od operacji
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
  },
})
  .then((response) => {
    //console.log("response", response);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    if (data.error) {
      // console.log("tu", data.error);
      messageError.textContent = data.error;
    } else {
      // console.log("data", data.name);
      profileUserAuth.style.display = "block";
      warningAuth.style.display = "none";
      // logoutLink.style.display = "block";
      // userInfo.style.display = "block";
      userInfo.textContent = `
      name ${data.name}, 
      surname ${data.surname},
      age ${data.age},
      weight ${data.weight},
      fights ${data.fights}
      `;
    }
  });

// fetch("/users", {
//   method: "GET", // lub POST w zależności od operacji
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
//   },
// })
//   .then((response) => response.json())
//   .then((data) => {
//     if (data.error) {
//       console.log(data.error);
//       messageError.textContent = data.error;
//       //   messageTwo.textContent = "";
//       //   messageThree.textContent = "";
//     } else {
//       console.log("data", data);
//       data.forEach((user) => {
//         const li = document.createElement("li"); // Tworzenie nowego elementu <li>
//         console.log("lista userow", user);
//         li.textContent = `
//         ${user.name}
//         ${user.surname}
//         ${user.age}
//         ${user.weight}
//         ${user.fights}

//         `; // Ustawienie tekstu z imieniem i nazwiskiem
//         userList.appendChild(li); // Dodanie elementu <li> do listy
//       });
//createUserButton.style.display = "block";
//listTitle.style.display = "block";
//deleteMe.style.display = "block";
//messageThree.textContent = `Location: ${data.address}`;
//alert(`Location: ${data.address}`);
//   messageError.textContent = "";
//   messageTwo.textContent = `Weather: ${data.forecast}, Temperature: ${data.temperature}°C`;
//   messageThree.textContent = `Location: ${data.location};`;

//console.log("moon", data.forecast);
//console.log("hej z clubpanel", data);
// messageError.textContent = "";
//}
//});
// createUserButton.addEventListener("click", () => {
//   window.location.href = "/usersignupbyclub"; // Opens the specified link
// });
