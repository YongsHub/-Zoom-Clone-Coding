import express from "express";
import http from "http";
import { Server } from "socket.io";
const { instrument } = require("@socket.io/admin-ui");
//import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views"); // __dirname 현재 실행중인 폴더 경로
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000');

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true
    },
});
instrument(io, {
    auth: false,
});

function roomCount(room, check) {
    if(check === 'add') return `room name: ${room} 참여인원${io.sockets.adapter.rooms.get(room)?.size}명`;
    else return `room name: ${room} 참여인원${io.sockets.adapter.rooms.get(room)?.size - 1}명`;
}

function publicRooms() {
    const rooms = io.sockets.adapter.rooms;
    const sids = io.sockets.adapter.sids;

    const publicRooms = [];

    rooms.forEach((_, key) => {
        if(sids.get(key) === undefined){
            publicRooms.push(key);
        };
    });
    return publicRooms;
};

io.on("connection", socket => {
    socket.onAny((event) => {
        //console.log(io.sockets.adapter);
        console.log(`got event : ${event}`);
    });
    
    socket.on("join_room", (roomName, done) => {
        console.log(`룸이름: ${roomName}`);
        socket.join(roomName);
        done();
        socket.to(roomName).emit('welcome', roomName);
    });

    socket.on("offer", (offer, roomName) => {
        socket.to(roomName).emit('offer', offer);
    });
    socket.on("answer", (answer, roomName) => {
        socket.to(roomName).emit('answer', answer);
    });

    socket.on('ice', (candidate, roomName) => {
        socket.to(roomName).emit('ice', candidate);
    });
});

httpServer.listen(3000, handleListen);
