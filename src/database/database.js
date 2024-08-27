//Archivo de configuracion para la conexion a la DB

const mysql = require("mysql2/promise");   //Se importa la libreria de mysql2/promise
const config = require("./../config");

//Se genera la conexion a la DB
const connection = mysql.createConnection({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
});

//Funcion para obtener la conexion a la DB
/*const getConnection = () => {
    console.log("Conectado a la DB");
    return connection;
};*/
const getConnection = async () => {
    try {
        console.log("Conectado a la DB");
        return connection;
    } 
    catch (error) {
        //Maneja errores si la conexion falla
        console.error('Error conectando a la DB:', error);
        throw new Error('Conexion fallida');  //Lanza un error
    }
};
//Obtiene la conexion y retorna
module.exports = { getConnection };