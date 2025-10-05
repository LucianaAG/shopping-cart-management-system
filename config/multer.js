const multer = require('multer');
const path = require('path'); // importa utilidades para manejar rutas de archivos
const fs = require('fs'); // importa el modulo de node.js para trabajar con el sistema de archivos

const uploads_directory = path.join(__dirname, '..', 'uploads'); // define la ruta absoluta de 'uploads'

// asegura que exista 'uploads' al arrancar; si no existe, la crea
if (!fs.existsSync(uploads_directory)) {
  fs.mkdirSync(uploads_directory, { recursive: true });
}

const storage = multer.diskStorage({ // le ordena a multer que almacene los archivos en el disco local
  destination: (request, file, cb) => { // indica dónde guardar el archivo
    cb(null, uploads_directory);
  },
  filename: (request, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase(); // obtiene la extension original del archivo
    const filename = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext; // genera un nombre único (para evitar archivos con el mismo nombre)
    cb(null, filename); // guarda el archivo con nombre único en uploads_directory
  }
});

const file_filter = (request, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']; // lista de tipos de archivos aceptados

  if (allowed.includes(file.mimetype)) { // evalua si el tipo de archivo actual está entre los permitidos (en allowed)
    cb(null, true); // si está, se permite
  } else {
    cb(new Error('Tipo de archivo no permitido'), false); // sino, se rechaza
  }
};

const upload = multer({ // config instancia multer a usar en las rutas
  storage,
  fileFilter: file_filter, // aplica filtro para solo permitir imagenes
  limits: { fileSize: 2 * 1024 * 1024 } // limita el tamaño el tamaño del archivo
});

module.exports = { upload, uploads_directory };