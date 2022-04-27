const mongoose = require('mongoose')
const Schema = mongoose.Schema
const postSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: {
    type: Number,
    required: true,
  },
  product_bundle_option_id: {
    type: Number,
    required: true,
  },
  product_id: {
    type: String,
    required: true,
  },
  qty: {
    type: String,
    required: true,
  },
  sort_order: {
    type: String,
    required: true,
  },
  is_default: {
    type: Number,
    required: true,
  },
})
module.exports = mongoose.model('Bundle_products', postSchema, 'product_bundle_option_products', false)

