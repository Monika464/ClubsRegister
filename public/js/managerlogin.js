//console.log("witamy po stronie klienta clublogin");
const loginForm = document.querySelector('#manager-login-form')
const emailInput = document.querySelector('#email-input')
const passwordInput = document.querySelector('#password-input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const messageThree = document.querySelector('#message-3')

messageOne.textContent = ''
messageTwo.textContent = ''
messageThree.textContent = ''

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  messageOne.textContent = 'Loading...'

  const email = emailInput.value
  const password = passwordInput.value

  console.log('Email:', email)
  console.log('Password:', password)

  try {
    const response = await fetch('/managers/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Informujemy serwer, że ciało żądania to JSON
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
    const data = await response.json()
    // console.log("co jest w data", data);
    if (response.ok) {
      localStorage.setItem('authManagerToken', data.token)
      messageOne.textContent = ''
      messageTwo.textContent = 'Manger logged in'
      console.log('manager wlasnie sie zalogowal')
      messageOne.textContent = ''
    } else {
      //   // Obsługa błędu logowania
      messageThree.textContent = data.error
      messageOne.textContent = ''
      //console.log("response", response);
    }

    if (response.ok) {
      // Przekierowanie na clubpanel po zalogowaniu
      window.location.href = data.redirectTo
    } else {
      // Obsługa błędu logowania
      messageThree.textContent = data.error
    }
  } catch (error) {
    console.error('Error:', error)
    messageOne.textContent = ''
  }
})
