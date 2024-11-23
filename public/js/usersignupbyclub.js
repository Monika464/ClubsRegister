//console.log("witamy po stronie klienta clublogin");
const signupForm = document.querySelector("form");
const passwordInput = document.querySelector("#password-input");
const emailInput = document.querySelector("#email-input");
const nameInput = document.querySelector("#text-name-input");
const surnamelInput = document.querySelector("#text-surname-input");
const ageInput = document.querySelector("#number-age-input");
const weightInput = document.querySelector("#number-weight-input");
const fightsInput = document.querySelector("#number-fightamount-input");

const token = localStorage.getItem("authToken");

const messageOne = document.querySelector("#message-1");
const messageTwo = document.querySelector("#message-2");
const messageThree = document.querySelector("#message-3");

messageOne.textContent = "";
messageTwo.textContent = "";
messageThree.textContent = "";

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageOne.textContent = "Loading...";

  const email = emailInput.value;
  const password = passwordInput.value;
  const name = nameInput.value;
  const surname = surnamelInput.value;
  const age = ageInput.value;
  const weight = weightInput.value;
  const fights = fightsInput.value;

  console.log("name:", name);
  console.log("fights:", fights);

  try {
    const response = await fetch("/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Informujemy serwer, że ciało żądania to JSON
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: email,
        password: password,
        name: name,
        surname: surname,
        age: age,
        weight: weight,
        fights: fights,
      }),
    });
    const data = await response.json();
    // console.log("co mamy w data", data);

    if (response.ok) {
      //localStorage.setItem("authUserToken", data.token);
      messageOne.textContent = "";
      messageTwo.textContent = "User created successfully!";
      window.location.href = data.redirectTo;
    } else {
      //   // Obsługa błędu logowania
      messageThree.textContent = data.error;
    }

    // if (response.ok) {
    //   // Przekierowanie na clubpanel po zalogowaniu
    //   window.location.href = data.redirectTo;
    // } else {
    //   // Obsługa błędu logowania
    //   messageThree.textContent = data.error;
    // }
  } catch (error) {
    console.error("Error:", error);
    messageOne.textContent = "";
    messageThree.textContent = "Failed to create user.";
  }
});
