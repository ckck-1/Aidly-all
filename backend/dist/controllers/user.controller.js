"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUser = exports.getAllUsers = exports.updateHealthData = exports.updateMe = exports.getMe = void 0;
const user_model_1 = require("../models/user.model");
const errorHandler_1 = require("../middleware/errorHandler");
const getMe = async (req, res, next) => {
    try {
        const user = await user_model_1.User.findById(req.user.id);
        if (!user) {
            return next(new errorHandler_1.AppError('User not found', 404));
        }
        res.status(200).json({
            status: 'success',
            data: { user },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMe = getMe;
const updateMe = async (req, res, next) => {
    try {
        if ('password' in req.body) {
            return next(new errorHandler_1.AppError('This route is not for password updates. Please use /updatePassword.', 400));
        }
        const filteredBody = filterObj(req.body, 'name', 'email');
        const updatedUser = await user_model_1.User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true,
        });
        if (!updatedUser) {
            return next(new errorHandler_1.AppError('User not found', 404));
        }
        res.status(200).json({
            status: 'success',
            data: { user: updatedUser },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateMe = updateMe;
const updateHealthData = async (req, res, next) => {
    try {
        const healthData = filterObj(req.body, 'height', 'weight', 'bloodType', 'allergies', 'medications', 'conditions');
        const updatedUser = await user_model_1.User.findByIdAndUpdate(req.user.id, { healthData }, {
            new: true,
            runValidators: true,
        });
        if (!updatedUser) {
            return next(new errorHandler_1.AppError('User not found', 404));
        }
        res.status(200).json({
            status: 'success',
            data: { user: updatedUser },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateHealthData = updateHealthData;
const getAllUsers = async (req, res, next) => {
    try {
        const users = await user_model_1.User.find();
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: { users },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUsers = getAllUsers;
const getUser = async (req, res, next) => {
    try {
        const user = await user_model_1.User.findById(req.params.id);
        if (!user) {
            return next(new errorHandler_1.AppError('No user found with that ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: { user },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUser = getUser;
const deleteUser = async (req, res, next) => {
    try {
        const user = await user_model_1.User.findByIdAndDelete(req.params.id);
        if (!user) {
            return next(new errorHandler_1.AppError('No user found with that ID', 404));
        }
        res.status(204).json({
            status: 'success',
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};
//# sourceMappingURL=user.controller.js.map