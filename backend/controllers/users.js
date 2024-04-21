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
const usersRouter = (0, express_1.Router)();
const populateQuery = [
    { path: 'events', select: 'title' },
    { path: 'toDos', select: 'description' },
];
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
    const dbUser = yield user_1.default.findById(id);
    res.json({
        success: true,
        user: dbUser,
    });
}));
// Get User Events by Username
usersRouter.get('/:username/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    const user = yield user_1.default.findOne({ username: username });
    console.log('backend get user events user:', user);
    if (user) {
        res.json({
            success: true,
            events: user.events,
        });
    }
    else {
        res.status(404).end();
    }
}));
// Get User ToDos by Username
usersRouter.get('/:username/toDos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    const user = yield user_1.default.findOne({ username: username });
    if (user) {
        res.json({
            toDos: user.toDos,
        });
    }
    else {
        res.status(404).end();
    }
}));
// Delete Event
usersRouter.put('/:username/events/:eventId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, eventId } = req.params;
    console.log('usersRouter put eventId:', eventId);
    const user = yield user_1.default.findOne({ username: username });
    if (user) {
        const { events } = user;
        const newEvents = events.filter((event) => event._id.toString() !== eventId);
        user.events = newEvents;
        yield user.save();
        res.json({
            success: true,
            events: newEvents,
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
