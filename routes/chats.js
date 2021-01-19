const express = require("express");
const router = express.Router();

const Chat = require("../models/Chat");
const Message = require("../models/Message");

router.get("/", async (req, res) => {
  const chats = await Chat.find({});

  for (let i = 0; i < chats.length; i++) {
    chats[i].messages = await Message.find({ chatId: chats[i].id });
  }

  res.status(200).json(chats);
});

router.get("/:chatId", (req, res) => {
  const id = req.params.chatId;

  Chat.findOne({ id: id }, (error, chat) => {
    // console.log(error);
    if (error) {
      res.status(404).json({
        message: "chat not found",
      });
    }
    Message.find({ chatId: chat.id }).then((messages) => {
      chat.messages = messages;
      res.status(200).json(chat);
    });
  });
});

module.exports = router;
