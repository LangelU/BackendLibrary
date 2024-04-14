const { User } = require("../models/user.model");
const UsersService = require("../services/user.service");
const { Response } = require("../utilities/responseHandler");

const bcrypt = require('bcrypt');

const service = new UsersService();

const getUsers = async (req, res) => {
    try {
        const query = await service.getUsers();
        if (req.auth_user_id == 1) {
            if (query.length == 0) {
                Response.successResponse(res, 403, true, "Users not found", null);
            } else {
                Response.successResponse(res, 200, true, "Users founded", query);
            }
        } else {
            Response.errorResponse(res, 500, false, "An error ocurred", "Unauthorized action");
        }
        
    } catch (err) {
        Response.errorResponse(res, 500, false, "An inespered error ocurred", err.message)
    }
}

const getUser = async (req, res) => {
    const userId = req.params.id;
    if (req.auth_role_id == 1 || req.auth_user_id == userId) {
        const query = await service.getUser(userId);
        if (query) {
            Response.successResponse(res, 201, true, "User found", query);
        } else {
            Response.errorResponse(res, 404, true, "Validation error", "User not found");
        }
    } else {
        Response.errorResponse(res, 403, false, "Validation error ocurred", "Unauthorized action");
    }
}

const register = async (req, res) => {
    try {
        const { name, last_name, email, password, password_confirmation } = req.body;
        const validateIfExist = await User.findOne({
            where: {
                email: email
            }
        });
        if (validateIfExist) {
            Response.errorResponse(res, 401, false, "Register failed", "There is already a registered user with this email address");
        } else {
            let validationData = {
                name: name,
                last_name: last_name,
                email: email,
                password: password
            }
            const validator = await validateData(validationData);
            if (validator['success']) {
                if (password != password_confirmation) {
                    Response.errorResponse(res, 401, false, "Register failed", "Password and password confirmation do not match");
                }
                
                const hashedPassword = await bcrypt.hash(password, 10);
                const data = {
                    name: name,
                    last_name: last_name,
                    email: email,
                    password: hashedPassword,
                    state: 1,
                    role_id: 2
                }
                const user = await service.createUser(data);
                Response.successResponse(res, 201, true, "Register successfully", null);
            } else {
                Response.errorResponse(res, 401, false, "Validation error ocurred", validator['errors']);
            }    
        }
    } catch (err) {
        Response.errorResponse(res, 500, false, "An inespered error ocurred", err.message);
    }
}

const updateUser = async (req, res) => {
    const userId = req.params.id;
    if (req.auth_role_id == 1 || req.auth_user_id == userId) {
        try {
            const { name, last_name, email, password, role_id, status } = req.body;
            const userData = await service.getUser(userId);
            let hashedPassword;
            if (password) {
                hashedPassword = await bcrypt.hash(password, 10);
            }
            const data = {
                name: name ? name : userData.name,
                last_name: last_name ? last_name : userData.last_name,
                email: email ? email : userData.email,
                password: password ? hashedPassword : userData.password,
                role_id: role_id ? role_id : userData.role_id,
                status: status ? status : userData.status
            }
            const query = await service.updateUser(userId, data);
            Response.successResponse(res, 200, true, "User updated successfully", query);
        } catch (err) {
            Response.errorResponse(res, 500, false, "An inespered error ocurred", err.message);
        }
    } else {
        Response.errorResponse(res, 403, false, "Validation error ocurred", "Unauthorized action");
    }
}

const deleteUser = async (req, res) => {
    const userId = req.params.id;
    if (req.auth_role_id == 1 || req.auth_user_id === userId) {
        const userData = await service.getUser(userId);
        if (userData) {
            try {
                const deleteUser = await service.deleteUser(userId);
                Response.successResponse(res, 200, true, "User deleted successfully", null);
            } catch (err) {
                Response.errorResponse(res, 500, false, "An inespered error ocurred", err.message);
            }
        } else {
            Response.errorResponse(res, 401, false, "An error ocurred", "User not found");
        }
    } else {
        Response.errorResponse(res, 500, false, "An inespered error ocurred", "Unauthorized action");
    }
}

const validateData = async (data) => {
    console.log()
    let errorMessages = [];
    let countErrors = 0;
    if (!data.name || data.name.length > 255) {
        errorMessages.push({
            title: "name is required with a maximum of 255 characters"
        });
        countErrors++;
    }
    if (!data.last_name || data.last_name.length > 255) {
        errorMessages.push({
            title: "last_name is required with a maximum of 255 characters"
        })
        countErrors++;
    }

    if (!data.email || data.email.length > 255) {
        errorMessages.push({
            title: "email is required with a maximum of 255 characters"
        })
        countErrors++;
    }

    if (!data.password || data.password.length > 255) {
        errorMessages.push({
            title: "password is required with a maximum of 255 characters"
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
    getUser,
    getUsers,
    register,
    updateUser,
    deleteUser
}