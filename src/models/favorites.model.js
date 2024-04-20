const { Model, DataTypes, sequelize} = require('sequelize');

const FAVORITES_TABLE = 'favorites';

class Favorite extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: FAVORITES_TABLE,
            modelName: 'Favorite',
            timestamps: true,
            paranoid: true
        }
    }
}

const FavoriteSchema = {
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

module.exports = { Favorite, FavoriteSchema }