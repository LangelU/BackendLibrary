const { Sequelize } = require("sequelize");
const BooksService = require("../services/books.service");
const { Response } = require("../utilities/responseHandler");
const {Book} = require('../models/books.model');
const { Op } = require('sequelize');

const service = new BooksService();

const getBooks = async (req, res) => {
    try {
        const { book_title , book_author} = req.body;
        let query;
        if (!book_title && !book_author) {
            query = await service.getBooks();
        } else {
            //Apply filters
            let whereClause = {};
            if (book_title && book_author) {
                whereClause = {
                    title: { [Op.like]: `%${book_title}%` },
                    author: { [Op.like]: `%${book_author}%` }
                };
            } else if (book_title) {
                whereClause = {
                    title: { [Op.like]: `%${book_title}%` }
                };
            } else if (book_author) {
                whereClause = {
                    author: { [Op.like]: `%${book_author}%` }
                };
            }
            query = await Book.findAll({
                where: whereClause
            })
        }
        if (query.length == 0) {
            Response.successResponse(res, 401, true, "Books not found", null);
        } else {
            Response.successResponse(res, 200, true, "Books found", query);
        }
    } catch (err) {
        Response.errorResponse(res, 500, false, "An unexpected error ocurred", err.message)
    }
}

const getBook = async (req, res) => {
    const bookId = req.params.id;
    try {
        const query = await service.getBook(bookId);
        if (query) {
            Response.successResponse(res, 200, true, "Book found", query);
        } else {
            Response.errorResponse(res, 404, false, "An error ocurred", "Book not found");
        }
    } catch (err) {
        Response.errorResponse(res, 500, false, "An unexpected error ocurred", err.message);
    }
}

const createBook = async (req, res) => {
    if (req.auth_role_id == 1) {
        const {title, author, description, cover_page, year} = req.body;
        if (!title) {
            Response.errorResponse(res, 401, false, "Register failed", "The title field is required");
            return;
        }
        const validateIfExist = await Book.findOne({
            where: {
                title: title
            }
        });
        if (validateIfExist) {
            Response.errorResponse(res, 401, false, "Register failed", "There is already a registered book with this title");
        } else {
            try {
                const validationData = {
                    title: title,
                    author: author,
                    description: description,
                    cover_page: cover_page,
                    year: year
                }
                const validator = await validateData(validationData);
                if (validator['success']) {
                    const data = {
                        title: title,
                        author: author,
                        description: description,
                        cover_page: cover_page ?? "",
                        state: 1,
                        year: year
                    }
                    const query = await service.createBook(data);
                    Response.successResponse(res, 201, true, "Book created successfully", query)
                } else {
                    Response.errorResponse(res, 401, false, "Validation error", validator.errors)
                }
            } catch (err) {
                Response.errorResponse(res, 500, false, "An inespered error ocurred", err.message)
            }
        }
    } else {
        Response.errorResponse(res, 403, false, "An error ocurred", "Unauthorized action")
    }
}

const updateBook = async (req, res) => {
    if (req.auth_role_id == 1) {
        try {
            const {title, author, description, cover_page, year, state} = req.body;
            const bookId = req.params.id;
            const validateIfExist = await Book.findByPk(bookId);
            if (!validateIfExist) {
                Response.errorResponse(res, 404, false, "Update failed", "Book not found");
            } else {
                try {
                    const validationData = {
                        title: title,
                        author: author,
                        description: description,
                        cover_page: cover_page,
                        year: year
                    }
                    const validator = await validateData(validationData);
                    if (validator['success']) {
                        const data = {
                            title: title,
                            author: author,
                            description: description,
                            cover_page: cover_page ?? "",
                            state: 1,
                            year: year
                        }
                        const query = await service.updateBook(bookId, data);
                        Response.successResponse(res, 200, true, "Book updated successfully", query)
                    } else {
                        Response.errorResponse(res, 401, false, "Validation error", validator.errors)
                    }
                } catch (err) {
                    Response.errorResponse(res, 500, false, "An inespered error ocurred", err.message)
                }
            }
        } catch (err) {
            Response.errorResponse(res, 500, false, "An inespered error ocurred", err.message);
        }
    } else {
        Response.errorResponse(res, 500, false, "An error ocurred", "Unauthorized action")
    }
}

const deleteBook = async (req, res) => {
    const bookId = req.params.id;
    if (req.auth_role_id == 1 || req.auth_user_id === userId) {
        const bookData = await service.getBook(bookId);
        if (bookData) {
            try {
                const deleteUser = await service.deleteBook(bookId);
                Response.successResponse(res, 200, true, "Book deleted successfully", null);
            } catch (err) {
                Response.errorResponse(res, 500, false, "An inespered error ocurred", err.message);
            }
        } else {
            Response.errorResponse(res, 401, false, "Validation error ocurred", "Book not found");
        }
    } else {
        Response.errorResponse(res, 500, false, "An inespered error ocurred", "Unauthorized action");
    }
}

const validateData = async (data) => {
    let errorMessages = [];
    let countErrors = 0;
    if (!data.title || data.title.length > 255) {
        errorMessages.push({
            title: "title is required with a maximum of 255 characters"
        });
        countErrors++;
    }
    if (!data.author || data.author.length > 255) {
        errorMessages.push({
            title: "author is required with a maximum of 255 characters"
        })
        countErrors++;
    }

    if (!data.description || data.description.length > 255) {
        errorMessages.push({
            title: "description is required with a maximum of 255 characters"
        })
        countErrors++;
    }

    if (countErrors >= 1) {
        validatonResult = {
            success: false,
            errors: errorMessages
        };
        return validatonResult;
    } else {
        validatonResult = {
            success: true
        };
        return validatonResult;
    }

}

module.exports = {
    getBook,
    getBooks,
    createBook,
    updateBook,
    deleteBook
}
