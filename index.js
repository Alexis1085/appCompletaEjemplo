const express = require('express');
const app = express();

const mysql = require('mysql2');
const hbs = require('hbs'); //* Motor de Plantilla
const path = require('path'); //* Enrutador para encontrar archivos
const nodemailer = require('nodemailer'); //* Para enviar mails
require('dotenv').config(); //? Variables de Entorno. La librería dotenv no es necesaria traerla a una variable, sólo aplicamos la configuración --> "Loads .env file contents into process.env"

/* Formato de las variables de entorno:
SERVER_PORT=
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=

*/

const port = process.env.SERVER_PORT || 9000;
console.log(`Puerto del servidor: ${port}`);

//* Middlewares:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//? Configuramos el Frontend: Motor de Plantillas de HBS
app.set('view engine', 'hbs');
// Configuramos la ubicación de las plantillas
app.set('views', path.join(__dirname, 'views'));
// Configuramos los parciales de los motores de plantillas
hbs.registerPartials(path.join(__dirname, 'views/partials'))

//* Conexión a la Base de Datos
const conexion = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
conexion.connect(err => {
    if (err) throw err;
    console.log(`Conectado a la Base de Datos: ${process.env.DB_NAME}`);
});


//* Rutas de la aplicación
app.get('/',(req,res) => {
    res.render('home');
});

app.get('/formulario', (req,res) => {
    res.render('formulario', {
        titulo: 'Formulario'
    });
});

app.get('/productos', (req,res) => {
    res.render('productos', {
        titulo: 'Productos'
    });
});

app.get('/contacto', (req,res) => {
    res.render('contacto', {
        titulo: 'Contacto'
    });
});



//* Servidor a la escucha de las peticiones
app.listen(port, () => {
    console.log(`Servidor conectado al puerto ${port}`);
});
