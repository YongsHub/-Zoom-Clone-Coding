# Zoom-Clone-Coding

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

### 👨‍💻 WebSocket
