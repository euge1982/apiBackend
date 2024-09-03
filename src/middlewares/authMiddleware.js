//Archivo con la autenticacion con JWT

const jwt = require("jsonwebtoken");   //Importa jsonwebtoken
const config = require("../config");   //Importa config, porque tiene la palacra secreta
const { response, request, next } = require("express");   //Importa los objetos de express

//Funcion middleware para autenticar solicitudes usando JWT
const authenticateJWT = (req = request, res =response, next = next) =>{
  const autHeader = req.headers["authorization"];   //Se intercepta el header y se toma la authorization que tiene el token
  const token = autHeader && autHeader.split(" ")[1];   //Se separa el BearerToken, y se toma el segundo indice del array que tiene el dato, token es ahora un string

  if (token ==null) return res.sendStatus(401);   //Si token es nulo devuelve el error 401 (Unauthorized)

  //Verifica si la firma es la correcta
  jwt.verify(token, config.secretKey, (err, user) => {
    if (err) return res.sendStatus(403);   //Si hay un error en la verificacion devuelve un error 403 (Forbidden)
    //Si el token es valido
    req.user = user;   //Se guarda el usuario en el request para usar en rutas protegidas
    next();   //Pasa al siguiente middleware o ruta
  });
};

//Esta funcion no es un middleware, pero se pone para usar la importacion de JWT
//Gestiona la creacion del token, se envia el usuario (que esta en el payload)
const generateJWT= async (user) => {
  const payload = {   //Se genera el payload con la informacion del usuario
    sub: user.id,
    username: user.username,
    name: user.nombre,
  };

  //Se definen las opciones del token y el tiempo de expiracion
  const options = {   
    expiresIn: "24h",
  };

  //Se retorna el token
  return jwt.sign( payload, config.secretKey, options );

};

//Se exportan las funciones
module.exports = { authenticateJWT, generateJWT };