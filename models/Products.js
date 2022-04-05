const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: {
        type: Number,
        required: true,
    },
    product_id: {
        type: Number,
        required: true,
    },
    parent_id: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    }
}, { strict: false });
module.exports = mongoose.model("Products", postSchema, 'products', false);
