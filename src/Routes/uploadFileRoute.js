const { Router } = require("express");   //Importa el enrutador de express
const methods = require("../Controllers/uploadFileController");   //Importa los metodos del uploadFileController
const { authenticateJWT } = require("../middlewares/authMiddleware");   //Importa el middleware de autenticacion de JWT

const router = Router();   //Crea una instancia del enrutador de Express

//Ruta para subir un archivo
router.post("/upload/:id", authenticateJWT, methods.postFile);

module.exports = router;   //Exporta el enrutador