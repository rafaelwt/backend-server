var express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');
var app = express();
var Usuario = require('../models/usuario');

var SEED = require('../config/config').SEED;

// ===============================================
// Obtener Usuarios
// ===============================================
app.get('/', (req, res, next) => {

    Usuario.find({},'nombre ,email, img role')
    .exec(
        (err, usuarios)=> {
            if(err) {
                res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuario',
                    errors: err
               });
            }
            res.status(200).json({
                ok: true,
                usuarios
           });
        });
});
// ===============================================
// Verificar token
// ===============================================
// Middleware prohibi la ejecucion de lo metodos debajo de el
// app.use('/', (req, res, next)=> {
//     var token = req.query.token;
//     jwt.verify(token, SEED, (err, decoded)=>{
//         if(err) {
//             return res.status(401).json({
//                 ok: false,
//                 mensaje: 'token incorrecto',
//                 errors: err
//            });
//         }
//         next();   // si cumple el if le dice que puede continuar con las funciones de abajo
//     });
// });

// ===============================================
// Actualizar Usuario
// ===============================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }


        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });

});



// ===============================================
// Crear usuario
// ===============================================
app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password:  bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    })

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al actualizar usuario',
                errors: err
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioGuardado
        });

    });

});

// ============================================
//   Borrar un usuario por el id
// ============================================
app.delete('/:id', mdAutenticacion.verificaToken , (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese id',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});

module.exports = app;
