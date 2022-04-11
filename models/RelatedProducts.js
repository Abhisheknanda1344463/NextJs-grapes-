const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
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
    parent_id:{
        type: Number,
        required: true,
    } ,
    child_id:{
        type: Number,
        required: true,
    } ,
}, { strict: false });
module.exports = mongoose.model("Related-products", postSchema, "products_relations", false);
