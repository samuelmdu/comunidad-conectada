const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    type: { type: String, enum: ['anuncio', 'evento', 'emprendimiento', 'reporte'], required: true },
    publicationId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    creatorName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    isEdit: { type: Boolean, default: false }, // Indica si es una edición
    originalId: { type: mongoose.Schema.Types.ObjectId }, // ID de la publicación original (para ediciones)
}, { versionKey: false });

module.exports = mongoose.model('Ticket', ticketSchema);