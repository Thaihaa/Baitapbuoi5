const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    isDeleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Category', categorySchema);
