const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product_id: {
        type: Number,
        required: true,
    },
    category_id: {
        type: Number,
        required: true,
    }
}, { strict: false });
module.exports = mongoose.model("Products_categories", postSchema, 'products_categories', false);
