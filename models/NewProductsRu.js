const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
    data: {
        type: Object,
        required: true,
    }
});
module.exports = mongoose.model("New_products_ru", postSchema, 'new_products_ru', false);
