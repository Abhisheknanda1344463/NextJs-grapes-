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
    price: {
        type: String,
        required: true,
    },
    product: {
        type: Object,
        required: true,
    },
    locale: {
        type: String,
        required: true,
    },
    url_key: {
        type: String,
        required: true,
    },
    special_price_from: {
        type: Number,
        required: true,
    },
    special_price_to: {
        type: Number,
        required: true,
    },
    new: {
        type: Number,
        required: true,
    },
    featured: {
        type: Number,
        required: true,
    },
    min_price: {
        type: String,
        required: true,
    }
}, { strict: false });
module.exports = mongoose.model("Product_flat", postSchema, 'product_flat', false);
