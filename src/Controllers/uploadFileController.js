//Archivo que contiene los metodos para subir archivos

const { request, response } = require("express");   //Importa los objetos de express
const { uploadFiles } = require("../helpers/uploader");   //Importa el metodo para subir archivos

//Metodo para subir un archivo
const postFile = async (req = request, res = response) => {

    try {
        //Se verifica que se haya subido un archivo
        if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {   //Si no se ha subido un archivo
            return res.status(204).send ("No files were uploaded.");   //Se responde con un 204 (No Content)
        }
        //Se sube el archivo
        const img_id = await uploadFiles(req.files);
        
        const record = { img_id: img_id };   //Se guardan los datos

        res.status(200).json({ ok: true, record, msg:"Subida exitosa" });   //Se responde con un 200 (OK)

    } 
    catch (error) {
        //Maneja los errores
        console.log(error);
        res.status(404).json({ ok: false, error });
    }
};

module.exports = { postFile };
