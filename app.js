// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
// Inicializar Variables
var app = express();

// Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// importar rutas;
// parse application/x-www-form-urlencoded
var appRoutes = require('./routes/app');
var usuarioRoutes =  require('./routes/usuario');
var loginRoutes = require('./routes/login');

// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err, res)=> {
    if(err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});


// Rutas // middleware para que apunte al archivo routes
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Escuchar Peticiones
app.listen(3000, ()=> {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});