const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema(
  {
    data: {
      data: Object,
      lang: String,
    },
  },
  { strict: false }
);
module.exports = mongoose.model(
  "Translations",
  postSchema,
  "translations",
  false
);
