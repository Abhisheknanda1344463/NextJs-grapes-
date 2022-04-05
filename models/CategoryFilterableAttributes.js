const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
    category_id: {
        type: Number,
        required: true,
    },
    attribute_id: {
        type: String,
        required: true,
    }
});
module.exports = mongoose.model("Category_filterable_attributes", postSchema, 'category_filterable_attributes', false);
