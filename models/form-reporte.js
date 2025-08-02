const mongoose = require('mongoose');

let reporteSchema = new mongoose.Schema({

    reporteName: { type: String, required: true },
    creatorName: { type: String},
    desciption: { type: String, required: true },
    reporteType: { type: String, required: true },
    notifiers: { type: String, required: true },
    email: { type: String},

}, { versionKey: false })
// Schema
let Reporte = new mongoose.model('Reporte', reporteSchema);

module.exports = Reporte;