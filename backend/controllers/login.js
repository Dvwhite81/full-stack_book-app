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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../utils/config"));
const user_1 = __importDefault(require("../models/user"));
const loginRouter = (0, express_1.Router)();
loginRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield user_1.default.findOne({ username });
    console.log('loginRouter user:', user);
    const correctPassword = user === null
        ? false
        : yield bcrypt_1.default.compare(password, user.passwordHash);
    if (!user || !correctPassword) {
        console.log('loginRouter returning error');
        return res.send({
            status: 401,
            success: false,
            message: 'Invalid username or password',
        });
    }
    console.log('loginRouter after error');
    const userForToken = {
        username: user.username,
        id: user._id,
    };
    const token = jsonwebtoken_1.default.sign(userForToken, config_1.default.SECRET, {
        expiresIn: 60 * 60,
    });
    res.status(200).send({
        token,
        success: true,
        message: 'Logged in successfully',
        user: user,
        events: user.events,
        toDos: user.toDos,
    });
}));
exports.default = loginRouter;
