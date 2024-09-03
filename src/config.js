/*Archivo con las configuraciones para crear las
instancias de la DB y la firma del token*/

const { config } = require("dotenv");//Se traen los metodos de la libreria dotenv, con el require

config();   //Carga la configuracion del archivo .env en process.env

//Configuracion de conexion del server
module.exports = {   //Se exporta para que sea consumida por todo el proyecto
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    secretKey: process.env.SECRET_SEED,
};