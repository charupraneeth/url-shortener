const mongoose = require("mongoose");
require("dotenv").config();
const mongoDB = process.env.DB_URL;

mongoose.connect(
  mongoDB,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("db connected")
);

const Schema = mongoose.Schema;

const URLSchema = new Schema({
  created: {
    type: Date,
    default: Date.now(),
  },
  url: {
    type: String,
  },
  slug: {
    type: String,
  },
});

URLSchema.indexes({ created: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 2 });
const URL = mongoose.model("URLCollection", URLSchema);

module.exports = URL;
