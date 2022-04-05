const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: {
        type: Number,
        required: true,
    },
    sub_domain: {
        type: String,
        required: true,
    },
    main_domain: {
        type: String,
        required: true,
    },
    db_name: {
        type: String,
        required: true,
    },
});
module.exports = mongoose.model("Globals", postSchema, 'globals', false);
