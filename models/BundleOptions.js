const mongoose = require('mongoose')
const Schema = mongoose.Schema
const postSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  product_id: {
    type: Number,
    required: true,
  },
  is_required: {
    type: String,
    required: true,
  },
  sort_order: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  translations: {
    type: Array,
    required: true,
  },
})
module.exports = mongoose.model('Bundle_options', postSchema, 'product_bundle_options', false)
