const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
    product_id: {
        type: Number,
        required: true,
    },
    attribute_id: {
        type: Number,
        required: true,
    },
    integer_value: {
        type: String,
        required: true,
    },
}, { strict: false });
module.exports = mongoose.model("Product_attribute_values", postSchema, 'product_attribute_values', false);
