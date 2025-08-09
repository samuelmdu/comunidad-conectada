const mongoose = require('mongoose');

let eventoSchema = new mongoose.Schema({

    eventName: { type: String, required: true },
    creatorName: { type: String, required: true },
    description: { type: String, required: true },
    phone: { type: Number, required: true },
    date: { type: String, required: true },
    direction: { type: String, required: true },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }


}, { versionKey: false })
// Schema
let Evento = new mongoose.model('Eventos', eventoSchema);

module.exports = Evento;

