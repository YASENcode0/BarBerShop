const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: Number,
  id: String,
});

module.exports = mongoose.model("user", userSchema);
