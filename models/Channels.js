const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ChannelsSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  timezone: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    required: true,
  },
  hostname: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  favicon: {
    type: String,
    required: true,
  },
  is_maintenance_on: {
    type: Number,
    required: true,
  },
  url_full_mode: {
    type: Number,
    required: true,
  },
  allowed_ips: {
    type: String,
    required: true,
  },
  default_locale_id: {
    type: Number,
    required: true,
  },
  base_currency_id: {
    type: Number,
    required: true,
  },
  created_at: {
    type: String,
    required: true,
  },
  updated_at: {
    type: String,
    required: true,
  },
  root_category_id: {
    type: Number,
    required: true,
  },
  share_pic: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  home_page_content: {
    type: String,
    required: true,
  },
  footer_content: {
    type: String,
    required: true,
  },
  maintenance_mode_text: {
    type: String,
    required: true,
  },
  home_seo: {
    type: String,
    required: true,
  },
  translations: {
    type: Array,
    required: true,
  },

});
module.exports = mongoose.model("Channels", ChannelsSchema, 'channels', false);
