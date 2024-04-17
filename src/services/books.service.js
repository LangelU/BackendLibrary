const { models } = require('../libs/sequelize');
const { Reservation } = require('../models/reservations.model');


class BooksService {
    
    constructor() {}

    async getBooks() {
        const res = await models.Book.findAll({
            include: [{
                model: Reservation,
                attributes: ['user_id']
            }],
            attributes: ['id', 'title', 'author', 'description', 'year', 'state', 'createdAt']
        });
        return res;
    }

    async getBook(id) {
        const res = await models.Book.findByPk(id, {
            include: [{
                model: Reservation,
                attributes: ['user_id']
            }],
            attributes: ['id', 'title', 'author', 'description', 'year', 'state', 'createdAt']
        });
        return res;
    }

    async createBook(data) {
        const res = await models.Book.create(data);
        return res;
    }

    async updateBook(id, data) {
        const book = await this.getBook(id);
        const res = await book.update(data);
        return res;
    }

    async deleteBook(id) {
        const book = await this.getBook(id);
        await book.destroy();
        return {deleted: true};
    }
}

module.exports = BooksService;

/*
Se definen los métodos que permitrán al modelo manipular la información en la BD
*/
