const { models } = require('../libs/sequelize');

class UsersService {
    
    constructor() {}

    async getUsers() {
        const res = await models.User.findAll();
        return res;
    }

    async getUser(id) {
        const res = await models.User.findByPk(id);
        return res;
    }

    async createUser(data) {
        const res = await models.User.create(data);
        return res;
    }

    async updateUser(id, data) {
        const User = await this.getUser(id);
        const res = await User.update(data);
        return res;
    }

    async deleteUser(id) {
        const User = await this.getUser(id);
        await User.destroy();
        return {deleted: true};
    }
}

module.exports = UsersService;

/*
Se definen los métodos que permitrán al modelo manipular la información en la BD
*/
