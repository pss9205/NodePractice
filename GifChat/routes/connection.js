const express = require("express");
const path = require("path");
const fs = require("fs");
const Room = require("../schemas/room");
const Chat = require("../schemas/chat");

async function connect(socket, roomId) {
  try {
    currentRoom = socket.adapter.rooms.get(roomId);
    userCount = currentRoom ? currentRoom.size : 0;
    const chat = await Chat.create({
      room: roomId,
      user: "system",
      chat: `${socket.handshake.session.color} enter the room.`,
    });
    r;
  } catch (error) {
    console.error(error);
    next(error);
  }
}
async function disconnect(socket, roomnsp, roomId) {
  try {
    currentRoom = socket.adapter.rooms.get(roomId);
    userCount = currentRoom ? currentRoom.size : 0;
    const chat = await Chat.create({
      room: roomId,
      user: "system",
      chat: `${socket.handshake.session.color} left the room.`,
    });
    if (userCount === 0) {
      //same with delete
      await Room.remove({ _id: roomId });
      await Chat.remove({ room: roomId });
      setTimeout(() => {
        roomnsp.emit("removeRoom", roomId);
      }, 2000);
    } else {
      const room = await Room.findOne({ _id: roomId });
      if (room.owner === socket.handshake.session.color) {
        await room.updateOne({}, { $set: { owner: currentRoom.get(0) } });
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
}

module.exports = {
  connect,
  disconnect,
};
