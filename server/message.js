// this contains schemas to handle the project
const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema ({
    content: String,
    name: String,
}, {
    timestamps: true,
});
modules.exports = mongoose.model('Message', messageSchema);