
const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost:27017/Login'

mongoose.connect(DB_URI, {})
    .then(console.log('DB Conectada'))
    .catch(e => console.log(e));

// MODELO 

let userSchema = new mongoose.Schema({
    cedula: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },
    passwordConfirmation: { type: String, required: true }

}, { versionKey: false })
// Schema
let User = new mongoose.model('Users', userSchema);

module.exports = User;