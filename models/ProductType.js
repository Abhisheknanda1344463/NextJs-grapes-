const mongoose = require('mongoose')
const Schema = mongoose.Schema
const postSchema = new Schema({
  _id                : mongoose.Schema.Types.ObjectId,
  id                 : {
    type    : Number,
    required: true,
  },
  sku                : {
    type    : String,
    required: true,
  },
  type               : {
    type    : String,
    required: true,
  },
  parent_id          : {
    type    : String,
    required: true,
  },
  attribute_family_id: {
    type    : Number,
    required: true,
  },
})
module.exports = mongoose.model('Products', postSchema, 'products', false)