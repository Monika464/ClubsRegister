console.log("witamy w panelu usera");
/
const token = localStorage.getItem("authUserToken");

const messageError = document.querySelector("#message-error");
const messageOne = document.querySelector("#message-1");

const userInfo = document.querySelector("#user-info");
const profileUserAuth = document.querySelector("#profile-user-auth");
const warningAuth = document.querySelector("#warning-auth");
const deleteButton = document.querySelector("#delete-button");
const deleteForm = document.querySelector("#delete-form");
const deleteInput = document.querySelector("#delete-input");
const deleteLink = document.querySelector("#delete-link");
const sidebar = document.querySelector("#sidebar");
const avatar = document.querySelector("#user-avatar");
const butLink1 = document.querySelector("#but-link1");
const arenaList = document.querySelector("#arena-list");

if (token) {
  profileUserAuth.style.display = "block";
  warningAuth.style.display = "none";
  butLink1.style.display = "block";
} else {
  profileUserAuth.style.display = "none";
  warningAuth.style.display = "block";
  butLink1.style.display = "none";
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
    sidebar.style.display = "block";
    const data = await response.json();
    

    userInfo.textContent = `
    Your data:
     name ${data.name}, 
     surname ${data.surname},
     age ${data.age},
     weight ${data.weight},
     fights ${data.fights},
     `;
  } catch (error) {
    console.log(error);
    messageError.textContent = error;
  }
};

showProfile();

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
    avatarImg.style.display = "block";
    avatarImg.src = imageURL;

    console.log("Awatar został wyświetlony");
  } catch (error) {
    console.error("Błąd podczas pobierania awatara:", error);
  }
};

//displayAvatar();

displayAvatar();

const readArenas = async () => {
  try {
    const userResponse = await fetch("/userss/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = await userResponse.json(); // Dane zalogowanego użytkownika
    const userId = userData._id; // ID zalogowanego użytkownika

    const arenaResponse = await fetch("/arenass/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const arenaData = await arenaResponse.json(); // Dane aren
    if (arenaData.error) {
      console.error(arenaData.error);
      messageError.textContent = arenaData.error;
      messageOne.textContent = "";
      return;
    }

    messageOne.textContent = ""; // Czyszczenie komunikatu
    console.log("Czy mamy areny:", arenaData);

    for (const arena of arenaData) {
      const li = document.createElement("li");
      li.classList.add("arena-item");

      // Sprawdź, czy użytkownik jest wśród uczestników
      const isParticipant = arena.participants.includes(userId);

      // Ustaw kolor czcionki na podstawie przynależności
      li.style.color = isParticipant ? "green" : "red";

      li.innerHTML = `
        <div class="arena-info">
          <span>
            ${arena.title} ${arena.description}, 
            competition start: ${formatDate(arena.arenaTimeStart)}, 
            competition end: ${formatDate(arena.arenaTimeClose)}, 
            application close: ${formatDate(arena.arenaTimeRegisClose)}
          </span>
        </div>
      `;

      arenaList.appendChild(li);
    }
  } catch (error) {
    console.error("Błąd podczas pobierania aren:", error);
  }
};

readArenas();

// Funkcja formatująca datę
const formatDate = (timestamp) => {
  const date = new Date(timestamp); // Konwersja timestamp na obiekt Date
  return date.toLocaleString("en-US", {
    // Dostosuj język i format
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Ustawienie 24-godzinnego formatu
  });
};
