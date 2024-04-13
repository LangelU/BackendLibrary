const { Model, DataTypes, Sequelize } = require('sequelize');

const BOOKS_TABLE = 'books';

class Book extends Model {

    static config(sequelize){
        return {
            sequelize,
            tableName: BOOKS_TABLE,
            modelName: 'Book',
            timestamps: true,
            paranoid: true
        }
    }
}

const BookSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    title: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'title'
    },
    author: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'author'
    },
    description: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'description'
    },
    cover_page: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'cover_page'
    },
    year: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'title'
    },
    state: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        field: 'state'
    },
    deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'deletedAt',
    }
}

module.exports = { Book, BookSchema };

/*
Se define el modelo Book, se define su tabla correspondiente en la base de datos
y se define la estructura del modelo
*/