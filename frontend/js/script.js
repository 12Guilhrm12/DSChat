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

function PlaySound() {
    var sound = document.getElementById("not");
    sound.play();
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
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

    PlaySound()

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

    if (message.content.length < 250) {
        websocket.send(JSON.stringify(message))
    } else {
        alert("Insira uma mensagem até 250 caractéres!")
        
    }
    
    chatInput.value = ""
}

const handleLogin = (event) => {
    event.preventDefault()

    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    if (user.name.length < 25) {

        login.style.display = "none"
        chat.style.display = "flex"

        websocket = new WebSocket("wss://dschat-1.onrender.com")

        const serverMessageI = createMessageServerElement(`Olá, ${user.name}. Sejá bem-vindo ao DSChat!`)
        const serverMessageII = createMessageServerElement(`O DSChat ainda está em desenvolvimento, espere por bugs!`)
        const serverMessageIII = createMessageServerElement(`Passe o mouse sobre a parte inferior da tela para revelar a barra de texto...`)
        chatMessages.appendChild(serverMessageI)
        chatMessages.appendChild(serverMessageII)
        chatMessages.appendChild(serverMessageIII)
        scrollScreen()

        websocket.onmessage = processMessage
    } else {
        alert("Insira um nome até 25 caractéres!")
    }
}


loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)
