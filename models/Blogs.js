const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BlogsSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    meta_description: {
        type: String,
        required: true,
    },
    meta_title: {
        type: String,
        required: true,
    },
    blog_title: {
        type: String,
        required: true,
    },
    meta_keywords: {
        type: String,
        required: true,
    },
    html_content: {
        type: String,
        required: true,
    },
    top: {
        type: String,
        required: true,
    },
    url_key: {
        type: String,
        required: true,
    },

    translations: {
        type: Array,
        required: true,
    },
    layout: {
        type: String,
        required: false,
    },

});
module.exports = mongoose.model("Blogs", BlogsSchema, 'blogs', false);
