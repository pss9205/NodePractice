const SocketIO = require("socket.io");
const axios = require("axios");
const sharedsession = require("express-socket.io-session");
module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: "/socket.io" });
  app.set("io", io);
  const room = io.of("/room");
  const chat = io.of("/chat");
  //socket.io 버전 변경으로 인해 안되는 부분
  //express-socket.io-session 패키지로 session 사용 가능
  //io.use가 아닌 각 네임스페이스의 use로 해야함
  room.use(sharedsession(sessionMiddleware));
  chat.use(sharedsession(sessionMiddleware));
  room.on("connection", (socket) => {
    console.log("connection namespace:room");
    socket.on("disconnect", () => {
      console.log("disconnection namespace:room");
    });
  });

  chat.on("connection", (socket) => {
    console.log("connection namespace:chat");
    const req = socket.request;
    const {
      headers: { referer },
    } = req;
    referes = referer.split("/");
    const roomId = referes[referes.length - 1].replace(/\?.+/, "");
    socket.join(roomId);
    axios
      .post(`http://localhost:8005/room/connect/${roomId}`)
      .then(() => {
        console.log(`user entered to {roomId}`);
      })
      .catch((error) => {
        console.error(error);
      });
    socket.on("disconnect", () => {
      console.log("disconnection namespace:chat");
      socket.leave(roomId);
      axios
        .post(`http://localhost:8005/room/disconnect/${roomId}`)
        .then(() => {
          console.log(`user left {roomId}`);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  });

  io.on("connection", (socket) => {
    const req = socket.request;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log("new client", ip);
    socket.on("disconnect", () => {
      console.log("cliet off", ip);
      clearInterval(socket.interval);
    });

    socket.on("error", (error) => {
      console.error(error);
    });

    socket.on("reply", (data) => {
      console.log(data);
    });
    socket.interval = setInterval(() => {
      socket.emit("news", "hello socket.io");
    }, 3000);
  });
};
