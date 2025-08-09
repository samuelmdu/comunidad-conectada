const mongoose = require('mongoose');

let reporteSchema = new mongoose.Schema({

    reporte: { type: String, required: true },
    tipo: { type: String, required: true },
    descripcion: { type: String, required: true },
    notificado: { type: String, required: true },
    nombre: { type: String },
    correo: { type: String, required: true },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }


}, { versionKey: false })
// Schema
let Reporte = new mongoose.model('Reportes', reporteSchema);

module.exports = Reporte;

