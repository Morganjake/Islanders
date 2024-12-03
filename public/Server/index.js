const socket = io();

socket.on("GoToHomeScreen", () => {
    GoToHomeScreen()
})

function GoToHomeScreen() {
    document.getElementById("HomeContainer").style.display = "flex"
    document.getElementById("CreateGameContainer").style.display = "none"
    document.getElementById("FindGameContainer").style.display = "none"
    document.getElementById("GameContainer").style.display = "none"
}

function GoToCreateGame() {
    document.getElementById("HomeContainer").style.display = "none"
    document.getElementById("CreateGameContainer").style.display = "flex"
    document.getElementById("FindGameContainer").style.display = "none"
    document.getElementById("GameContainer").style.display = "none"
}

function GoToFindGame() {
    document.getElementById("HomeContainer").style.display = "none"
    document.getElementById("CreateGameContainer").style.display = "none"
    document.getElementById("FindGameContainer").style.display = "flex"
    document.getElementById("GameContainer").style.display = "none"
}

function GoToGame() {
    document.getElementById("HomeContainer").style.display = "none"
    document.getElementById("CreateGameContainer").style.display = "none"
    document.getElementById("FindGameContainer").style.display = "none"
    document.getElementById("GameContainer").style.display = "flex"
}