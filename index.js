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
EMAIL=
EMAIL_PASS=
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
//* GETs:
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


//* POSTs:
app.post('/formulario', (req,res) => {
    console.log(req.body);

    let nombre = req.body.nombre;
    let precio = req.body.precio;
    let descripcion = req.body.descripcion;

 /* conexion.query(`insert into productos values(null,"${nombre}",${precio},"${descripcion}"`, err => {
        if (err) throw err;
            console.log();
    }); */


    //TODO A este objeto no le veo el sentido práctico
    let datosProducto = {
        nombreProducto: nombre,
        precioProducto: precio,
        descripcionProducto: descripcion
    }

    conexion.query("INSERT INTO productos SET ?", datosProducto, err => {
        if (err) throw err;
            console.log(`1 Producto agregado a la base de datos: ${nombre} - ${precio} - ${descripcion}`);
            res.render('formulario', {
                titulo: 'Formulario'
            });
    });
});

app.post('/contacto', (req,res) => {
    let nombreContacto = req.body.nombre;
    let emailContacto = req.body.email;

    //? Función para enviar e-mail con nodemailer
    async function envioMail(){
        //* Configuración de la cuenta remitente:
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            },
            //tls: {rejectUnauthorized: true}
        });
        //* Configuración del Envío:
        let info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: `${emailContacto}`,
            subject: 'Gracias por suscribirte',
            html: `<body><h3 style="color: violet">Bienvenido a la App de la UTN ${nombreContacto}</h3><p>Gracias por suscribirte, próximamente te estaremos contactando con las novedades</p></body>`
        });
    };

    let datosContacto = {
        nombreContacto: nombreContacto,
        emailContacto: emailContacto
    };

    conexion.query("INSERT INTO contactos SET ?", datosContacto, (err) => {
        if (err) throw err;
        console.log(`1 Contacto agregado a la base de datos: ${nombreContacto} - ${emailContacto}`);
        res.render('contacto', {
            titulo: 'Contacto'
        });
        //* Envío el mail si no hubo error al guardar los datos
        envioMail().catch(console.error);
    });
});

//* Servidor a la escucha de las peticiones
app.listen(port, () => {
    console.log(`Servidor conectado al puerto ${port}`);
});
