const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    usuario: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, default: 'usuario' }
});

module.exports = mongoose.model('User', UserSchema, 'usuarios');
