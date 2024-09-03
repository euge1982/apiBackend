const { v4: uuidv4 } = require("uuid");   //Importa el generador de UUID para crear nombres de archivos unicos
const path = require("path");
//const fileUpload = require("express-fileupload");

const extensions = ["png", "jpg", "jpeg", "gif", "svg", "bpm"];

//fileUpload es el archivo a subir
//Funcion para manejar la subida de archivos
const uploadFiles = ( fileUpload ) => {
    return new Promise((resolve, rejected) => {
        const { file } = fileUpload;   //Desestructura el archivo del objeto fileUpload
        const extensionsAndName = file.name.split(".");   //Divide el nombre del archivo para obtener su extension
        const extension = extensionsAndName[extensionsAndName.length - 1];   //Obtiene la extension del archivo
        if (!extensions.includes(extension)) {   //Controla si la extension esta permitida
            return rejected({ ok: false, msg: "Extension no permitida" });
        }

        const tempName = uuidv4() + "." + extension;   //Crea un nombre unico para el archivo

        const uploadPath = path.join(__dirname, "../uploads/", tempName);   //Crea la ruta de subida del archivo
        //Mueve el archivo a la ruta de subida
        file.mv(uploadPath, (err) => {
            if (err) {   //Controla si hay un error
                return rejected({ ok: false, msg: "Error al subir el archivo" });
            }
            //Si no hay error, resuelve la promesa
            resolve({ ok: true, msg: "Archivo subido", name: tempName });
        });
    });
};

module.exports = { uploadFiles };