const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Room = require("../schemas/room");
const Chat = require("../schemas/chat");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const rooms = await Room.find({});
    res.render("main", { rooms, title: "GIF Chat" });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/room", (req, res) => {
  res.render("room", { title: "Create Chat Room" });
});

router.post("/room", async (req, res, next) => {
  try {
    const newRoom = await Room.create({
      title: req.body.title,
      participants: req.body.participants,
      owner: req.session.color,
      password: req.body.password,
    });
    const io = req.app.get("io");
    io.of("/room").emit("newRoom", newRoom);
    res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch("/room/owner/:id", async (req, res, next) => {
  try {
    await Room.updateOne(
      { _id: req.params.id },
      { $set: { owner: req.body.owner } }
    );
    const room = await Room.findOne({ _id: req.params.id });
    setTimeout(() => {
      req.app.get("io").of("/room").emit("updateRoom", room);
    }, 2000);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/room/connect/:id", async (req, res, next) => {
  try {
    const socket = req.app.get("io").of("/chat");
    const roomId = req.params.id;
    currentRoom = socket.adapter.rooms.get(roomId);
    userCount = currentRoom ? currentRoom.size : 0;
    const chat = await Chat.create({
      room: roomId,
      user: "system",
      chat: `${req.session.color} enter the room.`,
    });
    socket.to(roomId).emit("join", {
      chat,
      participants: userCount,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/room/disconnect/:id", async (req, res, next) => {
  try {
    const socket = req.app.get("io").of("/chat");
    const roomId = req.params.id;
    currentRoom = socket.adapter.rooms.get(roomId);
    userCount = currentRoom ? currentRoom.size : 0;
    const chat = await Chat.create({
      room: roomId,
      user: "system",
      chat: `${req.session.color} left the room.`,
    });
    if (userCount === 0) {
      //same with delete
      await Room.remove({ _id: req.params.id });
      await Chat.remove({ room: req.params.id });
      res.send("ok");
      setTimeout(() => {
        req.app.get("io").of("room").emit("removeRoom", req.params.id);
      }, 2000);
    } else {
      const room = await Room.findOne({ _id: req.params.id });
      if (room.owner == req.session.color) {
        req.app
          .get("io")
          .of("/chat")
          .to(currentRoom.values().next().value)
          .emit("owner");
      }
      socket.to(roomId).emit("exit", {
        chat,
        participants: userCount,
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/room/:id", async (req, res, next) => {
  try {
    const room = await Room.findOne({ _id: req.params.id });
    const io = req.app.get("io");
    if (!room) {
      return res.redirect("/?error=room does not exist");
    }
    if (room.password && room.password !== req.query.password) {
      return res.redirect("/?error=wrong password");
    }
    const { rooms } = io.of("/chat").adapter;
    if (
      rooms &&
      rooms.get(req.params.id) &&
      room.max <= rooms.get(req.params.id).size
    ) {
      return res.redirect("/?error=room is full");
    }
    const chats = await Chat.find({ room: room._id }).sort("createdAt");
    return res.render("chat", {
      room,
      title: room.title,
      chats,
      participants: rooms.get(req.params.id)
        ? rooms.get(req.params.id).size + 1
        : 1,
      user: req.session.color,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/room/:id", async (req, res, next) => {
  try {
    await Room.remove({ _id: req.params.id });
    await Chat.remove({ room: req.params.id });
    res.send("ok");
    setTimeout(() => {
      req.app.get("io").of("room").emit("removeRoom", req.params.id);
    }, 2000);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
router.post("/room/:id/ban/:sender", async (req, res, next) => {
  try {
    const socket = req.app.get("io").of("/chat");
    socket.to(req.params.id).emit("ban", req.params.sender);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
router.post("/room/:id/chat", async (req, res, next) => {
  try {
    const socket = req.app.get("io").of("/chat");
    const chat = await Chat.create({
      room: req.params.id,
      user: req.session.color,
      chat: req.body.chat,
    });
    socket.to(req.params.id).emit("chat", chat);
    res.send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

try {
  fs.readdirSync("uploads");
} catch (err) {
  console.error("create uploads directory");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, "uploads/");
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/room/:id/gif", upload.single("gif"), async (req, res, next) => {
  try {
    const chat = await Chat.create({
      room: req.params.id,
      user: req.session.color,
      gif: req.file.filename,
    });
    req.app.get("io").of("/chat").to(req.params.id).emit("chat", chat);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
