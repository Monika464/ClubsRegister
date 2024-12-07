//console.log("witamy po stronie klienta clubpanel");
const token = localStorage.getItem('authManagerToken')
//const userList = document.querySelector("#user-list");
const messageError = document.querySelector('#message-error')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const logoutLink = document.querySelector('#logout-link')
const listTitle = document.querySelector('#list-title')
//const createUserButton = document.querySelector("#create-user");
//const deleteMe = document.querySelector("#delete-link");
const arenaList = document.querySelector('#arena-list')
const userList = document.querySelector('#user-list')

const form = document.querySelector('#arena-edit-form')
const titleInput = document.querySelector('#title-input')
const descriptionInput = document.querySelector('#description-input')
const arenaTimeRegisOpenInput = document.querySelector(
  '#arenaTimeRegisOpen-input',
)
const arenaTimeRegisCloseInput = document.querySelector(
  '#arenaTimeRegisClose-input',
)
const arenaTimeStartInput = document.querySelector('#arenaTimeStart-input')
const arenaTimeCloseInput = document.querySelector('#arenaTimeClose-input')

//let isEditMode = true;

const readArenas = async () => {
  arenaList.innerHTML = '' // Clear previous list
  messageError.textContent = ''
  messageOne.textContent = ''

  if (!token) {
    messageError.textContent = 'Authentication token not found. Please log in.'
    return
  }

  try {
    // console.log("czy jest token", token);
    const response = await fetch('/arenas/manager', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
      },
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch data.')
    }
    console.log('data', data)

    //zrob wysweiltanie przypadku jak data jest errorem bo np. brak autentifikacji

    data.forEach((arena) => {
      const li = document.createElement('li') // Tworzenie nowego elementu <li>
      //console.log("arena", arena);
      li.textContent = `
    ${arena.title} 
    ${arena.arenaTimeStart}
    ${arena.description}
    `

      // Tworzenie przycisku "Apply"
      const applyButton = document.createElement('button')
      applyButton.textContent = 'Edit arena'

      // Dodanie funkcji kliknięcia, która loguje arena._id
      applyButton.addEventListener('click', () => {
        console.log('Arena ID:', arena._id)
        gettingDataFromBase(arena._id)
      })

      const deleteButton = document.createElement('button')
      deleteButton.textContent = 'Delete'
      deleteButton.addEventListener('click', () => {
        // kasowanie starych
        showDeleteForm(arena._id, arena.title)
      })

      // Dodanie przycisku do elementu <li>
      li.appendChild(applyButton)
      li.appendChild(deleteButton)
      arenaList.appendChild(li) // Dodanie elementu <li> do listy
    })

    ///

    ///

    logoutLink.style.display = 'block'
  } catch (error) {
    console.error('Error:', error)
    // messageOne.textContent = "Error loading arenas";
  }
}
readArenas()

try {
  //FUNCJA WYPELNIAJACA danymi z usera bazy form

  gettingDataFromBase = async (id) => {
    const response = await fetch(`/arenas/${id}`, {
      method: 'GET', // lub POST w zależności od operacji
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
      },
    })
    const arena = await response.json()

    localStorage.setItem('arenaIdedit', id)

    // Ustawianie wartości pól
    document.getElementById('title-input').value = arena.title
    document.getElementById('description-input').value = arena.description

    // Formatowanie daty dla pól datetime-local
    document.getElementById('arenaTimeRegisOpen-input').value = formatDateTime(
      arena.arenaTimeRegisOpen,
    )
    document.getElementById('arenaTimeRegisClose-input').value = formatDateTime(
      arena.arenaTimeRegisClose,
    )
    document.getElementById('arenaTimeStart-input').value = formatDateTime(
      arena.arenaTimeStart,
    )
    document.getElementById('arenaTimeClose-input').value = formatDateTime(
      arena.arenaTimeClose,
    )
  }

  // Funkcja formatująca datę do wymaganego formatu
  function formatDateTime(dateString) {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`

    // document.getElementById("title-input").value = arena.title;
    // document.getElementById("description-input").value = arena.description;
    // document.getElementById("arenaTimeRegisOpen-input").value =
    //   arena.arenaTimeRegisOpen;
    // document.getElementById("arenaTimeRegisClose-input").value =
    //   arena.arenaTimeRegisClose;
    // document.getElementById("arenaTimeStart-input").value =
    //   arena.arenaTimeStart;
    // document.getElementById("arenaTimeClose-input").value =
    //   arena.arenaTimeClose;
  }
} catch (error) {
  console.log(error)
}

//wysylanie aktualizacji do bazy

const updatingArena = async (id) => {
  const title = titleInput.value
  const description = descriptionInput.value
  const regisOpen = arenaTimeRegisOpenInput.value
  const regisClose = arenaTimeRegisCloseInput.value
  const timeStart = arenaTimeStartInput.value
  const timeClose = arenaTimeCloseInput.value

  try {
    const response = await fetch(`/arenas/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json', // Informujemy serwer, że ciało żądania to JSON
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title,
        description: description,
        arenaTimeRegisOpen: regisOpen,
        arenaTimeRegisClose: regisClose,
        arenaTimeStart: timeStart,
        arenaTimeClose: timeClose,
      }),
    })
    const data = await response.json()
    console.log('response', response.ok)

    if (response.ok) {
      messageError.textContent = ''
      messageTwo.textContent = 'Arena updated successfully!'
      localStorage.removeItem('arenaIdedit')
      console.log('item removed from storage')
      form.reset()
    } else {
      //   // Obsługa błędu logowania
      messageError.textContent = data.error || 'Failed to update arena.'
      localStorage.removeItem('arenaIdedit')
    }
  } catch (error) {
    console.error('Błąd przy aktualizacji:', error)
    localStorage.removeItem('arenaIdedit')
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  //messageOne.textContent = "Loading...";

  try {
    const arenaId = localStorage.getItem('arenaIdedit')
    //const userId = document.querySelector('input[name="user-selection"]:checked')?.value;
    //console.log("czy jest tu id", arenaId);
    if (!arenaId) {
      messageError.textContent = 'Wybierz użytkownika do edycji.'
      return
    }
    updatingArena(arenaId)
  } catch (error) {
    console.error('Błąd podczas aktualizacji areny:', error)
    messageError.textContent = 'Wystąpił błąd podczas aktualizacji areny.'
  }
})

const showDeleteForm = (arenaId, arenaTitle) => {
  // Tworzenie formularza
  const form = document.createElement('form')
  form.id = 'delete-form'

  const label = document.createElement('label')
  label.textContent = `Type the title of the arena ("${arenaTitle}") to confirm:`
  form.appendChild(label)

  const input = document.createElement('input')
  input.type = 'text'
  input.required = true
  input.placeholder = 'Enter arena title'
  form.appendChild(input)

  const submitButton = document.createElement('button')
  submitButton.type = 'submit'
  submitButton.textContent = 'Confirm'
  form.appendChild(submitButton)

  // Dodanie formularza do listy (lub innego elementu)
  arenaList.appendChild(form)

  // Obsługa zdarzenia "submit"
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (input.value === `${arenaTitle}`) {
      console.log('Deleted Arena ID:', arenaId)
      //DELETING

      const deleteArena = async () => {
        const response = await fetch(`/arenas/${arenaId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          console.log('Deleted Arena ID:', arenaId)
          messageTwo.textContent = `Arena "${arenaTitle}" deleted successfully!`
          arenaList.removeChild(form) // Usunięcie formularza po zatwierdzeniu
          readArenas() // Odświeżenie listy aren
        } else {
          const data = await response.json()
          messageError.textContent = data.error || 'Failed to delete arena.'
        }
      }
      deleteArena()
      //  try {
      //
      //   });

      //   if (response.ok) {
      //
      //
      //   ;
      //   }
      // } catch (error) {
      //   console.error("Error deleting arena:", error);
      //   messageError.textContent = "Error deleting arena.";
      // }
      // } else {
      //   alert(`Incorrect title. Please type "${arenaTitle}" to confirm.`);
      // }

      ///
    } else {
      alert('Incorrect confirmation text. Please type arena Title.')
    }
  })
}
