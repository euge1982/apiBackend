/*//Archivo que contiene el CRUD para el modelo User

//Se trae la funcion creada para gestionar la conexion con la DB
//const user = require("../models/User")
const { response } = require("express");
const { getConnection } = require("../database/database");
const { generateJWT } = require("../middlewares/authMiddleware");
const bcrypt = require('bcrypt'); //brypt para el manejo de contraseñas

//Se crean funciones para poder pasar por parametro la request del cliente, 
//el response del servidor o el next
const getOne = async (req = request, res = response) =>{
  const id = req.params.id;   //Se toma el id de los params

  if (!id){   //Si el parametro no fue provisto por elusuario se responde con un 404 (Not Found)
    res.status(404).json({ ok:false, msg: "El parametro no fue provisto"});
  }

  try {
    const connection = await getConnection();
    //Para guardar los datos
    const [result] = await connection.query(
      "SELECT * FROM users WHERE id = ?",
      id
    );

    res.status(200).json({ ok: true, result, msg: "Aprobado"});
  
  }
  catch(error){
    //Si 
    console.error(e);
    res.status(500).json({ ok: false, msg: "Server error"})
  }
}

//Registro de usuarios
const register = async (req = request, res = response) => {
  const user = { ...req.body };   //Se obtiene el usuario del body

  const salt = 12;   //Valor aleatorio para generar el hasheo

  if (!user) res.status(401).json ({ ok: false, msg: "No autorizado"});

  try {
    user.password = await bcrypt.hash(user.password, salt);   //Se cambia lacontraseña del user por la nueva hasheada
    
    const connection = await getConnection();   //Se crea la instancia de la DB

    const result = await connection.query("INSERT INTO users SET ?", user);
    res.status(201).json({ ok: true, result, msg: "Aprobada"});
  
  }
  catch (e) {
    console.log(e);
    res.status(500).json({ ok: false, e, msg: "Server error"})
    
  }
};

//Login de un usuario
const login = async (req = request, res = response) => {
  const user = { ...req.body};

  if (!user) res.status(401).json({ ok: false, msg: "No autorizado"});

  try {
    const connection = await getConnection();
    const [result] = await connection.query(
      "SELECT * FROM users WHERE username =?",
      user.username
    );

    if (!result[0]) res.status(404).json({ ok: false, msg:"Usuario no encontrado"});
    
    const isPassword = await bcrypt.compare(user.password, result[0].password);

    if (isPassword) {
      const token = await generateJWT(result[0]);
      res.status(200).json({ ok: true, token, msg: "Login"});
    }
    else {
      res.status(401).json({ ok: false, msg: "Contraseña incorrecta"});
    }
  }
  catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, e, msg: "Server error"})
  }
};

module.exports = { register, login, getOne}; */
// Archivo que contiene el CRUD para el modelo User

// Se trae el modelo User que representa la tabla 'users' en la base de datos
const User = require("../models/User");
const { response, request } = require("express");
const { generateJWT } = require("../middlewares/authMiddleware");
const bcrypt = require('bcrypt');   //bcrypt para el manejo de contraseñas

//Funcion para obtener un usuario por su ID
const getOne = async (req = request, res = response) => {
  const id = req.params.id;   //Se toma el id de los params

  if (!id) {   //Si el parametro no fue provisto por el usuario se responde con un 404 (Not Found)
    return res.status(404).json({ ok: false, msg: "El id no fue provisto" });
  }

  try {
    //Se busca el usuario en la base de datos usando el modelo User
    const user = await User.findByPk(id);   //Utiliza findByPk para buscar por la clave primaria

    if (!user) {   //Si el usuario no existe, se responde con un 404
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }

    //Si el usuario existe, se devuelve en la respuesta
    res.status(200).json({ ok: true, user, msg: "Aprobado" });
  
  } 
  catch (error) {
    console.error(error);   //Se captura cualquier error que ocurra
    res.status(500).json({ ok: false, msg: "Server error" });
  }
};

//Funcion para registrar un nuevo usuario
const register = async (req = request, res = response) => {
  const userData = { ...req.body };   //Se obtiene el usuario del body

  const salt = 12;   //Valor aleatorio para generar el hasheo

  if (!userData) {
    return res.status(401).json({ ok: false, msg: "No autorizado" });
  }

  try {
    //Se hashea la contraseña antes de guardarla en la base de datos
    userData.password = await bcrypt.hash(userData.password, salt);

    //Se crea un nuevo usuario en la base de datos usando el modelo User
    const newUser = await User.create(userData);

    //Si el usuario se crea exitosamente, se responde con un 201 (Created)
    res.status(201).json({ ok: true, newUser, msg: "Usuario registrado exitosamente" });
  
  } 
  catch (error) {
    console.log(error);   //Se captura cualquier error que ocurra
    res.status(500).json({ ok: false, error, msg: "Error del Server" });
  }
};

//Funcion para el login de un usuario
const login = async (req = request, res = response) => {
  const { username, password } = req.body;   //Se obtiene el username y la password del body

  if (!username || !password) {
    return res.status(401).json({ ok: false, msg: "Credenciales no provistas" });
  }

  try {
    //Se busca el usuario por su nombre de usuario
    const user = await User.findOne({ where: { username } });

    if (!user) {   //Si el usuario no existe, se responde con un 404
      return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
    }

    //Se compara la contraseña proporcionada con la almacenada en la base de datos
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {   //Si la contraseña es incorrecta, se responde con un 401
      return res.status(401).json({ ok: false, msg: "Contraseña incorrecta" });
    }

    //Si la contraseña es valida, se genera un token JWT
    const token = await generateJWT(user);

    //Se responde con un 200 y el token
    res.status(200).json({ ok: true, token, msg: "Login exitoso" });

  } 
  catch (error) {
    console.error(error);   //Se captura cualquier error que ocurra
    res.status(500).json({ ok: false, error, msg: "Server error" });
  }
};

module.exports = { register, login, getOne };   //Se exportan las funciones para ser utilizadas en las rutas