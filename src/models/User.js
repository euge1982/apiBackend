//Creacion del modelo de usuario en la DB

//Se importa el modulo de conexion a la DB
const { getConnection } = require('./database/database.js');

//Funcion para crear la tabla users en la DB
const createUserTables = async () => {
  try {
    const conn = await getConnection(); // Obtiene una conexión a la base de datos

    await conn.query(
      `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )`
    );

    console.log('Tabla de usuarios creada exitosamente');   //Mensaje si la tabla se creo correctamente
  } 
  catch (error) {
    console.error('Error en la creacion de tablas:', error);   //Si la consulta falla
  }
};

//Llama a la función para crear la tabla 'users'
createUserTables();

module.exports = { createUserTables };   //Se exporta lo que se creo