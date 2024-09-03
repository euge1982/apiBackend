//Archivo donde se configura el servidor

const express = require("express");   //Importa express
const morgan = require("morgan");   //Importa morgan para las peticiones HTTP
const fileUpload = require("express-fileupload");   //Importa express-fileupload para manejo de archivos
var cors = require("cors");   //Importa CORS para solicitudes de dominios externos


//Importa las rutas para los usuarios y para los archivos
const users = require("./Routes/userRoutes");
const  files = require("./Routes/uploadFileRoute");

//Crea una instancia de Express
const app = express();

//Cors
app.use(cors());

//Se configura el puerto donde el servidor escuchara
app.set("port", 3000)   //Se establece el puerto en 3000

app.use(express.urlencoded({ extended: false }));   //Para el manejo de datos URL-encoded
app.use(express.json());   //Para poder manejar datos en formato json

//Middlewares
app.use(morgan("dev"));   //Para loguear las solicitudes HTTP en la consola

//FileUpload
app.use(
    fileUpload({
        useTempFiles: true,   //Usa archivos temporales para los archivos subidos
        tempFileDir: '/tmp/',   //Directorio temporal donse se almacenaran los archivos subidos
        createParentPath: true,   //Crea el directorio si no existe
        limits: { fileSize: 50 * 1024 * 1024},   //Limita el tamaño de los archivos
    })
);

//Direcciones de rutas, usa las rutas importadas desde userRoutes
app.use(/* Routes */ users, files);

module.exports = app;   //Exporta para que sea utilizado en otros archivos