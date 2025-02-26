const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Pedidos = require('../models/pedidos');
const Mesas = require('../models/mesas');

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

        res.json({ msg: 'Inicio de sesión exitoso', token, usuario: user.usuario, rol: user.rol });

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

// Ruta para registrar un nuevo pedido
router.post('/nuevoPedido', async (req, res) => {
    const { usuario, productos } = req.body;

    try {
        if (!usuario || !productos || !Array.isArray(productos) || productos.length === 0) {
            return res.status(400).json({ msg: 'Datos inválidos. Asegúrate de enviar un usuario y un array de productos.' });
        }

        const nuevoPedido = new Pedidos({ usuario, productos });
        await nuevoPedido.save();

        res.json({ msg: 'Pedido registrado correctamente', pedido: nuevoPedido });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});

// Ruta para obtener todos los pedidos
router.get('/pedidos', async (req, res) => {
    try {
        const pedidos = await Pedidos.find();
        res.json(pedidos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});


// Ruta para registrar un nueva mesa
router.post('/nuevaMesa', async (req, res) => {
    const { usuario, nombre, apellidos, telefono, cantidadPersonas, fecha, hora } = req.body;

    try {
        if (!usuario || !nombre || !apellidos || !telefono || !cantidadPersonas || !fecha || !hora){
            return res.status(400).json({ msg: 'Datos inválidos.' });
        }

        const nuevaMesa = new Mesas({ usuario, nombre, apellidos, telefono, cantidadPersonas, fecha, hora});
        await nuevaMesa.save();

        res.json({ msg: 'Mesa registrada correctamente', mesa: nuevaMesa });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});


// Ruta para obtener todos los pedidos
router.get('/mesas', async (req, res) => {
    try {
        const mesas = await Mesas.find();
        res.json(mesas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});


module.exports = router;
