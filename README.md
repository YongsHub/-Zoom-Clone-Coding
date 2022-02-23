# Zoom-Clone-Coding

[노마드 코더 클론 코딩](https://nomadcoders.co)

### Zoom Clone using WebRTC and Websockets

## 📌 하드웨어 요구 사항

- Mac OS or Window

## 👨‍💻 백엔드에서 사용할 필요한 지식

- ExpressJS
- app.get()
- Pug
- (req, res) => {} 등등

## 👨‍💻 Vanilla JS에서 사용할 필요한 지식

- document.createElement()
- document.querySelector()
- title.innerText =''
- classList.add() 등등..

[Babel 참고 링크](https://xtring-dev.tistory.com/entry/Babel-%EB%AA%A8%EB%A5%B4%EA%B3%A0-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8D%98-Babel-%EC%9D%B4%EC%A0%A0-%EB%91%90%EB%A0%A4%EC%9B%8C-%EB%A7%88%EC%84%B8%EC%9A%94-Babel-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0)<br>
[babel/core, babel/cli 참고 링크](https://mwoo526.tistory.com/32)

> package.json에서 "dev"는 nodemon을 호출하여 nodemon은 nodemon.json의 exec만 실행합니다.

## 👨‍💻 MVP CSS

[MVP CSS](https://andybrewer.github.io/mvp/)

### views, 템플리트가 있는 디렉토리 예 app.set('views', \_\_dirname + '/views')

### 이 함수는 res.render() 함수에 의해 호출되어 템플리트 코드를 렌더링합니다.

## `__filename` 과 `__dirname`에 대해 알아보자

> `__filename`은 현재 실행중인 파일 경로를 의미하고, `__dirname` 은 현재 실행중인 폴더 경로를 의미합니다.

## babel 설정

- npm i @babel/core @babel/cli @babel/node @babel/preset-env -D

### 👨‍💻 WebSocket

> 한 번 연결되면 전화 통화와 같아서 양방향으로 메시지를 보낼 수 있다. Protocol로 브라우저에는 내장된 websocket API가 존재합니다. Request 와 Response가 따로 필요하지 않다.
> [참고 링크](https://developer.mozilla.org/ko/docs/Web/API/WebSocket/WebSocket) > [참고 링크](https://velog.io/@since-1994/Express.js-Pug)

### 👨‍💻 Socket IO

- Socket IO는 웹 소켓을 실행하는 것이 아니라 framework로써 실시간, 양방향, Event 기반 통신을 제공합니다.
- 따라서, websocket은 Socket IO가 실시간, 양방향, event 기반 통신을 제공하는 방법 중 하나라고 볼 수 있다.
- 만약, websocket 이용이 불가능하면, socket IO는 다른 방법을 이용해서 계속 작동한다고 볼 수 있다.
- Socket IO는 websocket을 사용하는데, 사용할 수 없다면 다른것을 사용하는데 HTTP long polling과 같은것을 이용한다. automatic reconnection과 같은 기능을 제공하는 특징도 가지고 있다.

> socket.emit()에서 event는 어떤 event를 작성하더라도 가능하다. 하지만 백 엔드에서 같은 event에 대해 on메서드를 통해 확인할 수 있다. 매개변수 또한 문자열이 아닌 오브젝트로도 보낼 수 있으며 여 러개를 보낼 수 있다.

### socketIO의 재미있는 특징📌

- Socket IO의 경우에는 마지막 argument가 있는데, 꼭 마지막 argument여야 한다는 것을 기억해야 한다!
- 만약, 끝날 때 실행되는 function을 보내고 싶으면 마지막에 넣어야 함.
- ! 이 function은 백 엔드에서 실행되는 것이 아니다!
- front에서 실행되는 것이다!, front에 있는 function을 back-end가 실행시켜준 것이다.

<br>

[그림 링크](https://developer.mozilla.org/ko/docs/Learn/JavaScript/Client-side_web_APIs) ![Socket IO 구성](/img/1.jpeg)

### 👨‍💻 Adapter에 대해 알아보자

<span style="color:yellow"> Adapter가 기본적으로 하는 일은 다른 서버들 사이에 실시간 어플리케이션을 동기화 하는 것이다.</span> 현재는 서버 내 in browser memory를 사용하고 있고, 서버에서 열어둔 하나의 connection에 모든 클라이언트들이 접속하고 있는 문제점들이 있다.

- 앱 안에 많은 클라이언트가 있을 때, 모든 클라이언트들에 대해 connection을 열어둬야 한다.
- 서버를 종료하고 다시 시작하면 대화 내용이 사라지는 문제점.

### 👨‍💻 Web RTC 대해 알아보자

- 실시간 커뮤니케이션을 가능하게 해주는 기술이다.
- P2P 형식으로 new RTCPeerConnection()를 생성하여 각 장치가 가지고 있는 스트림을 addTrack()을 이용하여 추가해 주는 방식이다. 이후 Offer를 생성하여
  setLocalDescription() 메서드를 이용하여 offer를 지정한다.
- 여기서 description은 peer를 나타내는 것이라고 생각하면 좋다.
  ![WEB RTC](https://miro.medium.com/max/1600/1*hQHzaT-JB1Wx3y0qtQX8Kw.png)

### 👨‍💻 ICE Candidate

- Internet Connectivity Establishment 인터넷 연결 생성을 의미하며 webRTC에 필요한 프로토콜입니다. 따라서 브라우저끼리 의사소통을 할 수 있도록 해준다.
