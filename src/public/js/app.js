const socket = io();
const video = document.querySelector("#camera");
const mute = document.getElementById("mute");
const camera = document.getElementById("turn");
const camerasSelect = document.getElementById("cameras");
const videoForm = document.getElementById("video");
const welcomeForm = document.getElementById('welcome');

videoForm.hidden = true; // 처음에 감춰둔다.
let roomName = '';
let myStream;
let muteCheck = true; // 현재 마이크 켜져있음
let cameraCheck = true; // 카메라 켜져있음
let myPeerConnection;
let myDataChannel;

async function getDevices() {
    try {
        // const devices = await navigator.mediaDevices.enumerateDevices();
        // const cameras = devices.filter((device) => device.kind === "videoinput");
        // console.log(cameras);
        const device = await navigator.mediaDevices.enumerateDevices();
        console.log(device);
        const videoDevice = device.filter((cameras) => cameras.kind === 'videoinput');
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

camerasSelect.addEventListener("input", async () => {
    await getMedia(camerasSelect.value);
    if(myPeerConnection) {
        const videoTrack = myStream.getVideoTracks()[0];
        const videoSender = myPeerConnection
        .getSenders()
        .find(sender => sender.track.kind === "video");
        videoSender.replaceTrack(videoTrack);
    }
});


///////////// welcome ///////////////////
async function initCall() {
    videoForm.hidden = false;
    welcomeForm.hidden = true;
    await getMedia();
    makeConnection();
};

welcomeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = welcomeForm.querySelector('input');
    roomName = input.value;
    await initCall();
    socket.emit("join_room", roomName, () => {
        console.log('someone.joined');
    });
});



///// socket /////////
socket.on('welcome', async () => {
    console.log(`${roomName} 에 참가자가 생겼습니다.`);
    myDataChannel = myPeerConnection.createDataChannel('chat');
    myDataChannel.addEventListener('message', (event) => console.log(event.data));
    const offer = await myPeerConnection.createOffer(); // 예를들어 firefox에서 접속했을 때 offer를 생성.
    console.log('sent the offer');
    myPeerConnection.setLocalDescription(offer);
    socket.emit("offer", offer, roomName);
});

socket.on("offer", async (offer) => {
    console.log('received the offer');
    myPeerConnection.setRemoteDescription(offer); // 받는쪽에서 Remote 설정
    myPeerConnection.ondatachannel = (event) => {
        myDataChannel = event.channel;
        myDataChannel.addEventListener('message', (event) => console.log(event.data));
    }
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer); // 받는쪽 local 설정
    socket.emit("answer", answer, roomName);
    console.log('sent the answer');
});

socket.on('answer', (answer) => {
    console.log('received the  answer');
    myPeerConnection.setRemoteDescription(answer); // 보낸쪽 remote 설정
});

socket.on('ice', (candidate) => {
    console.log('received candidate');
    myPeerConnection.addIceCandidate(candidate);
});
// RTC Code

function makeConnection() {
    myPeerConnection = new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.con:19302",
                    "stun:stun1.l.google.con:19302",
                    "stun:stun2.l.google.con:19302",
                ],
            },
        ],
    });

    myPeerConnection.addEventListener('icecandidate', (data) => {
        console.log('sent Candidate');
        socket.emit('ice', data.candidate, roomName);
    });

    myPeerConnection.addEventListener('track', (data) => { // candidate가 add 되었을 때
        const faceVideo = document.getElementById('faceVideo');
        faceVideo.srcObject = data.stream;
    });
    myStream.getTracks().forEach(track => myPeerConnection.addTrack(track, myStream));

}

