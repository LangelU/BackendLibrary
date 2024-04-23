const {Favorite} = require('../models/favorites.model')
const FavoriteService = require('../services/favorites.service')
const { Response } = require('../utilities/responseHandler')
const service = new FavoriteService();
const { Book } = require("../models/books.model");

const getUserFavorites = async (req, res) => {
    const userId = req.params.user_id
    try {
        const query = await service.getFavorites({
            where: {
                user_id: userId
            }
        })
        if(!query) {
            return Response.errorResponse(res, 404, false, "Validation error", "No active Favorites found for the user")
        }

        if (query.length == 0) {
            return Response.errorResponse(res, 404, false, "Validation error", "Favorites not found")
        }

        const favoritesUserArray = query.map(item => item.book_id)
        const data = {
            data: query,
            userFavoritesArray: favoritesUserArray
        }

        return Response.successResponse(res, 200, true, "Favorites found", data)
    } catch (err) {
        return Response.errorResponse(res, 500, false, "An unexpected error ocurred", err.message)
    }
}

const createFavorite = async (req, res) => {
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
        const query = await service.createFavorite(data)
        return Response.successResponse(res, 201, true, "Favorite generated successfully", query)
    } catch (err) {
        return Response.errorResponse(res, 500, false, "An unexpected error ocurred", err.message)
    }
}

const deleteFavorite = async (req, res) => {
    const FavoriteId = req.params.id
    const FavoriteData = await service.getFavorite(FavoriteId)
    if (req.auth_user_role == 1 || (req.auth_user_id == FavoriteData.user_id)) {
        try {
            const query = await service.deleteFavorite(FavoriteId)
            return Response.successResponse(res, 200, true, "Favorite deleted successfully")
        } catch (err) {
            return Response.errorResponse(res, 500, false, "An unexpected error ocurred", err.message)
        }
    } else {
        return Response.errorResponse(res, 401, false, "An error ocurred", "Unauthorized action")
    }
    
}

module.exports = {
    getUserFavorites,
    createFavorite,
    deleteFavorite
}