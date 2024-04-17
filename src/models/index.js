const { Book, BookSchema } = require('./books.model');
const { Role, RoleSchema } = require('./role.model');
const { User, UserSchema } = require('./user.model');
const { Reservation, ReservationSchema} = require('./reservations.model');

function setupModels(sequelize) {
    Book.init(BookSchema, Book.config(sequelize));
    Role.init(RoleSchema, Role.config(sequelize));
    User.init(UserSchema, User.config(sequelize));
    Reservation.init(ReservationSchema, Reservation.config(sequelize));

    //Relationships
    Reservation.belongsTo(Book, { foreignKey: 'book_id' })
    Book.hasOne(Reservation, { foreignKey: 'book_id' })

    Reservation.belongsTo(User, {foreignKey: 'user_id'})
    User.hasMany(Reservation ,{foreignKey: 'user_id'})
}

module.exports = setupModels;

/*
Importar el modelo y el esquema de Libros, y posteriormente confgurarlo e inicializarlo.
Posterior, exportar la funcion setupModels.
*/