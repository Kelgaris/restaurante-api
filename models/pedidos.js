const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    usuario: { type: String, required: true},
    productos: { type: [String], required: true }
});

module.exports = mongoose.model('Pedidos', UserSchema, 'pedidos');