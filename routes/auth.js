const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const { usuario, password } = req.body;

    try {
        // Verificar si el usuario existe
        const user = await User.findOne({ usuario });
        if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

        // Verificar contraseña sin cifrado (NO seguro para producción)
        if (password !== user.password) {
            return res.status(400).json({ msg: 'Contraseña incorrecta' });
        }
                
        // Generar el JWT
        const payload = { usuario: user.usuario, rol: user.rol }; // Aquí puedes incluir más datos si lo deseas
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // El token expira en 1 hora

        res.json({ msg: 'Inicio de sesión exitoso', token, rol: user.rol });

    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});

// Ruta para registrar usuario
router.post('/register', async (req, res) => {
    const { usuario, password, rol } = req.body;

    try {
        // Verificar si el usuario ya existe
        let user = await User.findOne({ usuario });
        if (user) return res.status(400).json({ msg: 'Usuario ya registrado' });

        user = new User({ usuario, password, rol });
        await user.save();

        res.json({ msg: 'Usuario registrado correctamente' });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});

module.exports = router;
