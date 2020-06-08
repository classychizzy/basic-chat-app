// this contains schemas to handle the project
const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema ({
    content: String,
    name: String,
}, {
    timestamps: true,
});
 const emailSchema = new mongoose.Schema({
  email: String   
 })
module.exports = mongoose.model('Message', messageSchema);