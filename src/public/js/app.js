const socket = io();
const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("form");
const room = document.querySelector("#room");
const roomForm = room.querySelector("form");
const changeNickNameForm = room.querySelector("#change");
const video = document.querySelector("#camera");
const mute = document.getElementById("mute");
const camera = document.getElementById("turn");
const camerasSelect = document.getElementById("cameras");
room.hidden = true; // 처음에 감춰둔다.
let room_Name = '';
let myStream;
let muteCheck = true; // 현재 마이크 켜져있음
let cameraCheck = true; // 카메라 켜져있음

async function getDevices() {
    try {
        // const devices = await navigator.mediaDevices.enumerateDevices();
        // const cameras = devices.filter((device) => device.kind === "videoinput");
        // console.log(cameras);
        const device = await navigator.mediaDevices.enumerateDevices();
        const videoDevice = device.filter((cameras) => cameras.kind === 'audiooutput');
        const currentCamera = myStream.getVideoTracks()[0];
        videoDevice.forEach((camera) => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if(currentCamera.label === camera.label) {
                option.selected = true
            }
            camerasSelect.appendChild(option);
        });
    } catch (error) {
        console.log(error);
    }
}


async function getMedia(device) {
    const initialMedia = { 
        audio: true, 
        video: { facingMode: "user" } 
    }

    const changeMedia = { 
        audio: true,
        video: { deviceId: device } 
    }
    try {
        myStream = await navigator.mediaDevices.getUserMedia(device ? changeMedia : initialMedia);
        console.log(myStream);
        video.srcObject = myStream;
        if(!device) {
            await getDevices();   
        }
      /* 스트림 사용 */
    } catch(err) {
        console.log(err);
    }
}
getMedia();

mute.addEventListener("click", () => {
    myStream.getAudioTracks()
        .forEach((tracks) =>{
            tracks.enabled = !tracks.enabled;
            console.log(tracks);
        });
    if(muteCheck) { // 음소거
        muteCheck = false;
        mute.innerText = 'UnMute';
    }else { // 음소거 해제
        muteCheck = true;
        mute.innerText = 'Mute';
    }
});
camera.addEventListener("click", () => {
    myStream.getVideoTracks()
        .forEach((tracks) =>{
            tracks.enabled = !tracks.enabled;
            console.log(tracks);
        });
    if(cameraCheck) { // 카메라 끄기
        cameraCheck = false;
        camera.innerText = 'Camera ON';
    }else{ // 카메라 켜기
        cameraCheck = true;
        camera.innerText = 'Camera OFF'
    }
});

camerasSelect.addEventListener("input", () => {
    const value = camerasSelect.value;
    console.log(value);
    getMedia(value);
});

function makeMessage(msg) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = msg;
    ul.append(li);
}

function roomCount(roomInfo) {
    const h3 = room.querySelector("h3");
    h3.innerText = roomInfo;
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const roomNum = form.querySelector("#roomName");
    const nick = form.querySelector("#nick");
    room_Name = roomNum.value;
    console.log(roomNum.value, nick.value);

    socket.emit("nickname", nick.value, () => { // 닉네임 지정
        console.log("nickname설정이 서버에서 실행되었습니다.");
    });

    socket.emit("enter_room", {roomName: roomNum.value}, (roomName) => {
        room.hidden = false;
        welcome.hidden = true;
        const h3 = room.querySelector("h3");
        h3.innerText = `room name: ${roomName}`;
    });
    roomNum.value ="";
});

roomForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = room.querySelector("input");
    const message = input.value;

    socket.emit("new_message", message, room_Name, () => {
        makeMessage(`You: ${message}`);
    });

    input.value = '';
});

changeNickNameForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const nickname = prompt("변경하실 닉네임을 입력하세요");

    socket.emit("nickname", nickname, () => {
        console.log("닉네임이 변경되었습니다.");
    });
});

socket.on("welcome", (nick, roomInfo) => { // 자기 자신이 발생시킨 welcome에 대해서는 반응 X
    makeMessage(`${nick} 이 입장하였습니다.`);
    roomCount(roomInfo);
});

socket.on("bye", (nick, roomInfo) => {
    makeMessage(`${nick} 이 퇴장하였습니다.`);
    roomCount(roomInfo);
});

socket.on("new_message", (nickName, msg) => {
    console.log(nickName);
    makeMessage(`${nickName}: ${msg}`);
});

socket.on("room_change", (rooms) => {
    const ul = room.querySelector("ul:last-child");
    ul.innerHTML = "";
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        ul.append(li);
    });
}); // (msg) => console.log(msg)와 같음


/*const socket = new WebSocket(`ws://${window.location.host}`);
const messageList = document.querySelector("ul");
const formNick = document.querySelector("#nick");
const formMessage = document.querySelector("#message");
const formNickChange = document.querySelector("#change");
let nickName = 'anonymous';

socket.addEventListener("open", () => {
    console.log("Connected to Server ❗️");
});

socket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    const nick = formNick.querySelector("input");
    console.log(message);
    console.log(nick.value);
    const msg = JSON.parse(message.data);
    console.log(msg.nick);
    if(msg.nick !== nickName) {
        li.innerText = `${msg.nick}: ${msg.data}`;
        messageList.append(li);
    }
    //console.log("New Message: ", message.data);
});

socket.addEventListener("close", () => {
    console.log("Disconnected");
});

function makeMessage(type, message) {
    const msg = {
        type: type,
        data: message,
    };
    return JSON.stringify(msg);
}

formMessage.addEventListener("submit", (event) => {
    event.preventDefault(); // 새로고침 하는 기본 동작을 막아준다.
    //console.log(event);
    const message = formMessage.querySelector("input");
    socket.send(makeMessage('message', message.value));
    const li = document.createElement("li");
    li.innerText = `You: ${message.value}`;
    messageList.append(li);
    message.value = "";
});


formNick.addEventListener("submit", (event) => {
    event.preventDefault();
    formNick.style.display = "none";
    const nick = formNick.querySelector("input");
    socket.send(makeMessage('nickname', nick.value));
    nickName = nick.value;
    nick.value = "";
});

formNickChange.addEventListener("submit", (event) => {
    event.preventDefault();
    const nick = formNickChange.querySelector("input");
    socket.send(makeMessage('nickname', nick.value));
    nickName = nick.value;
    nick.value = "";
})
*/

