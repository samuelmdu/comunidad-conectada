const mongoose = require('mongoose');

const emprendimientoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    categoria: { type: String, required: true },
    emprendedor: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: { type: String, required: true },
    ubicacion: { type: String, required: true },
    redSocial: { type: String },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }

}, { versionKey: false });

// Schema

let Emprendimiento = new mongoose.model('Emprendimientos', emprendimientoSchema);

module.exports = Emprendimiento;