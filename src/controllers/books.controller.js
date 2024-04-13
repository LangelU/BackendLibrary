const BooksService = require("../services/books.service");
const { Response } = require("../utilities/responseHandler");


const service = new BooksService();

const getBooks = async (req, res) => {
    try {
        const query = await service.getBooks();
        
        if (query.length == 0) {
            Response.successResponse(res, 403, true, "No hay libros registrados", null);
        } else {
            Response.successResponse(res, 200, true, "Libros obtenidos correctamente", query);
        }
    } catch (err) {
        Response.errorResponse(res, 500, false, "Ocurrió un error inesperado", err.message)
    }
}

module.exports = {
    getBooks
}
