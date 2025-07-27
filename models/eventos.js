const mongoose = require('mongoose');

let eventoSchema = new mongoose.Schema({

    eventName: { type: String, required: true },
    creatorName: { type: String, required: true },
    desciption: { type: String, required: true },
    phone: { type: Number, required: true },
    date: { type: Date, required: true },
    direction: { type: String, required: true },

}, { versionKey: false })
// Schema
let Evento = new mongoose.model('Eventos', eventoSchema);

module.exports = Evento;

