//console.log("witamy po stronie klienta clubpanel");
const token = localStorage.getItem("authToken");

//console.log("Token in header:", token);
const userList = document.querySelector("#user-list");
const messageError = document.querySelector("#message-error");
const messageOne = document.querySelector("#message-1");
//const logoutLink = document.querySelector("#logout-link");
const butLink1 = document.querySelector("#but-link1");
const butLink2 = document.querySelector("#but-link2");

const listTitle = document.querySelector("#list-title");
const createUserButton = document.querySelector("#create-user");
const deleteMe = document.querySelector("#delete-link");

//////////////////////////////////////////
//wyswietlanie memebrs w klubie
messageError.textContent = "";
messageOne.textContent = "Loading...";

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
      messageOne.textContent = "";
      //   messageThree.textContent = "";
    } else {
      //console.log("data jakie", data);
      messageOne.textContent = "";
      data.forEach((user) => {
        const li = document.createElement("li"); // Tworzenie nowego elementu <li>
        // console.log("lista userow", user);
        li.textContent = `${user.name} ${user.surname} ${user.age} ${user.weight} ${user.fights}`;
        userList.appendChild(li); // Dodanie elementu <li> do listy
      });
      // logoutLink.style.display = "block";
      butLink1.style.display = "block";
      butLink2.style.display = "block";
      createUserButton.style.display = "block";
      listTitle.style.display = "block";
      deleteMe.style.display = "block";
      //loginRequired.style.display = "block";
    }
  });
createUserButton.addEventListener("click", () => {
  window.location.href = "/usersignupbyclub"; // Opens the specified link
});
