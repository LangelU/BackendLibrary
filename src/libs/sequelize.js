const { Sequelize } = require('sequelize');

const { config } = require('../config/config');
const setupModels = require('./../models');

const sequelize = new Sequelize(
    config.dbName, //Nombre de la base de datos
    config.dbUser, //Nombre del usuario
    config.dbPassword, //Contraseña
    {
        host: config.dbHost,
        dialect: 'mysql'
    }
);

sequelize.sync();
setupModels(sequelize);

module.exports = sequelize;

/*
Configurar y conectar sequalize con la base de datos, usando los datos definidos en el
.env
la linea 16 se usa para sincronizar los modelos, lo que permite crear las tablas en la
base de datos en caso de no existir
*/