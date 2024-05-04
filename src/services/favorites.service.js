const { models } = require('../libs/sequelize');
const { Book } = require('../models/books.model');
const { User } = require('../models/user.model');

class FavoriteService {
    constructor() {}

    async getFavorites(options) {
        const res = await models.Favorite.findAll({
            ...options,
            include: [
                {
                    model: Book,
                    attributes: [
                        'id',
                        ['title', 'book_name'],
                        ['author', 'book_author'],
                        ['description', 'book_description'],
                        ['cover_page', 'book_cover_page'],
                        ['year', 'book_year'],
                        ['state', 'book_state']
                    ]
                },
                {
                    model: User,
                    attributes: [
                        'id',
                        ['name', 'user_name'],
                        ['last_name', 'user_last_name'],
                        ['email', 'user_email']
                    ]
                }
            ],
            attributes: ['id', 'book_id', 'user_id', 'createdAt']
        });
        return res;
    }

    async getFavorite(id) {
        const res = await models.Favorite.findByPk(id);
        return res;
    }

    async createFavorite(data) {
        const res = await models.Favorite.create(data);
        return res;
    }

    async deleteFavorite(id) {
        const Favorite = await this.getFavorite(id);
        await Favorite.destroy();
        return {deleted: true};
    }
}

module.exports = FavoriteService;