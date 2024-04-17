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
            return Response.successResponse(res, 404, true, "Books not found", null);
        }
        return Response.successResponse(res, 200, true, "Books found", query);
    } catch (err) {
        return Response.errorResponse(res, 500, false, "An unexpected error ocurred", err.message)
    }
}

const getBook = async (req, res) => {
    const bookId = req.params.id;
    if (!bookId) {
        return Response.errorResponse(res, 400, false, "Validation error", "Book id field are required");
    }
    try {
        const query = await service.getBook(bookId);
        if (query) {
            return Response.successResponse(res, 200, true, "Book found", query);
        }
        Response.errorResponse(res, 404, false, "An error ocurred", "Book not found");
    } catch (err) {
        Response.errorResponse(res, 500, false, "An unexpected error ocurred", err.message);
    }
}

const createBook = async (req, res) => {
    if (req.auth_role_id == 1) {
        const {title, author, description, cover_page, year} = req.body;
        if (!title) {
            return Response.errorResponse(res, 403, false, "Validation error", "The field title is required")
        }
        if (!author) {
           return Response.errorResponse(res, 403, false, "Validation error", "The field author is required")
        }
        if (!description) {
            return Response.errorResponse(res, 403, false, "Validation error", "The field description is required")
        }

        const validateIfExist = await Book.findOne({
            where: {
                title: title
            }
        });
        if (validateIfExist) {
            return Response.errorResponse(res, 401, false, "Register failed", "There is already a registered book with this title");
        }
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
                return Response.successResponse(res, 201, true, "Book created successfully", query)
            } else {
                return Response.errorResponse(res, 400, false, "Validation error", validator.errors)
            }
        } catch (err) {
            Response.errorResponse(res, 500, false, "An inespered error ocurred", err.message)
        }
    } else {
        Response.errorResponse(res, 401, false, "An error ocurred", "Unauthorized action")
    }
}

const updateBook = async (req, res) => {
    if (req.auth_role_id == 1) {
        const {title, author, description, cover_page, year, state} = req.body;
        const bookId = req.params.id;
        const bookData = await service.getBook(bookId)
        if (!title) {
            return Response.errorResponse(res, 403, false, "Validation error", "The field title is required")
        }
        if (!author) {
            return Response.errorResponse(res, 403, false, "Validation error", "The field author is required")
        }
        if (!description) {
            return Response.errorResponse(res, 403, false, "Validation error", "The field description is required")
        }
        if (!bookId) {
            return Response.errorResponse(res, 404, false, "Update failed", "Book id field are required");
        }

        if (!bookData) {
            return Response.errorResponse(res, 404, false, "Update failed", "Book not found");
        }

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
                    title: title ?? bookData.title,
                    author: author ?? bookData.author,
                    description: description ?? bookData.description,
                    cover_page: cover_page ?? bookData.cover_page,
                    state: state ?? bookData.state,
                    year: year ?? bookData.year
                }
                const query = await service.updateBook(bookId, data);
                return Response.successResponse(res, 200, true, "Book updated successfully", query)
            } else {
                return Response.errorResponse(res, 400, false, "Validation error", validator.errors)
            }
        } catch (err) {
            Response.errorResponse(res, 500, false, "An inespered error ocurred", err.message)
        }
    } else {
        Response.errorResponse(res, 401, false, "An error ocurred", "Unauthorized action")
    }
}

const deleteBook = async (req, res) => {
    const bookId = req.params.id;
    if (req.auth_role_id == 1) {
        const bookData = await service.getBook(bookId);
        if (bookData) {
            try {
                const deleteUser = await service.deleteBook(bookId);
                Response.successResponse(res, 200, true, "Book deleted successfully", null);
            } catch (err) {
                Response.errorResponse(res, 500, false, "An inespered error ocurred", err.message);
            }
        } else {
            Response.errorResponse(res, 404, false, "Validation error ocurred", "Book not found");
        }
    } else {
        Response.errorResponse(res, 401, false, "An error ocurred", "Unauthorized action");
    }
}

const validateData = async (data) => {
    let errorMessages = [];
    let countErrors = 0;
    if (data.title.length > 255) {
        errorMessages.push({
            title: "the maximum number of characters for the field title is 255"
        });
        countErrors++;
    }
    if (data.author.length > 255) {
        errorMessages.push({
            title: "the maximum number of characters for the field author is 255"
        })
        countErrors++;
    }

    if (data.description.length > 255) {
        errorMessages.push({
            title: "the maximum number of characters for the field description is 255"
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
