const { Model, DataTypes, sequelize} = require('sequelize');
const { Book } = require('./books.model');

const RESERVATIONS_TABLE = 'reservations';

class Reservation extends Model {
    static config(sequelize){
        return {
            sequelize,
            tableName: RESERVATIONS_TABLE,
            modelName: 'Reservation',
            timestamps: true,
            paranoid: true
        }
    }
}

const ReservationSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    book_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'book_id',
        references: {
            model: 'books',
            key: 'id'
        }
    },
    user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'deletedAt',
    }
}

//Relationships

module.exports = { Reservation, ReservationSchema};