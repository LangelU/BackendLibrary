const UsersService = require("../services/user.service");
const { Response } = require("../utilities/responseHandler");

const bcrypt = require('bcrypt');

const service = new UsersService();

const getUsers = async (req, res) => {
    try {
        const query = await service.getUsers();
        if (req.user_id == 1) {
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

const register = async (req, res) => {
    try {
        const { name, last_name, email, password, passwordConfirmation } = req.body;
        if (password != passwordConfirmation) {
            Response.errorResponse(res, 401, false, "Register failed", "Password and password confirmation not match");
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
    } catch (err) {
        Response.errorResponse(res, 500, false, "An inespered error ocurred", err.message);
    }
}

const updateUser = async (req, res) => {
    try {
        const { name, last_name, email, password, role_id, status } = req.body;
        const userId = req.user_id;
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
        const update = await service.updateUser(userId, data);
        Response.successResponse(res, 200, true, "User updated successfully", null);
    } catch (err) {
        Response.errorResponse(res, 500, false, "An inespered error ocurred", err.message);
    }
}

module.exports = {
    getUsers,
    register,
    updateUser
}