const express = require("express"); // Фреймворд node.js для зручного написання API
const mongoose = require("mongoose"); // ODM-бібліотека (Object Data Modelling) для работи з MongoDB (база даних)
const TelegramBot = require("node-telegram-bot-api"); // Библіотека для работи з телеграм ботом
const _ = require("lodash"); // Бібліотека JavaScript, яка представляє допоміжні функции
const bodyParser = require("body-parser");

const app = express(); // Ініціалізація нашого додатка

const Message = require("./models/Message"); // Модель
const Chat = require("./models/Chat");

const chats = require("./routes/chats");
// const messages = require("./routes/messages");

const token = "1063420601:AAGGQTvmvObXcNJB35pmttcwkV67kl9i-m0"; // Токен телеграм бота

const bot = new TelegramBot(token, { polling: true }); // Створення боту

// Підключення до бази даних
mongoose.connect(
  "mongodb+srv://root:root@cluster0-ff1ig.mongodb.net/chat-for-site-bot",
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

// Запроси

app.use(bodyParser.json());

app.use("/chats", chats);

app.post("/messages", async (req, res) => {
  const message = {
    chatId: req.body.chatId,
    from: {
      isBot: true,
      username: "ChatForSiteBot",
      botName: "Telegram Chat Bot",
    },
    text: req.body.text,
    date: new Date().getTime() / 1000,
  };

  const newMessage = new Message(message);

  newMessage.save((err, newMessage) => {
    if (err) return console.error(err);
    bot.sendMessage(newMessage.chatId, newMessage.text);
    res.status(200).json({ message: "message sended" });
  });
});

app.listen(3000);

db.once("open", () => {
  bot.on("message", async (msg) => {
    const formatedMessage = objectKeysToCamelCase(msg);
    formatedMessage.chatId = msg.chat.id;
    formatedMessage.id = msg.message_id;

    // Провіряємо чи є чат в бд і якщо його немає то ми його записуємо
    const isChatInDb = await Chat.exists({ id: formatedMessage.chat.id });

    if (!isChatInDb) {
      const newChat = new Chat(formatedMessage.chat);

      newChat.save((err) => {
        if (err) return console.error(err);
      });
    }

    // Зберігаємо в бд повідомлення
    const newMessage = new Message(formatedMessage);

    newMessage.save((err) => {
      if (err) return console.error(err);
    });
  });
});

// Функція для форматування ключів об'єктів з snake_сase в сamelCase найменування

function objectKeysToCamelCase(snake_case_object) {
  var camelCaseObject = {};
  _.forEach(snake_case_object, function (value, key) {
    if (_.isPlainObject(value) || _.isArray(value)) {
      value = objectKeysToCamelCase(value);
    }
    camelCaseObject[_.camelCase(key)] = value;
  });
  return camelCaseObject;
}
