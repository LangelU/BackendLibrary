const { Model, DataTypes, Sequelize } = require('sequelize');

const USERS_TABLE = 'users';

class User extends Model {
    static config(sequelize){
        return {
            sequelize,
            tableName: USERS_TABLE,
            modelName: 'User',
            timestamps: true,
            paranoid: true,
        }
    }
}

const UserSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'name',
        max: 255
    },
    last_name: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'last_name',
        max: 255
    },
    email: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'email',
        max: 255
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'password',
        max: 255
    },
    state: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'state'
    },
    role_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'role_id',
        references: {
            model: 'roles',
            key: 'id'
        }
    },
    deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'deletedAt',
    }
}

module.exports = { User, UserSchema };