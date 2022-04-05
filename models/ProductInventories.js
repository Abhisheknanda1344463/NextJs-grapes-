const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
    id: mongoose.Schema.Types.ObjectId,
    id: {
        type: Number,
        required: true,
    },
    product_id: {
        type: Number,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    vendor_id: {
        type: Number,
        required: true,
    },
    inventory_source_id: {
        type: Number,
        required: true,
    },
});
module.exports = mongoose.model("Product_inventories", postSchema, 'product_inventories', false);
