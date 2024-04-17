const { models } = require('../libs/sequelize');
const { Book } = require('../models/books.model');
const { User } = require('../models/user.model');

class ReservationService {
    
    constructor() {}

    async getReservations() {
        const res = await models.Reservation.findAll({
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
                        ['name', 'applicant_name'],
                        ['last_name', 'applicant_last_name'],
                        ['email', 'applicant_email']
                    ]
                }
            ],
            attributes: ['id', 'book_id', 'user_id', 'createdAt']
        });
        return res;
    }

    async getReservation(id) {
        const res = await models.Reservation.findByPk(id, {
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
                        ['name', 'applicant_name'],
                        ['last_name', 'applicant_last_name'],
                        ['email', 'applicant_email']
                    ]
                }
            ],
            attributes: ['id', 'book_id', 'user_id', 'createdAt']
        });
        return res;
    }

    async createReservation(data) {
        const res = await models.Reservation.create(data);
        return res;
    }

    async updateReservation(id, data) {
        const Reservation = await this.getReservation(id);
        const res = await Reservation.update(data);
        return res;
    }

    async deleteReservation(id) {
        const Reservation = await this.getReservation(id);
        await Reservation.destroy();
        return {deleted: true};
    }
}

module.exports = ReservationService;

/*
Se definen los métodos que permitrán al modelo manipular la información en la BD
*/
