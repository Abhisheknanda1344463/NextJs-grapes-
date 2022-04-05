const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product_id: {
        type: Number,
        required: true,
    },
    RAM: {
        type: Object,
    },
    Memory: {
        type: Object,
    },
});
module.exports = mongoose.model("Product_super_attributes", postSchema, 'product_super_attributes', false);