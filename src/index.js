//Archivo para iniciar la app

const app = require("./app");   //Se importan las configuraciones de app

//Funcion principal
const main = () => {
    //Se inicia el servidor y se escucha en el puerto
    app.listen(app.get("port"), (error) => {
        //Si ocurre un error al iniciar el servidor lo capturamos aca
        if (error) {
            console.error(`Error al iniciar el servidor: ${error.message}`);
             // Se maneja el error y se envía una respuesta JSON al cliente
            app.use((req, res) => {
                res.status(500).json({
                    success: false,
                    message: "Error al iniciar el servidor",
                    error: err.message,
                });
            });
            return;   //Se usa para que a aplicacion no continue ejecutandose
        }
        else {
            //Si el servidor se inicia bien, se muestra este msj
            console.log(`Servidor corriendo en el puerto ${ app.get("port")}`);
        }
    });
};
main();