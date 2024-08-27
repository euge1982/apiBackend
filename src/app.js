//Archivo donde se configura el servidor

const express = require("express");   //Importa express
const morgan = require("morgan");   //Importa morgan para las peticiones HTTP
var cors = require("cors");   //Importa CORS para solicitudes de dominios externos

//Importa las rutas para los usuarios
const users = require("./Routes/userRoutes");

//Crea una instancia de Express
const app = express();

//Cors
app.use(cors());

//Se configura el puerto donde el servidor escuchara
app.set("port", 3000)   //Se establece el puerto en 3000

app.use(express.urlencoded({ extended: false }));   //para el manejo dedaros URL-encoded
app.use(express.json());   //Para poder manejar datos en formato json

//Middlewares
app.use(morgan("dev"));   //Para loguear las solicitudes HTTP en la consola

//Direcciones de rutas, usa las turas importadas desde userRoutes
app.use(/* Routes */ users)

module.exports = app;   //Exporta para que sea utilizado en otros archivos