const { Schema, model } = require("mongoose");

const chatSchema = new Schema({
  id: { type: Number },
  firstName: { type: String },
  lastName: { type: String },
  username: { type: String },
  type: { type: String },
  title: { type: String },
  allMembersAreAdministrators: { type: Boolean },
  messages: { type: Array },
});

chatSchema.method("transform", function () {
  const obj = this.toObject();

  delete obj._v;
  delete obj._id;

  return obj;
});

module.exports = model("Chat", chatSchema);
