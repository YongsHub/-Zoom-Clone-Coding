const socket = new WebSocket(`ws://${window.location.host}`);
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


