const messageOne = document.querySelector('#message-1')

const token = localStorage.getItem('authUserToken')
messageOne.textContent = ''

// if (!token) {
//   window.location.href = "/";
// }

fetch('/userss/me', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
  },
})
  .then((response) => {
    messageOne.textContent = 'Loading...'
    if (response.ok) {
      // Usuwamy token po pomyślnym wylogowaniu
      localStorage.removeItem('authUserToken')
      messageOne.textContent = 'member deleted'

      // Przekierowanie na glowna
      // window.location.href = "/";
    } else {
      //messageOne.textContent = "anable to delete";
      response.json().then((data) => {
        messageOne.textContent = data.message || 'anable to delete'
      })
      // throw new Error("Wylogowanie nie powiodło się");
    }
  })
  .catch((error) => {
    console.error('Error:', error)
    messageOne.textContent = 'An error occurred. Please try again.'
  })
