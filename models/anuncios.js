const mongoose = require('mongoose');

let anuncioSchema = new mongoose.Schema({

    anuncioName: { type: String, required: true },
    desciption: { type: String, required: true },
    creatorName: { type: String, required: true },
    date: { type: Date, required: true },


}, { versionKey: false })
// Schema
let Anuncio = new mongoose.model('Anuncios', anuncioSchema);

module.exports = Anuncio;

