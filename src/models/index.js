const { Book, BookSchema } = require('./books.model');
const { Role, RoleSchema } = require('./role.model');
const { User, UserSchema } = require('./user.model');

function setupModels(sequelize) {
    Book.init(BookSchema, Book.config(sequelize));
    Role.init(RoleSchema, Role.config(sequelize));
    User.init(UserSchema, User.config(sequelize));
}

module.exports = setupModels;

/*
Importar el modelo y el esquema de Libros, y posteriormente confgurarlo e inicializarlo.
Posterior, exportar la funcion setupModels.
*/