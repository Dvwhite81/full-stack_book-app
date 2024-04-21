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
const toDo_1 = __importDefault(require("../models/toDo"));
const toDosRouter = (0, express_1.Router)();
toDosRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('GET');
    const toDos = yield toDo_1.default.find({}).populate('user', { username: 1 });
    console.log('toDos:', toDos);
    res.json(toDos);
}));
toDosRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const toDo = yield toDo_1.default.findById(req.params.id);
    if (toDo)
        res.json(toDo);
    else
        res.status(404).end();
}));
toDosRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('POST');
    const { body, user } = req;
    if (!user) {
        return res.status(401).json({ error: 'missing or invalid token' });
    }
    const { toDo } = body;
    const { title, color, urgency } = toDo;
    const newToDoModel = new toDo_1.default({
        title,
        color,
        urgency,
        user: user.id,
    });
    const savedToDoModel = yield newToDoModel.save();
    user.toDos = user.toDos.concat(savedToDoModel._id);
    yield user.save();
    res.status(201).json(savedToDoModel);
}));
toDosRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { user } = req;
    if (!user) {
        return res.status(401).json({
            error: 'missing or invalid token',
        });
    }
    const toDoToDelete = yield toDo_1.default.findById(id);
    if (((_a = toDoToDelete === null || toDoToDelete === void 0 ? void 0 : toDoToDelete.user) === null || _a === void 0 ? void 0 : _a.toString()) !== user.id.toString()) {
        res.status(401).end();
    }
    else {
        yield toDo_1.default.findByIdAndDelete(id);
        res.status(204).end();
    }
}));
toDosRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, color, urgency } = req.body;
    const toDo = {
        title,
        color,
        urgency,
    };
    const updatedToDoModel = yield toDo_1.default.findByIdAndUpdate(id, toDo, {
        new: true,
    });
    res.json(updatedToDoModel);
}));
exports.default = toDosRouter;
