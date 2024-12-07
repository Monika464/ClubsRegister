const token = localStorage.getItem('authToken')
const arenaList = document.querySelector('#arena-list')
const userList = document.querySelector('#user-listA')
const messageError = document.querySelector('#message-error')
const messageOne = document.querySelector('#message-1')
const listTitle = document.querySelector('#list-title')
const arenaDetails = document.createElement('div')
//ZCZYTYWANIE USEROW WSZYSTKICH Z KLUBU
const readUsers = async (arena) => {
  console.log('arena', arena)
  messageError.textContent = ''
  try {
    const response = await fetch('/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
      },
    })
    const data = await response.json()
    //console.log("datausers", data);

    // Oczyszczanie listy użytkowników przed ponownym renderowaniem
    userList.innerHTML = ''

    // Tablica do przechowywania ID zaznaczonych użytkowników
    const selectedUserIds = []

    //////
    // Wyświetlenie danych areny na początku listy użytkowników
    const arenaDetails = document.createElement('div')
    arenaDetails.innerHTML = `
 <h2>${arena.title}</h2>
 <p>Start Time: ${arena.arenaTimeStart}</p>
 <p>Description: ${arena.description}</p>
`
    userList.appendChild(arenaDetails)

    ////////

    data.forEach((user) => {
      const li = document.createElement('li') // Tworzenie nowego elementu <li>
      // console.log("lista userow", user);
      li.classList.add('user-item')
      li.innerHTML = `
        <input type="checkbox" value="${user._id}" class="user-checkbox">
        ${user.name} ${user.surname} - Age: ${user.age}, Weight: ${user.weight}, Fights: ${user.fights}
      `

      userList.appendChild(li) // Dodanie elementu <li> do listy
    })

    // Dodanie event listenera do checkboxów
    userList.addEventListener('change', (event) => {
      const checkbox = event.target
      if (checkbox.classList.contains('user-checkbox')) {
        if (checkbox.checked) {
          messageOne.textContent = ''
          selectedUserIds.push(checkbox.value)
        } else {
          // Usuń ID z tablicy, jeśli checkbox jest odznaczony
          const index = selectedUserIds.indexOf(checkbox.value)
          if (index > -1) {
            selectedUserIds.splice(index, 1)
          }
        }
      }
      console.log('selected', selectedUserIds)
    })

    const participateButton = document.getElementById('participate-users')
    if (arena.withhold) {
      participateButton.disabled = true
      participateButton.textContent = 'Application withhold'
      participateButton.classList.add('disabled-button') // Opcjonalnie: stylizacja
    } else {
      participateButton.disabled = false
      participateButton.textContent = 'Participate'
      participateButton.classList.remove('disabled-button')

      participateButton.addEventListener('click', () => {
        sendParticipantsToBase(arena._id, selectedUserIds)
        messageOne.textContent = 'User send'
      })
    }

    // // Obsługa przycisku, który loguje tablicę ID zaznaczonych użytkowników
    // const participateButton = document.getElementById("participate-users");
    // participateButton.addEventListener("click", () => {
    //   //console.log("Zaznaczone ID użytkowników:", selectedUserIds);
    //   sendParticipantsToBase(arena._id, selectedUserIds);
    //   ///
    // });
  } catch (error) {
    console.error('Error:', error)
    messageError.textContent = 'Error'
  }
}
//KONIEC ZCZYTAWANIU WSZYSTKICH USEROW KLUBU

//ZCZYTYWANIE ARENY

const readArenas = async () => {
  messageError.textContent = ''

  try {
    // console.log("czy jest token", token);
    const response = await fetch('/arenas/apply', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
      },
    })
    const data = await response.json()
    //console.log("data", data);
    data.forEach((arena) => {
      const li = document.createElement('li') // Tworzenie nowego elementu <li>
      arenaDetails.classList.add('arena-details')
      li.textContent = `
    ${arena.title} 
    ${arena.arenaTimeStart}
    ${arena.description}
    `

      // Tworzenie przycisku "Apply"
      const applyButton = document.createElement('button')
      applyButton.textContent = 'Choose arena'

      // Dodanie funkcji kliknięcia, która loguje arena._id
      applyButton.addEventListener('click', () => {
        // console.log("Arena ID:", arena._id);
        messageOne.textContent = ''
        readUsers(arena)
      })

      // Dodanie przycisku do elementu <li>
      li.appendChild(applyButton)

      arenaList.appendChild(li) // Dodanie elementu <li> do listy
    })
  } catch (error) {
    console.error('Error:', error)
    messageError.textContent = 'Error'
    messageOne.textContent = ''
  }
}
readArenas()

sendParticipantsToBase = async (arenaId, selected) => {
  try {
    const response = await fetch('/arenas/apply/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ arenaId, userIds: selected }),
    })

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`)
    }
    const data = await response.json()
    // console.log("co my tu mamy", data);
  } catch (error) {
    console.error('Error:', error)
  }
}
