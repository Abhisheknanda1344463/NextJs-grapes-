const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UpSellProducts = new Schema({
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
module.exports = mongoose.model("Product_up_sells", UpSellProducts, 'product_up_sells', false);
