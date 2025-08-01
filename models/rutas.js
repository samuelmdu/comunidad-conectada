const mongoose = require('mongoose');

let rutasSchema = new mongoose.Schema({
    rutaNombre: { type: String, required: true, unique: true},
    rutaHorario: { type: String, required: true },
    rutaFrecuencia: { type: Number, required: true },
    rutaPrecio: { type: Number, required: true }

}, { versionKey: false })
// Schema
let Rutas = new mongoose.model('Rutas', rutasSchema);

module.exports = Rutas;