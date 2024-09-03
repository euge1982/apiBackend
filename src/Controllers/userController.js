// Archivo que contiene el CRUD

const { response, request } = require("express");
const { generateJWT } = require("../middlewares/authMiddleware");
const bcrypt = require("bcrypt");   //bcrypt para el manejo de contraseñas
const { getConnection } = require("../database/database");

//Funcion para registrar un nuevo usuario
const register = async (req = request, res = response) => {
  const user = { ...req.body };   //Se obtiene el usuario del body

  const salt = 12;   //Valor aleatorio para generar el hasheo

  if (!user) {
    return res.status(401).json({ ok: false, msg: "No autorizado" });
  }

  try {
    //Se hashea la contraseña antes de guardarla en la base de datos
    user.password = await bcrypt.hash(user.password, salt);

    const connection = await getConnection();

    //Se crea el usuario en la base de datos
    const result = await connection.query("INSERT INTO users SET ?", user);

    //Si el usuario se crea exitosamente, se responde con un 201 (Created)
    res.status(201).json({ ok: true, result, msg: "Usuario registrado exitosamente" });
  
  } 
  catch (e) {
    console.log(e);   //Se captura cualquier error que ocurra
    res.status(500).json({ ok: false, error, msg: "Error del Server" });
  }
};

//Funcion para el login de un usuario
const login = async (req = request, res = response) => {
  const { username, password } = req.body;   //Se obtiene el username y la password del body

  //Si alguno de los dos campos viene vacio, se responde con un 401
  if (!username || !password) {
    return res.status(401).json({ ok: false, msg: "Credenciales no provistas" });
  }

  try {
    //Se crea la instancia de la DB
    const connection = await getConnection();
    //Se busca el usuario en la base de datos
    const [result] = await connection.query(
      "SELECT * FROM users WHERE username = ?",
      username
    );

    if (!result[0]) {   //Si el usuario no existe, se responde con un 404
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }

    //Se compara la contraseña proporcionada con la almacenada en la base de datos
    const isPassword = await bcrypt.compare(password, result[0].password);

    if (!isPassword) {   //Si la contraseña es incorrecta, se responde con un 401
      return res.status(401).json({ ok: false, msg: "Contraseña incorrecta" });
    }
    else {
      //Si la contraseña es correcta, se genera un token JWT
      const token = await generateJWT(result[0]);
      //Se responde con un 200 y el token
      res.status(200).json({ ok: true, token, msg: "Login exitoso" });
    }
  } 
  catch (error) {
    console.error(error);   //Se captura cualquier error que ocurra
    res.status(500).json({ ok: false, error, msg: "Server error" });
  }
};

const getOne = async (req = request, res = response) => {
  const id = req.params.id;   //Se toma el id de los params
  
  //Si el parámetro no fue provisto por el usuario se responde con un 404 (Not Found)
  if (!id) {   
    return res.status(404).json({ ok: false, msg: "El id no fue provisto" });
  }

  try {
    //Se crea la instancia de la DB
    const connection = await getConnection();
    const [result] = await connection.query(
      "SELECT * FROM users WHERE id = ?",
      id
    );

    //Si el usuario no existe, result sera un array vacio, por lo que verificamos su longitud
    if (result.length === 0) {
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }

    //Si el usuario existe, se devuelve en la respuesta
    res.status(200).json({ ok: true, user: result[0], msg: "Aprobado" });
  
  } 
  catch (error) {
    console.error(error);   //Se captura cualquier error que ocurra
    res.status(500).json({ ok: false, msg: "Server error" });
  }
};

module.exports = { register, login, getOne };   //Se exportan las funciones para ser utilizadas en las rutas