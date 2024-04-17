const mongoose = require("mongoose");

const index = {
  isFree: Boolean,
  date: String,
  user: String,
};

const turnSchema = mongoose.Schema([index]);

module.exports = mongoose.model("turn", turnSchema);
