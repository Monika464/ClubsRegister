const token = localStorage.getItem('authToken')
const arenaList = document.querySelector('#arena-list')
const userList = document.querySelector('#user-listA')
const messageError = document.querySelector('#message-error')
const withdraw = document.querySelector('#withdraw-users')

const selectedUserIds = []

const listTitle = document.querySelector('#list-title')

const readArenas = async () => {
  messageError.textContent = ''
  arenaList.innerHTML = ''

  try {
    // console.log("czy jest token", token);
    const response = await fetch('/arenas/apply', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await response.json()
    //console.log("data", data);
    data.forEach((arena) => {
      const li = document.createElement('li')
      // console.log("arena", arena);
      li.textContent = `
    ${arena.title} 
    ${arena.arenaTimeStart}
    ${arena.description}
    `

      const applyButton = document.createElement('button')
      applyButton.textContent = 'Check participants'

      applyButton.addEventListener('click', () => {
        // console.log("Arena ID:", arena._id);
        readUsers(arena)
      })

      li.appendChild(applyButton)
      arenaList.appendChild(li)
    })
  } catch (error) {
    console.error('Error:', error)
    messageOne.textContent = ''
  }
}
readArenas()

const findDuplicates = (users) => {
  const duplicates = []
  const userMap = new Map()

  if (!users) {
    return null
  }

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
    const response = await fetch('/arenas/participants', {
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

    //duplicates
    const duplicateIds = findDuplicates(data)

    data.forEach((user) => {
      const li = document.createElement('li') // Tworzenie nowego elementu <li>
      // console.log("lista userow", user);
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
          selectedUserIds.push(user._id)
        } else {
          const index = selectedUserIds.indexOf(user._id)
          if (index > -1) {
            selectedUserIds.splice(index, 1)
          }
        }
        //console.log("Selected user IDs:", selectedUserIds);
      })

      userList.appendChild(li)
    })

    withdraw.addEventListener('click', () => {
      if (selectedUserIds.length > 0) {
        //console.log("Selected user IDs:", selectedUserIds);
        // console.log("arena :", arena._id);
        deleteParticipants(arena._id, selectedUserIds)
      } else {
        messageError.textContent = 'No users selected for deletion.'
      }
    })
  } catch (error) {
    console.error('Error:', error)
  }
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
    const responseText = await response.text() // Pobierz odpowiedź jako tekst
    console.log('Response text:', responseText)

    let result
    try {
      //const result = await response.json();
      result = JSON.parse(responseText)
    } catch (error) {
      throw new Error(responseText)
    }

    if (response.ok) {
      console.log('Participants successfully removed:', result)
      messageError.textContent = 'Participants removed successfully!'
      // Optionally refresh the list of participants after deletion
      //readUsers(arena);
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
