const { validationResult } = require("express-validator");
const Users = require("../models/User");

const userController = {
    async register(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, email, phone, role, password } = req.body;

            const existingUser = await Users.findOne({ email });
            if (existingUser) {
                return res
                    .status(400)
                    .json({ status: 400, message: "User already exists" });
            }

            const user = new Users({ name, email, phone, role, password });
            const result = await user.save();

            return res.status(201).json({
                status: 201,
                message: "User registered successfully",
                result,
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ status: 500, error });
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;

            const existingUser = await Users.findOne({ email });
            if (!existingUser) {
                return res
                    .status(400)
                    .json({ status: 400, message: "User does not exist" });
            }

            const isMatch = await existingUser.comparePassword(password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ status: 400, message: "Invalid Credentials" });
            }

            const token = await existingUser.generateAuthToken();

            res.cookie("accessToken", token, {
                expires: new Date(
                    new Date().getTime() + 1000 * 60 * 60 * 24 * 10
                ),
            });
            // res.cookie("accessToken", token, { httpOnly: true ,expires: new Date(new Date().getTime()+ 1000 * 60 * 60 * 24 * 10) ,secure: false, sameSite: 'none' });
            res.status(200).json({
                status: 200,
                message: "User logged in successfully",
                data: {
                    _id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    phone: existingUser.phone,
                    role: existingUser.role,
                    token,
                },
            });
        } catch (error) {
            return res.status(500).json({ status: 500, error });
        }
    },
    async getAuthenticatedUser(req, res) {
        try {
            const user = req.user;

            const userData = await Users.findById(user._id)
                .select("-password")
                .select("-createdAt")
                .select("-updatedAt")
                .select("-__v");
            return res.status(200).json({status: 200, message: "User found", data:userData})

        } catch (error) {
            return res.status(500).json({ status: 500, error });
        }
    },
    async getAllUsers(req, res) {
        try {
            const { page, limit } = req.query;
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);

            const users = await Users.find({isActive:true})
                .collation({ locale: "en", strength: 2 })
                .sort({ name: 1 })
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum);

            return res.status(200).json({
                status: 200,
                message: "User fetched successfully",
                data: users,
            });
        } catch (error) {
            res.status(500).json({ status: 500, error });
        }
    },

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            await Users.findOneAndUpdate({ _id: id }, { isActive: false })
            return res.status(202).json({
                status: 202,
                message: "User deleted successfully",
                data: null,
            });
        } catch (error) {
            res.status(500).json({ status: 500, error });
        }
    },

    async changePassword(req, res) {
        try {
            const { oldPassword, newPassword ,userId} = req.body;
            if(userId!==req.user._id){
                return res.status(401).json({
                    status: 401,
                    message: "Unautorized",
                });
            }
            const user = await Users.findById(req.user._id);
            if (!user) {
                return res.status(400).json({
                    status: 400,
                    message: "User not found",
                    data: null,
                });
            }
            const isMatch = await user.comparePassword(oldPassword);
            if (!isMatch) {
                return res
                    .status(400)
                    .json({ status: 400, message: "Invalid Credentials" });
            }
            user.password = newPassword;
            await user.save();
            return res.status(202).json({
                status: 202,
                message: "Password updated successfully",
                data: null,
            });
        } catch (error) {
            res.status(500).json({ status: 500, error });
        }
    },
};

module.exports = userController;