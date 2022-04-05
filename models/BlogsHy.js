const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    page_id: {
        type: String,
        required: true,
    },
    locale: {
        type: String,
        required: true,
    },
    url_key: {
        type: String,
        required: true,
    },
});
module.exports = mongoose.model("Blogs_hy", postSchema, 'blogs_hy', false);
