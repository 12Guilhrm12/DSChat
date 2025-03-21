// login elements
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

// chat elements
const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMessages = chat.querySelector(".chat__messages")

const colors = [
    "red",
    "blue",
    "green",
    "orange",
    "purple",
    "golden"
];

const user = { id: "", name: "", color: "" }

let websocket


const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight - 100,
        behavior: "smooth"
    })
}

const createMessageSelfElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message--self")

    span.classList.add("nickname")
    span.style.color = senderColor
    span.innerHTML = sender + ": "

    div.appendChild(span)
    div.appendChild(document.createTextNode(content))
    return div
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message--other")

    span.classList.add("message--sender")
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender + ": "
    div.innerHTML += content

    return div
}

const createMessageServerElement = (content) => {
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message--server")

    span.classList.add("server")
    span.innerHTML = "Servidor: "

    div.appendChild(span)
    div.appendChild(document.createTextNode(content))

    return div
}

const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const processMessage = ({ data }) => {
    const { userId, userName, userColor, content } = JSON.parse(data)

    const message =
        userId == user.id
            ? createMessageSelfElement(content, userName, userColor)
            : createMessageOtherElement(content, userName, userColor)

    chatMessages.appendChild(message)

    scrollScreen()
}


const sendMessage = (event) => {
    event.preventDefault()

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    websocket.send(JSON.stringify(message))

    chatInput.value = ""
}

const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("wss://dschat-duhh.onrender.com")

    const serverMessage = createMessageServerElement(`Olá, ${user.name}. Sejá bem-vindo ao DSChat!`)
    chatMessages.appendChild(serverMessage)
    scrollScreen()

    websocket.onmessage = processMessage
}


loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)
