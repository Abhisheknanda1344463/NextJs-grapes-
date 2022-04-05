const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
});
module.exports = mongoose.model("Social", postSchema, 'social', false);
