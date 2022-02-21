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
    
    socket.on("nickname", (nick, done) => {
        socket['nickName'] = nick;
        done();
    });

    socket.on("enter_room", (message, done) => {
        socket.join(`${message.roomName}`);
        done(message.roomName);
        console.log(socket.rooms);
        socket.to(message.roomName).emit("welcome", socket['nickName'], roomCount(message.roomName, 'add'));
        io.sockets.emit("room_change", publicRooms());
    });

    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => {
            socket.to(room).emit("bye", socket['nickName'], roomCount(room, 'minus'));
        });
    });

    socket.on("disconnect", () => {
        io.sockets.emit("room_change", publicRooms());
    });

    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message",socket['nickName'], msg);
        done();
    });
});
/*
const wss = new WebSocket.Server({ server });
const sockets = [];

function makeMessage(nickname, message) {
    const msg = {
        nick: nickname, 
        data: message
    };
    return JSON.stringify(msg);
}

wss.on("connection", (socket) => { // socket은 백엔드 서버에 연결된 브라우저를 의미.
    sockets.push(socket);
    console.log("Connected to Browser ❗️");
    socket["nickName"] = "anonymous";
    socket.on("close", () => {
        console.log("Disconnected from browser");
    });

    socket.on("message", (message) => {
        const msg = JSON.parse(message.toString()); // object 형태로 다시 만들어준다.
        switch(msg.type) {
            case 'message':
                sockets.forEach((aSocket) => {
                    aSocket.send(makeMessage(socket.nickName, msg.data));
                });
            break;
            case 'nickname':
                socket['nickName'] = msg.data;
                console.log(socket['nickName']);
            break;
        }
        //socket.send(`${message.toString()}`);
    });
});
*/
httpServer.listen(3000, handleListen);
