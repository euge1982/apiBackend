//Archivo que define las rutas relacionadas con el modelo 'User'
//Y las asocia con los metodos del controlador que corresponde

const { Router } = require("express");   //Importa el enrutador de express
const methods = require("../Controllers/userController");   //Importa los metodos del userController
const { authenticateJWT } = require("../middlewares/authMiddleware");   //Importa el middleware de autenticacion de JWT

const router = Router();   //Crea una instancia del enrutador de Express

router.post("/users/register", methods.register);   //Ruta para registrar un nuevo usuario
router.post("/users/login", methods.login);   //Ruta para el login del usuario
router.get("/users/:id", authenticateJWT, methods.getOne);   //Ruta para obtener un usuario por su id

module.exports = router;   //Exporta el enrutador