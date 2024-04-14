const { Sequelize } = require("sequelize");
const BooksService = require("../services/books.service");
const { Response } = require("../utilities/responseHandler");


const service = new BooksService();

const getBooks = async (req, res) => {
    try {
        const { bookTitle , bookAuthor} = req.body;
        let query;
        if (!bookTitle && !bookAuthor) {
            query = await service.getBooks();
        } else {
            //Apply filters
            const whereClause = {};
            if (bookTitle && bookAuthor) {
                whereClause.title = bookTitle;
                whereClause.author = bookAuthor;
            } else if (bookTitle) {
                whereClause.title = bookTitle;
            } else if (bookAuthor) {
                whereClause.author = bookAuthor;
            }
            query = Book.findOne({
                where: whereClause
            })
        }
        if (query.length == 0) {
            Response.successResponse(res, 403, true, "Books not found", null);
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
    if (req.auth_user_role == 1) {
        try {
            const {title, author, description, cover_page, year} = req.body;
            const validator = validateData();
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
                Response.errorResponse(res, 401, false, "Validation error", validator['errors'])
            }
        } catch (err) {
            Response.errorResponse(res, 500, false, "An inespered error ocurred", err.message)
        }
    } else {
        Response.errorResponse(res, 500, false, "An error ocurred", "Unauthorized action")
    }
}

const updateBook = async (req, res) => {
    if (req.auth_role_id == 1) {
        try {
            const {title, author, description, cover_page, year} = req.body;
            const bookId = req.params.id;
            const validator = validateData();
            const bookData = await service.getBook(bookId);
            if (bookData) {
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
                    Response.successResponse(res, 201, true, "Book updated successfully", query);
                } else {
                    Response.errorResponse(res, 401, false, "Validation error", validator['errors']);
                }
            } else {
                Response.errorResponse(res, 401, false, "Validation error ocurred", "Book not found");
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
    if (data.title.length > 255 || !data.title) {
        errorMessages.push({
            title: "title is required with a maximum of 255 characters"
        });
        countErrors++;
    }
    if (data.author.length > 255 || !data.author) {
        errorMessages.push({
            title: "author is required with a maximum of 255 characters"
        })
        countErrors++;
    }

    if (data.description.length > 255 || !data.description) {
        errorMessages.push({
            title: "title is required with a maximum of 255 characters"
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
