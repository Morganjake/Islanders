socket.on("UpdatePlayers", (Owner, Players) => {
    console.log("Updating players");
    const PlayerList = document.getElementById("PlayerList")
    PlayerList.innerHTML = `<div class = "Player"><div>${Owner}</div></div>`;
    
    for (Player = 0; Player < Players.length; Player++) {
        PlayerList.innerHTML +=
        `<div class = "Player">
            <div>${Players[Player]}</div>
        </div>`;
    }
})

function CreateGame() {
    socket.emit("CreateGame");
}

function LeaveGame() {
    socket.emit("LeaveGame");
}