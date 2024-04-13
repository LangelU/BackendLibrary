const express = require('express'); // (1) 
const dotenv = require('dotenv');  // (2)
const cors = require('cors'); // (3)

dotenv.config(); // (4)
const app = express(); // (5)
const routerApi = require('./routes'); // (6)
const port = process.env.PORT || 3000; // (7)

app.use(cors()); // (8)
app.use(express.json()); // (9)

app.get('/', (req, res) => {
    res.send('Backend con NodeJS - Express + CRUD API REST + MySQL');
}); // (10)

routerApi(app); // (11)
app.listen(port, ()=> {
    console.log("Port ==> ", port);
}); // (12)

/*
1. Importar el módulo Express (framework para aplicaciones web en NodeJS)
2. Importar dotenv (permite cargar variables de entorno desde un arrchivo .env)
3. Importa el módulo cors (middleware para el acces a recursos de distintos dominios)
4. Carga las variables de entorno definidas en el arhivo .env
5. Crea una nueva instancia de la aplicación Express
6. Importar las rutas definidas en el archivo router.js
7. Define el puerto en el que se recibirán las solicitadas, predefiniendo el puerto 3000
8. Configurar el middleware cors para permitir solicitudes
9. Configurar el middleware para analizar el cuerpo de solicitudes con formato JSON
10. Define una respuesta por defecto para la raíz
11. Configurar las rutas definidas en router.js usando la instancia definida de Express
12. Iniciar el servidor para escuchar las solicitudes
*/