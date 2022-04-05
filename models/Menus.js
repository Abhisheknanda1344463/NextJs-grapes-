const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MenusSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    position: {
        type: Number,
        required: true,
    },
    parent_id: {
        type: Number,
        required: true,
    },
    _lft: {
        type: Number,
        required: true,
    },
    _rgt: {
        type: Number,
        required: true,
    },
    page_id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },

    url_key: {
        type: String,
        required: true,
    },

    status: {
        type: Number,
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

}, { strict: false });
module.exports = mongoose.model("Menus", MenusSchema, 'menus', false);
