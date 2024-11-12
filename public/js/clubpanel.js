//console.log("witamy po stronie klienta clubpanel");
const token = localStorage.getItem("authToken");
const userList = document.querySelector("#user-list");
const messageError = document.querySelector("#message-error");
const logoutLink = document.querySelector("#logout-link");
const listTitle = document.querySelector("#list-title");
const createUserButton = document.querySelector("#create-user");
const deleteMe = document.querySelector("#delete-link");
//const loginRequired = document.querySelector(".login-required");
///////////////////////
//edytowanie members, wyswietlanie
// if (token) {
//   loginRequired.style.display = "block";
// } else {
//   console.warn("User not logged in, hiding login-required section.");
//   loginRequired.style.display = "none";
// }
//wyswietlanie eventow

//////////////////////////////////////////
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
      // console.log("data jakie", data);
      data.forEach((user) => {
        const li = document.createElement("li"); // Tworzenie nowego elementu <li>
        // console.log("lista userow", user);
        li.textContent = `
        ${user.name} 
        ${user.surname}
        ${user.age}
        ${user.weight}
        ${user.fights}

        `; // Ustawienie tekstu z imieniem i nazwiskiem
        userList.appendChild(li); // Dodanie elementu <li> do listy
      });
      logoutLink.style.display = "block";
      createUserButton.style.display = "block";
      listTitle.style.display = "block";
      deleteMe.style.display = "block";
      //loginRequired.style.display = "block";
    }
  });
createUserButton.addEventListener("click", () => {
  window.location.href = "/usersignupbyclub"; // Opens the specified link
});
