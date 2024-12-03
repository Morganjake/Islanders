const Express = require("express");
const App = Express();

// socket.io setup
const Http = require("http");
const HttpServer = Http.createServer(App);
const { Server } = require("socket.io");
const io = new Server(HttpServer, { pingInterval: 2000, pingTimeout: 5000 });

const PORT = 3000;

App.use(Express.static("public"));

App.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

HttpServer.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
})

console.log("Server has loaded");

//---------------------------------------------//
//              Actual game stuff              //
//---------------------------------------------//

let Games = {};
let PlayerGameMap = {}; // Dictionary that tells us which Game a player has joined


function LeaveGame(SockedID, socket) {
    // If disconnected user owned a lobby
    const GameID = PlayerGameMap[SockedID];
    if (GameID == SockedID) {

        // Kicks players out of the game
        for (let i = 0; i < Games[SockedID].Players.length; i++) {
            delete PlayerGameMap[Games[SockedID].Players[0]];
        }

        console.log("User was game owner so game has been removed");
        return [Games[SockedID], 0];
    }
    else if (Games[GameID] != undefined){
        
        Games[GameID]["Players"].splice(Games[GameID]["Players"].indexOf(SockedID), 1);
        return [Games[GameID], 1];
    }
}


io.on("connection", (socket) => {

    console.log(`User "${socket.id}" has joined`);

    socket.on("disconnect", (reason) => {
        console.log(`User "${socket.id}" has disconnected for reason "${reason}"`);

        // Check if the client was in a game
        if (!(socket.id in PlayerGameMap)) { return }

        const Result = LeaveGame(socket.id, socket);
        const Game = Result[0];
        const Status = Result[1];
        
        if (Status === 0) {
            // Kicks every client
            for (Player = 0; Player < Game.Players.length; Player++) {
                io.to(Game.Players[Player]).emit("GoToHomeScreen")
            }
            delete Games[socket.id]
        }
        else {
            // Update every client
            io.to(Game.Owner).emit("UpdatePlayers", Game.Owner, Game.Players)

            for (Player = 0; Player < Game.Players.length; Player++) {
                io.to(Game.Players[Player]).emit("UpdatePlayers", Game.Owner, Game.Players)
            }
        }
    })

    // Called when a player creates a new lobby
    socket.on("CreateGame", () => {
        console.log(`Added game ${socket.id} to backend`);
        Games[socket.id] = {Owner: socket.id, Players: []};
        PlayerGameMap[socket.id] = socket.id;
        console.log("Created new game");
        console.log(Games);
        console.log(PlayerGameMap);
        io.emit("LoadServerList", Games);
        io.to(socket.id).emit("UpdatePlayers", socket.id, [])
    });

    socket.on("LeaveGame", () => {
        const Result = LeaveGame(socket.id, socket);
        const Game = Result[0];
        const Status = Result[1];
        console.log(Game)
        console.log(Status)
        
        if (Status === 0) {
            // Kicks every client
            for (Player = 0; Player < Game.Players.length; Player++) {
                io.to(Game.Players[Player]).emit("GoToHomeScreen");
            }
            delete Games[socket.id]
        }
        else {
            // Update every client
            io.to(Game.Owner).emit("UpdatePlayers", Game.Owner, Game.Players);

            for (Player = 0; Player < Game.Players.length; Player++) {
                io.to(Game.Players[Player]).emit("UpdatePlayers", Game.Owner, Game.Players);
            }
        }
    });

    socket.on("GetServerList", () => {
        console.log("Loading servers");
        io.emit("LoadServerList", Games);
    });

    socket.on("JoinServer", (ServerID) => {

        console.log(`Attempt to join server ${ServerID}`)
        if (!Object.keys(Games).includes(ServerID)) {
            console.log(`Server ID "${ServerID}" is missing`);
            return;
        }

        if (Games[ServerID].Players.includes(socket.id)) {
            console.log(`Player already in server "${ServerID}"`);
            return;
        }

        Games[ServerID].Players.push(socket.id);
        PlayerGameMap[socket.id] = Games[ServerID].Owner;

        console.log(`${socket.id} joined server ${ServerID}`)

        // Update every client
        io.to(Games[ServerID].Owner).emit("UpdatePlayers", Games[ServerID].Owner, Games[ServerID].Players)

        for (Player = 0; Player < Games[ServerID].Players.length; Player++) {
            io.to(Games[ServerID].Players[Player]).emit("UpdatePlayers", Games[ServerID].Owner, Games[ServerID].Players)
        }
    });
})
