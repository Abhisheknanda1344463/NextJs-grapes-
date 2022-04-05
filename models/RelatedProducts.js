const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
    data: {
        type: Object,
        required: true,
    },
    links: {
        type: Object,
        required: true,
    },
    meta: {
        type: Number,
        required: true,
    },
});
module.exports = mongoose.model("Related-products", postSchema);
