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
    path: {
        type: String,
        required: true,
    }
});
module.exports = mongoose.model("Product_images", postSchema, 'product_images', false);
