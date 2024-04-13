const { Model, DataTypes, Sequelize } = require('sequelize');

const ROLES_TABLE = 'roles';

class Role extends Model {

    static config(sequelize){
        return {
            sequelize,
            tableName: ROLES_TABLE,
            modelName: 'Role',
            timestamps: true,
            paranoid: true
        }
    }
}

const RoleSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'name'
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

module.exports = { Role, RoleSchema };