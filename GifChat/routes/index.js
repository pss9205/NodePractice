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

router.post("/room/:id/chat", async (req, res, next) => {
  try {
    const chat = await Chat.create({
      room: req.params.id,
      user: req.session.color,
      chat: req.body.chat,
    });
    req.app.get("io").of("/chat").to(req.params.id).emit("chat", chat);
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
