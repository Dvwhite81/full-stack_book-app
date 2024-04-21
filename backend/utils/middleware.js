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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = __importDefault(require("./logger"));
const user_1 = __importDefault(require("../models/user"));
const requestLogger = (req, res, next) => {
    console.log('logger');
    logger_1.default.info('Method:', req.method);
    logger_1.default.info('Path:  ', req.path);
    logger_1.default.info('Body:  ', req.body);
    logger_1.default.info('---');
    next();
};
const unknownEndpoint = (req, res) => {
    res.status(404).send({
        error: 'unknown endpoint',
    });
};
const errorHandler = (error, req, res, next) => {
    logger_1.default.error(error.message);
    console.log('name:', error.name);
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    }
    else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }
    else if (error.name === 'MongoServerError' &&
        error.message.includes('E11000 duplicate key error')) {
        return res.status(400).json({ error: 'expected `username` to be unique' });
    }
    else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'token expired' });
    }
    next(error);
};
const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization');
    console.log('authorization:', authorization);
    if (authorization && authorization.startsWith('Bearer ')) {
        console.log('yes');
        return authorization.replace('Bearer ', '');
    }
    console.log('no');
    next();
};
const userExtractor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = tokenExtractor(req, res, next);
    console.log('FIRST token:', token);
    if (!token) {
        return next();
    }
    console.log('userExtractor token:', token);
    console.log('req:', req);
    const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET);
    console.log('decodedToken:', decodedToken);
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'invalid token' });
    }
    const userId = decodedToken.id;
    const user = yield user_1.default.findById(userId);
    if (user) {
        req.user = user;
    }
    next();
});
exports.default = {
    errorHandler,
    requestLogger,
    tokenExtractor,
    unknownEndpoint,
    userExtractor,
};
