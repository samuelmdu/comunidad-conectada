const mongoose = require('mongoose');

let emprendimientoSchema = new mongoose.Schema({

    emprendimientoName: { type: String, required: true },
    creatorName: { type: String, required: true },
    desciption: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    direction: { type: String, required: true },
    category: { type: String, required: true },
    other: { type: String}

}, { versionKey: false })
// Schema
let Emprendimiento = new mongoose.model('Emprendimiento', emprendimientoSchema);

module.exports = Emprendimiento;