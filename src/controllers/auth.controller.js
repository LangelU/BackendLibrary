const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const secretKey = "secret";
const sequelize = require("../libs/sequelize");
const {User, UserSchema} = require('../models/user.model');
const { Response } = require('../utilities/responseHandler');
const bcrypt = require('bcrypt');

app.use(express.json());

const login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            Response.errorResponse(res, 401, true, "Authentication failed", "email and password are required");
        } else {
            const user = await User.findOne({
                where: {
                    email: email
                }
            });
            if (!user) {
                Response.errorResponse(res, 401, true, "Authentication failed", "User not found");
            } else {
                const passwordMatch = await bcrypt.compare(password, user.password);
                if (!passwordMatch) {
                    Response.errorResponse(res, 400, true, "Authentication failed", "Invalid credentials");
                } else {
                    const token = jwt.sign({ role_id: user.role_id, user_id: user.id }, secretKey, { expiresIn: "1h" });
                    Response.successResponse(
                        res,
                        200,
                        true,
                        "Authentication successfull",
                        [
                            { 
                                name: user.name,
                                email: user.email,
                                role_id: user.role_id,
                                state: user.state
                            },
                            { token: token }
                        ]
                    );
                }   
            }
        }
    } catch (error) {
        Response.errorResponse(res, 500, true, "An inespered error ocurred", error.message);
    }
}
module.exports = {
    login
}

/* const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.findOne({
                where: {
                  email: email,
                  password: hashedPassword
                }
            }); */