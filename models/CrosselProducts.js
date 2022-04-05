const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CorsselProducts = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    parent_id: {
        type: Number,
        required: true,
    },
    child_id: {
        type: Number,
        required: true,
    },
});
module.exports = mongoose.model("Product_cross_sells", CorsselProducts, 'product_cross_sells', false);
