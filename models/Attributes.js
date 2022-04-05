const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    translations: {
        type: Object,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },

});
module.exports = mongoose.model("Attributes", postSchema, 'attributes', false);
