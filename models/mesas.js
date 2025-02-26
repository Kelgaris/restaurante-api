const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    usuario: { type: String, required: true},
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    telefono: { type: String, required: true },
    cantidadPersonas: { type: String, required: true },
    fecha: { type: String, required: true },
    hora: { type: String, required: true }
});

module.exports = mongoose.model('Mesas', UserSchema, 'mesas');