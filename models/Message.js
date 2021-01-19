const { Schema, model } = require("mongoose");

const schema = new Schema({
  id: { type: Number },
  chatId: { type: Number },
  from: {
    id: { type: Number },
    isBot: { type: Boolean },
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    languageCode: { type: String },
    botName: { type: String },
  },
  date: { type: Number },
  text: { type: String },
});

module.exports = model("Message", schema);
