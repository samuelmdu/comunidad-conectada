
const mongoose = require('mongoose');

let userAdminSchema = new mongoose.Schema({
    cedula: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    passwordConfirmation: { type: String, required: true }

}, { versionKey: false })
// Schema
let UserAdmin = new mongoose.model('Users-admin', userAdminSchema);

module.exports = UserAdmin;