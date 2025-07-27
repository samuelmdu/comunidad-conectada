const mongoose = require('mongoose');

const DB_URI = 'mongodb://localhost:27017/Comunidad-Conectada';

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI, {})
        console.log('MongoDB conectado');
    } catch (err) {
        console.error('Error al conectar a MongoDB:', err.message);
    }
};

module.exports = connectDB;
