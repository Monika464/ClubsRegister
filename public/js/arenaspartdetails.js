//const arenaid = "673e41197979a56feabe326c";
const arenaid = localStorage.getItem('arenaid')
const token = localStorage.getItem('authManagerToken')
//const userList = document.querySelector("#user-list");
const messageError = document.querySelector('#message-error')
//const messageOne = document.querySelector("#message-1");
const messageTwo = document.querySelector('#message-2')
const logoutLink = document.querySelector('#logout-link')
const listTitle = document.querySelector('#list-title')
//const createUserButton = document.querySelector("#create-user");
//const deleteMe = document.querySelector("#delete-link");
const arenaList = document.querySelector('#arena-list')
const userList = document.querySelector('#user-listA')
const sortByWeightButton = document.querySelector('#sort-by-weight')
const sortByClubButton = document.querySelector('#sort-by-club')

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
const viewClubContactsButton = document.querySelector('#view-club-contacts')
const clubContactList = document.querySelector('#club-contact-list')
//let isEditMode = true;
const exportToXmlButton = document.querySelector('#export-to-xml')
// Usuwanie arenaid z localStorage po opuszczeniu strony
window.addEventListener('beforeunload', () => {
  localStorage.removeItem('arenaid')
})

const readArenas = async () => {
  arenaList.innerHTML = ''
  messageError.textContent = ''
  // messageOne.textContent = "";

  if (!token) {
    messageError.textContent = 'Authentication token not found. Please log in.'
    return
  }

  try {
    // console.log("czy jest token", token);
    const response = await fetch(`/arenas/${arenaid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
      },
    })
    const arena = await response.json()
    if (!response.ok) {
      throw new Error(arena.error || 'Failed to fetch data.')
    }
    //console.log("data", arena);

    //zrob wysweiltanie przypadku jak data jest errorem bo np. brak autentifikacji

    //data.forEach((arena) => {
    const li = document.createElement('li') // Tworzenie nowego elementu <li>
    //console.log("arena", arena);
    li.textContent = `
    ${arena.title}
    ${arena.description}
     ${arena.arenaTimeStart}
     ${arena.arenaTimeRegisClose}
    `
    //});

    arenaList.appendChild(li)
  } catch (error) {
    console.error('Error:', error)
    // messageOne.textContent = "Error loading arenas";
  }
}
readArenas()

let usersData = []

const readUsers = async (arenaid) => {
  try {
    const response = await fetch('/arenas/participants/manager', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        arenaid: arenaid,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch participants.')
    }

    const users = await response.json()
    // console.log("Participants data:", users);

    usersData = users

    // Wyświetl użytkowników
    displayUsers(usersData)
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

readUsers(arenaid)

const displayUsers = async (users) => {
  userList.innerHTML = '' // Wyczyść istniejącą listę

  for (const user of users) {
    const li = document.createElement('li')
    li.innerHTML = `
        ${user.name} ${user.surname} - Age: ${user.age}, Weight: ${user.weight}, Fights: ${user.fights}
        <span class="club-name">Loading club...</span>
      `
    userList.appendChild(li)

    // Pobierz nazwę klubu
    const clubName = await getClubName(user.owner)
    const clubNameSpan = li.querySelector('.club-name')
    if (clubNameSpan) {
      clubNameSpan.textContent = `Club: ${clubName}`
    }
  }
}

const getClubName = async (ownerid) => {
  try {
    const response = await fetch('/clubs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        arenaid: arenaid,
        //arenaid: arena._id,
      },
    })
    if (!response.ok) {
      throw new Error('Failed to fetch club .')
    }
    const clubs = await response.json()
    const club = clubs.find((club) => club._id === ownerid)

    return club ? club.name : 'Unknown Club'

    //console.log("clubs", data);
  } catch (error) {
    console.error('Error:', error)
    console.error('Error fetching club name:', error)
    return 'Unknown Club'
  }
}

// Sortowanie według wagi
sortByWeightButton.addEventListener('click', () => {
  const sortedUsers = [...usersData].sort((a, b) => a.weight - b.weight)
  displayUsers(sortedUsers)
})

// Sortowanie według nazwy klubu
sortByClubButton.addEventListener('click', async () => {
  // Pobierz nazwy klubów dla każdego użytkownika
  const usersWithClubs = await Promise.all(
    usersData.map(async (user) => ({
      ...user,
      clubName: await getClubName(user.owner),
    })),
  )

  // Posortuj według nazwy klubu
  const sortedUsers = usersWithClubs.sort((a, b) =>
    a.clubName.localeCompare(b.clubName),
  )

  displayUsers(sortedUsers)
})

viewClubContactsButton.addEventListener('click', async () => {
  try {
    // Wyczyść poprzednią listę klubów
    clubContactList.innerHTML = ''

    // Utwórz zestaw unikalnych ownerId (klubów) z wyświetlanych użytkowników
    const ownerIds = [...new Set(usersData.map((user) => user.owner))]

    // Pobierz dane klubów dla tych ownerId
    const response = await fetch('/clubs', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        arenaid: arenaid,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch clubs.')
    }

    const clubs = await response.json()

    // Filtrowanie klubów tylko dla wybranych ownerId
    const filteredClubs = clubs.filter((club) => ownerIds.includes(club._id))

    // Wyświetl dane klubów
    filteredClubs.forEach((club) => {
      const li = document.createElement('li')
      li.innerHTML = `
        <strong>${club.name}</strong><br>
        City: ${club.city || 'N/A'}<br>
        Phone: ${club.phone || 'N/A'}<br>
        Email: ${club.email || 'N/A'}<br>
        
      `
      clubContactList.appendChild(li)
    })
  } catch (error) {
    console.error('Error fetching club contacts:', error)
    const errorLi = document.createElement('li')
    errorLi.textContent = 'Failed to load club contacts. Please try again.'
    clubContactList.appendChild(errorLi)
  }
})

//button export
//button export
exportToXmlButton.addEventListener('click', async () => {
  if (usersData.length === 0) {
    alert('Nie ma użytkowników do wyeksportowania.')
    return
  }

  // Nagłówki CSV
  let csvContent = 'Name,Surname,Age,Weight,Fights,Club Name\n'

  // Dodanie wierszy użytkowników
  for (const user of usersData) {
    // Pobierz nazwę klubu asynchronicznie
    const clubName = await getClubName(user.owner)

    // Dodaj dane użytkownika do CSV
    csvContent += `${user.name},${user.surname},${user.age},${user.weight},${
      user.fights
    },${clubName || 'Unknown'}\n`
  }

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'users.csv'
  link.click()
})

// exportToXmlButton.addEventListener("click", () => {
//   if (usersData.length === 0) {
//     alert("Nie ma użytkowników do wyeksportowania.");
//     return;
//   }

//   // Nagłówki CSV
//   let csvContent = "Name,Surname,Age,Weight,Fights,Club Name\n";

//   // Dodanie wierszy użytkowników
//   csvContent += usersData
//     .map(
//       (user) =>
//         `${user.name},${user.surname},${user.age},${user.weight},${
//           user.fights
//         },${user.clubName || "Unknown"}`
//     )
//     .join("\n");

//   const blob = new Blob([csvContent], { type: "text/csv" });
//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = "users.csv";
//   link.click();
// });
