const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: {
        type: Number,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
});
module.exports = mongoose.model("Core_config", postSchema, 'core_config', false);
