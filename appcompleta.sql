
-- Base de Datos para la App Completa de Ejemplo: --
create database empresautn;

use empresautn;

create table productos(
idProducto int unsigned not null auto_increment,
nombreProducto varchar(150) not null,
precioProducto int unsigned not null,
descripcionProducto varchar(250) not null,
primary key (idProducto)
);

create table contactos(
idContacto int unsigned not null auto_increment,
nombreContacto varchar (150) not null,
emailContacto varchar(100) not null,
primary key(idContacto)
);