const { Book } = require("../models/books.model");
const { Reservation } = require("../models/reservations.model");
const ReservationService = require("../services/reservation.service");
const { Response } = require("../utilities/responseHandler");
const { Op } = require('sequelize');
const service = new ReservationService();

const getReservations = async (req, res) => {
    if (req.auth_user_id == 1) {
        const {user_id, book_id} = req.body
    let query
    try {
        if (!user_id && !book_id) {
            query = await service.getReservations()
        } else {
            //Apply filters
            let whereClause
            if (user_id) {
                whereClause = {
                    user_id: { [Op.eq]: user_id}
                }
            } else if(book_id) {
                whereClause = {
                    book_id: { [Op.eq]: book_id}
                }
            }
            query = await Reservation.findAll({
                where: whereClause
            })
        }
        if (query.length == 0) {
            return Response.errorResponse(res, 404, false, "An error ocurred", "Reservations not found")
        }
        return Response.successResponse(res, 200, true, "Reservations found", query);
    } catch (err) {
        return Response.errorResponse(res, 500, false, "An unexpected error ocurred", err.message)
    }
    } else {
        return Response.errorResponse(res, 401, false, "An error ocurred", "Unauthorized action")
    }
}

const getUserReservations = async (req, res) => {
    const userId = req.params.user_id
    try {
        const query = await Reservation.findOne({
            where: {
                user_id: userId
            }
        })
        if(!query) {
            return Response.errorResponse(res, 404, false, "Validation error", "No active reservations found for the user")
        }
        const reservationsUserArray = query.map(item => item.book_id)
        const data = {
            data: query,
            userReservationsArray: reservationsUserArray
        }
        return Response.successResponse(res, 200, true, "Reservations found", data)
    } catch (err) {
        return Response.errorResponse(res, 500, false, "An unexpected error ocurred", err.message)
    }
}

const getReservation = async (req, res) => {
    const reservationId = req.params.id
    try {
        const query = await service.getReservation(reservationId)
        if (query) {
            return Response.successResponse(res, 200, true, "Reservation found", query)
        } else {
            return Response.errorResponse(res, 404, false, "Validation error", "Reservation not found")
        }
    } catch (err) {
        return Response.errorResponse(res, 500, false, "An unexpected error ocurred", err.message)
    }
}

const createReservation = async (req, res) => {
    const book_id = req.params.book_id
    const userId = req.auth_user_id
    if (!book_id) {
        return Response.errorResponse(res, 400, false, "Validation error", "The fields book_id and user_id are required")
    }
    const bookData = await Book.findByPk(book_id);

    if (!bookData) {
        return Response.errorResponse(res, 404, false, "Validation error", "Book not found")
    }
    try {
        const data = {
            book_id: book_id,
            user_id: userId
        }
        const query = await service.createReservation(data)
        return Response.successResponse(res, 201, true, "Reservation generated successfully", query)
    } catch (err) {
        return Response.errorResponse(res, 500, false, "An unexpected error ocurred", err.message)
    }
}

const deleteReservation = async (req, res) => {
    const reservationId = req.params.id
    const reservationData = await service.getReservation(reservationId)
    if (!reservationData) {
        return Response.errorResponse(res, 404, false, "Validation error", "Reservation not found")
    }
    if (req.auth_user_role == 1 || (req.auth_user_id == reservationData.user_id)) {
        try {
            const query = await service.deleteReservation(reservationId)
            return Response.successResponse(res, 200, true, "Reservation deleted successfully")
        } catch (err) {
            return Response.errorResponse(res, 500, false, "An unexpected error ocurred", err.message)
        }
    } else {
        return Response.errorResponse(res, 401, false, "An error ocurred", "Unauthorized action")
    }
    
}

module.exports = {
    getReservation,
    getUserReservations,
    getReservations,
    createReservation,
    deleteReservation
}