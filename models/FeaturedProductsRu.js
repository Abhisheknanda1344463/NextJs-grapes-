const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
    data: {
        type: Object,
        required: true,
    }
});
module.exports = mongoose.model("Featured_products_ru", postSchema, 'featured_products_ru', false);
