class Response {
    static successResponse = (res, statusCode, success, message, data) => {
        res.status(statusCode).json({ 
            success: success,
            message: message,
            data: data
        });
    };
    
    static errorResponse = (res, statusCode, success, message, error) => {
        res.status(statusCode).json({ 
            success: success,
            message: message,
            error: error
        });
    };
}

module.exports = { Response }