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

      for (const user of data) {
        const li = document.createElement("li");
        li.classList.add("user-item");

        const avatarImg = await getAvatar(user._id);

        li.innerHTML = `
          <div class="user-info">
            <img id="avataruser" src="${avatarImg}" alt="Avatar of ${user.name}" />
            <span>${user.name} ${user.surname}, Age: ${user.age}, Weight: ${user.weight}, Fights: ${user.fights}</span>
          </div>
        `;
        userList.appendChild(li);
      }

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

const getAvatar = async (userId) => {
  try {
    const response = await fetch(`/users/${userId}/avatar`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const blob = await response.blob();
    //console.log("blob", blob.size);
    if (blob.size === 0) {
      console.warn(`Awatar dla użytkownika ${userId} nie został znaleziony.`);
      return "/img/anonim.png";
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

panelDisplay();

createUserButton.addEventListener("click", () => {
  window.location.href = "/usersignupbyclub";
});
