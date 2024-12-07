const token = localStorage.getItem('authManagerToken')
const messageError = document.querySelector('#message-error')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')

const form = document.querySelector('#arena-create-form')
const titleInput = document.querySelector('#title-input')
const descriptionInput = document.querySelector('#description-input')

const arenaTimeReleaseInput = document.querySelector('#arenaTimeRelease-input')

const arenaTimeRegisOpenInput = document.querySelector(
  '#arenaTimeRegisOpen-input',
)
const arenaTimeRegisCloseInput = document.querySelector(
  '#arenaTimeRegisClose-input',
)
const arenaTimeStartInput = document.querySelector('#arenaTimeStart-input')
const arenaTimeCloseInput = document.querySelector('#arenaTimeClose-input')

const saveNewArena = async () => {
  messageOne.textContent = 'Loading...'
  try {
    const title = titleInput.value
    const description = descriptionInput.value
    const release = arenaTimeReleaseInput.value
    const regisOpen = arenaTimeRegisOpenInput.value
    const regisClose = arenaTimeRegisCloseInput.value
    const timeStart = arenaTimeStartInput.value
    const timeClose = arenaTimeCloseInput.value

    const response = await fetch('/arenas', {
      method: 'POST', // lub POST w zależności od operacji
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Dodanie tokena do nagłówka
      },
      body: JSON.stringify({
        title: title,
        description: description,
        arenaTimeRelease: release,
        arenaTimeRegisOpen: regisOpen,
        arenaTimeRegisClose: regisClose,
        arenaTimeStart: timeStart,
        arenaTimeClose: timeClose,
      }),
    })
    const arena = await response.json()

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    messageOne.textContent = 'Arena saved'
  } catch (error) {
    console.error('Błąd przy aktualizacji:', error)
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  saveNewArena()
  //
})
