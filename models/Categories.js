const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    position: {
      type: Number,
      required: false,
    },

    image: {
      type: String,
      required: false,
    },
    status: {
      type: Number,
      required: false,
    },

    _lft: {
      type: Number,
      required: false,
    },
    _rgt: {
      type: Number,
      required: false,
    },
    parent_id: {
      type: Number,
      required: false,
    },
    created_at: {
      type: String,
      required: false,
    },

    updated_at: {
      type: String,
      required: false,
    },
    display_mode: {
      type: String,
      required: false,
    },
    category_icon_path: {
      type: String,
      required: false,
    },
    additional: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: false,
    },
    url_path: {
      type: String,
      required: false,
    },
    meta_title: {
      type: String,
      required: false,
    },
    meta_description: {
      type: String,
      required: false,
    },
    meta_keywords: {
      type: String,
      required: false,
    },
    translations: {
      type: Array,
      required: true,
    },
  },
  { strict: false }
);
module.exports = mongoose.model("Categories", postSchema, "categories", false);
