"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
require("express-async-errors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../utils/config"));
const user_1 = __importDefault(require("../models/user"));
const populateQuery = [
    { path: 'booksRead' },
    { path: 'booksToRead' },
    { path: 'bookReviews' },
];
const usersRouter = (0, express_1.Router)();
// Get All Users
usersRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.find({}).populate(populateQuery);
    res.json(users);
}));
// Get User by Token
usersRouter.get('/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('usersRouter get params:', req.params);
    const { token } = req.params;
    console.log('token:', token);
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.SECRET);
    console.log('getByToken decoded:', decoded);
    const user = decoded;
    const { id } = user;
    const dbUser = yield user_1.default.findById(id).populate(populateQuery);
    res.json({
        success: true,
        user: dbUser,
    });
}));
// Get User Books by Username
usersRouter.get('/:username/books', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    const user = yield user_1.default.findOne({ username: username }).populate(populateQuery);
    if (user) {
        res.json({
            success: true,
            booksRead: user.booksRead,
            booksToRead: user.booksToRead,
            bookReviews: user.bookReviews,
        });
    }
    else {
        res.status(404).end();
    }
}));
// Delete User
usersRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.default.findByIdAndDelete(req.params.id);
    res.status(204).end();
}));
exports.default = usersRouter;
