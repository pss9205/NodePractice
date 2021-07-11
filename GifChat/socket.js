const SocketIO = require("socket.io");

module.exports = (server, app) => {
  const io = SocketIO(server, { path: "/socket.io" });
  app.set("io", io);
  const room = io.of("/room");
  const chat = io.of("/chat");

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

    socket.on("disconnect", () => {
      console.log("disconnection namespace:chat");
      socket.leave(roomId);
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
