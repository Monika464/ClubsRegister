const token = localStorage.getItem('authManagerToken')
const arenaList = document.querySelector('#arena-list')
const userList = document.querySelector('#user-listA')
const messageError = document.querySelector('#message-error')
const withdraw = document.querySelector('#withdraw-users')
const paneledit = document.querySelector('#paneledit-link')
const paneledit2 = document.querySelector('#paneledit2-link')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
let editMode = false
const selectedUserIds = []
const sidebar = document.querySelector('#sidebar')
const listTitle = document.querySelector('#list-title')

// Formating date
const formatDate = (timestamp) => {
  const date = new Date(timestamp) // Konwersja timestamp na obiekt Date
  return date.toLocaleString('en-US', {
    // Dostosuj język i format
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Ustawienie 24-godzinnego formatu
  })
}

const readArenas = async () => {
  messageTwo.textContent = 'Loading...'
  messageOne.textContent = ''
  try {
    const response = await fetch('/arenas/manager', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to load arenas.')
    }
    sidebar.style.display = 'block'
    const data = await response.json()

    //messageOne.textContent = "";
    arenaList.innerHTML = ''

    data.forEach((arena) => {
      const li = document.createElement('li') // Tworzenie nowego elementu <li>

      li.textContent = `
    ${arena.title} 
    ${formatDate(arena.arenaTimeStart)}
    ${arena.description}
    `

      const applyButton = document.createElement('button')
      applyButton.textContent = 'Check participants'

      applyButton.addEventListener('click', () => {
        //console.log("Arena ID:", arena._id);
        readUsers(arena)
      })

      // Dodanie przycisku do elementu <li>
      li.appendChild(applyButton)
      arenaList.appendChild(li)

      //przycis details
      const detailsButton = document.createElement('button')
      detailsButton.textContent = 'Details'

      detailsButton.addEventListener('click', () => {
        console.log('Arena ID:', arena._id)
        localStorage.setItem('arenaid', arena._id)
        window.location.href = '/arenaspartdetails'
      })
      li.appendChild(detailsButton)
      arenaList.appendChild(li)

      //przycisk withhold

      const withholdButton = document.createElement('button')
      let withhold = arena.withhold

      if (withhold) {
        withholdButton.textContent = 'Withhold ON'
        withholdButton.style.backgroundColor = 'red'
      } else {
        withholdButton.textContent = 'Withhold OFF'
        withholdButton.style.backgroundColor = 'green'
      }

      withholdButton.addEventListener('click', () => {
        console.log('Arena ID:', arena._id)
        console.log('arena', arena)

        if (withhold) {
          restoreApplications(arena._id)
          withhold = false
          withholdButton.textContent = 'Withhold OFF'
          withholdButton.style.backgroundColor = 'green'
        } else {
          withholdApplications(arena._id)
          withhold = true
          withholdButton.textContent = 'Withhold ON'
          withholdButton.style.backgroundColor = 'red'
        }
      })

      // Dodanie przycisku do elementu <li>
      li.appendChild(withholdButton)
      arenaList.appendChild(li) // Dodanie elementu <li> do listy
    })
    messageError.textContent = ''
    messageOne.textContent = ''
    messageTwo.textContent = ''
    paneledit.style.display = 'block'
    if (paneledit2) {
      paneledit2.style.display = 'block' // Pokazanie linku
    } else {
      console.error('Element #paneledit2-link is missing.')
    }
  } catch (error) {
    console.error('Error:', error.message || error)
    messageOne.textContent =
      error.message || 'Error loading arenas. Please login.'
    messageTwo.textContent = ''
  }
  // } catch (error) {
  //   console.error("Error:", error);
  //   messageOne.textContent = "Error loading arenas please login";
  //   messageTwo.textContent = "";
  // }
}
readArenas()

//WITHOLD AND RESTORE

const withholdApplications = async (arenaId) => {
  try {
    const response = await fetch(`/arenas/${arenaId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        withhold: true,
      }),
    })
    const data = await response.json()
    console.log('response', response.ok)

    if (response.ok) {
      messageError.textContent = ''
      messageTwo.textContent = 'Arena updated successfully!'
    } else {
      messageError.textContent = data.error || 'Failed to update arena.'
    }
  } catch (error) {
    console.error('Błąd przy aktualizacji:', error)
  }
}

const restoreApplications = async (arenaId) => {
  try {
    const response = await fetch(`/arenas/${arenaId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        withhold: false,
      }),
    })
    const data = await response.json()
    console.log('response', response.ok)

    if (response.ok) {
      messageError.textContent = ''
      messageTwo.textContent = 'Arena updated successfully!'
    } else {
      messageError.textContent = data.error || 'Failed to update arena.'
    }
  } catch (error) {
    console.error('Błąd przy aktualizacji:', error)
  }
}

const findDuplicates = (users) => {
  const duplicates = []
  const userMap = new Map()

  users.forEach((user) => {
    const key = `${user.name}${user.surname}${user.age}${user.weight}${user.fights}`
    if (userMap.has(key)) {
      duplicates.push(user._id)
      duplicates.push(userMap.get(key))
    } else {
      userMap.set(key, user._id)
    }
  })

  return duplicates
}

//const readUsers = async (arenaid) => {
const readUsers = async (arena) => {
  try {
    const response = await fetch('/arenas/participants/manager', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        //arenaid: arenaid,
        arenaid: arena._id,
      },
    })

    const data = await response.json()

    userList.innerHTML = ''

    const arenaDetails = document.createElement('div')
    arenaDetails.innerHTML = `
     <h2>${arena.title}</h2>
     <p>Start Time: ${arena.arenaTimeStart}</p>
     <p>Description: ${arena.description}</p>
   `
    userList.appendChild(arenaDetails)

    //duplikaty
    const duplicateIds = findDuplicates(data)

    data.forEach((user) => {
      const li = document.createElement('li')
      li.classList.add('user-item')
      li.innerHTML = `
            <input type="checkbox" value="${user._id}" class="user-checkbox">
            ${user.name} ${user.surname} - Age: ${user.age}, Weight: ${user.weight}, Fights: ${user.fights}
          `

      if (duplicateIds.includes(user._id)) {
        li.style.backgroundColor = 'red'
      }

      const checkbox = li.querySelector('.user-checkbox')
      checkbox.addEventListener('change', (event) => {
        if (event.target.checked) {
          selectedUserIds.push(user._id) // Dodanie ID użytkownika do tablicy
        } else {
          const index = selectedUserIds.indexOf(user._id)
          if (index > -1) {
            selectedUserIds.splice(index, 1) // Usunięcie ID użytkownika z tablicy
          }
        }
        //console.log("Selected user IDs:", selectedUserIds);
      })

      userList.appendChild(li)
    })
    const editButton = document.createElement('button')
    editButton.textContent = 'Edit'
    editButton.addEventListener('click', () => {
      editMode = !editMode
      toggleCheckboxes(editMode)
      editButton.textContent = editMode ? 'Finish Editing' : 'Edit'
      withdraw.style.display = editMode ? 'block' : 'none'
    })
    userList.appendChild(editButton)

    withdraw.style.display = editMode ? 'block' : 'none'

    withdraw.addEventListener('click', () => {
      if (selectedUserIds.length > 0) {
        //console.log("Selected user IDs:", selectedUserIds);
        console.log('arena :', arena._id)
        console.log('selectedUserIds', selectedUserIds)
        deleteParticipants(arena._id, selectedUserIds)
      } else {
        messageError.textContent = 'No users selected for deletion.'
      }
    })
  } catch (error) {
    console.error('Error:', error)
  }
}

const toggleCheckboxes = (show) => {
  const checkboxes = document.querySelectorAll('.user-checkbox')
  checkboxes.forEach((checkbox) => {
    checkbox.style.display = show ? 'inline-block' : 'none'
  })
}

const deleteParticipants = async (arenaId, selectedUserIds) => {
  messageError.textContent = ''

  try {
    const response = await fetch(`/arenass/${arenaId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        //Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        usersToDeleteIds: selectedUserIds,
      }),
    })
    const responseText = await response.text()
    console.log('Response text:', responseText)

    let result
    try {
      //const result = await response.json();
      result = await JSON.parse(responseText)
    } catch (error) {
      throw new Error(responseText)
    }

    if (response.ok) {
      console.log('Participants successfully removed:', result)
      messageError.textContent = 'Participants removed successfully!'

      readUsers({ _id: arenaId })
    } else {
      console.error('Failed to remove participants:', result)
      messageError.textContent =
        result.message || 'Failed to remove participants.'
    }
  } catch (error) {
    console.error('Error:', error)
    messageError.textContent =
      'An error occurred while trying to remove participants.'
  }
}
