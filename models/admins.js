
const mongoose = require('mongoose');

let adminSchema = new mongoose.Schema({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },


}, { versionKey: false })
// Schema
let Admin = new mongoose.model('Admin', adminSchema);

module.exports = Admin;