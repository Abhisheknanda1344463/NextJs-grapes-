const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
    data: {
        type: Object,
        required: true,
    }
});
module.exports = mongoose.model("Categories_hy", postSchema, 'categories_hy', false);
