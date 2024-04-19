const { User } = require("../models/user.model");
const UsersService = require("../services/user.service");
const { Response } = require("../utilities/responseHandler");
const { Op } = require('sequelize');

const bcrypt = require('bcrypt');

const service = new UsersService();

const getUsers = async (req, res) => {
    if (req.auth_user_id == 1) {
        try {
            const {name, last_name, email} = req.body;
            let query;
            if (!name && !last_name && !email) {
                query = await service.getUsers();
            } else {
                //Apply filters
                let whereClause = {};
                if (name && last_name) {
                    whereClause = {
                        name: { [Op.like]: `%${name}%` },
                        last_name: { [Op.like]: `%${last_name}%` }
                    };
                } else if (name) {
                    whereClause = {
                        name: { [Op.like]: `%${name}%` }
                    };
                } else if (last_name) {
                    whereClause = {
                        last_name: { [Op.like]: `%${last_name}%` }
                    };
                } else if (email) {
                    whereClause = {
                        email: { [Op.like]: `%${email}%` }
                    };
                }
                query = await User.findAll({
                    where: whereClause
                })
            }
            if (query.length == 0) {
                return Response.successResponse(res, 404, true, "Users not found", null);
            }
            return Response.successResponse(res, 200, true, "Users founded", query);
        } catch (err) {
            return Response.errorResponse(res, 500, false, "An inespered error ocurred", err.message)
        }
    } else {
        return Response.errorResponse(res, 401, false, "An error ocurred", "Unauthorized action");
    }
}

const getUser = async (req, res) => {
    const userId = req.params.id;
    if (req.auth_role_id == 1 || req.auth_user_id == userId) {
        const query = await service.getUser(userId);
        if (!query) {
            return Response.errorResponse(res, 404, true, "Validation error", "User not found");
        }
        return Response.successResponse(res, 200, true, "User found", query);
    } else {
        return Response.errorResponse(res, 403, false, "Validation error ocurred", "Unauthorized action");
    }
}

const register = async (req, res) => {
    try {
        const { name, last_name, email, password, password_confirmation } = req.body;
        if (!name) {
            return Response.errorResponse(res, 403, false, "Validation error", "The field name is required")
        }
        if (!last_name) {
            return Response.errorResponse(res, 403, false, "Validation error", "The field last_name is required")
        }
        if (!email) {
            return Response.errorResponse(res, 403, false, "Validation error", "The field email is required")
        }
        if (!password) {
            return Response.errorResponse(res, 403, false, "Validation error", "The field password is required")
        }
        const validateIfExist = await User.findOne({
            where: {
                email: email
            }
        });
        if (validateIfExist) {
            return Response.errorResponse(res, 400, false, "Register failed", "There is already a registered user with this email address");
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
                    return Response.errorResponse(res, 401, false, "Register failed", "Password and password confirmation do not match");
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
                return Response.successResponse(res, 201, true, "Register successfully", null);
            } else {
                return Response.errorResponse(res, 401, false, "Validation error ocurred", validator['errors']);
            }    
        }
    } catch (err) {
        return Response.errorResponse(res, 500, false, "An inespered error ocurred", err.message);
    }
}

const updateUser = async (req, res) => {
    const userId = req.params.id;
    if (req.auth_role_id == 1 || req.auth_user_id == userId) {
        try {
            const { name, last_name, email, password, role_id, status } = req.body;
            if (!name) {
                return Response.errorResponse(res, 403, false, "Validation error", "The field name is required")
            }
            if (!last_name) {
                return Response.errorResponse(res, 403, false, "Validation error", "The field name is required")
            }
            if (!email) {
                return Response.errorResponse(res, 403, false, "Validation error", "The field name is required")
            }
            if (!password) {
                return Response.errorResponse(res, 403, false, "Validation error", "The field name is required")
            }
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
            return Response.successResponse(res, 200, true, "User updated successfully", query);
        } catch (err) {
            return Response.errorResponse(res, 500, false, "An inespered error ocurred", err.message);
        }
    } else {
        return Response.errorResponse(res, 401, false, "Validation error ocurred", "Unauthorized action");
    }
}

const deleteUser = async (req, res) => {
    const userId = req.params.id;
    if (req.auth_role_id == 1 || req.auth_user_id === userId) {
        const userData = await service.getUser(userId);
        if (!userData) {
            return Response.errorResponse(res, 401, false, "An error ocurred", "User not found");
        }

        try {
            const deleteUser = await service.deleteUser(userId);
            return Response.successResponse(res, 200, true, "User deleted successfully", null);
        } catch (err) {
            return Response.errorResponse(res, 500, false, "An inespered error ocurred", err.message);
        }
    } else {
        Response.errorResponse(res, 401, false, "An inespered error ocurred", "Unauthorized action");
    }
}

const validateData = async (data) => {
    console.log()
    let errorMessages = [];
    let countErrors = 0;
    if (data.name.length > 255) {
        errorMessages.push({
            title: "the maximum number of characters for the field name is 255"
        });
        countErrors++;
    }
    if (data.last_name.length > 255) {
        errorMessages.push({
            title: "the maximum number of characters for the field last_name is 255"
        })
        countErrors++;
    }

    if (data.email.length > 255) {
        errorMessages.push({
            title: "the maximum number of characters for the field email is 255"
        })
        countErrors++;
    }

    if (data.password.length > 255) {
        errorMessages.push({
            title: "the maximum number of characters for the field password is 255"
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