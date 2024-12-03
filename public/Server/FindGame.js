
socket.on("LoadServerList", (Servers) => {
    console.log("Reloading servers")
    const ServerList = document.getElementById("ServerList")
    ServerList.innerHTML = ""
    
    for (const [Key, Value] of Object.entries(Servers)) {
        ServerList.innerHTML +=
        `<div class = "Player">
            <div>Server Id: ${Key}</div>
            <div>Players: ${1 + Value.Players.length}</div>
        </div>`;
    }
})

document.addEventListener("click", (event) => {
    
    // Makes sure you are clicking on a server
    if (!Array.from(event.target.classList).includes("Player") &&
        !Array.from(event.target.parentElement.classList).includes("Player")) {
        return;
    }

    let ServerID;
    if (Array.from(event.target.classList).includes("Player")) {
        ServerID = event.target.children[0].innerHTML.slice(11);
    }
    else {
        ServerID = event.target.parentElement.children[0].innerHTML.slice(11);
    }

    GoToCreateGame();
    socket.emit("JoinServer", ServerID);
});

function GetServerList() {
    socket.emit("GetServerList");
}