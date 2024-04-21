"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const toDoSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    urgency: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
});
toDoSchema.set('toJSON', {
    transform: (document, returnedToDo) => {
        returnedToDo.id = returnedToDo._id.toString();
        delete returnedToDo._id;
        delete returnedToDo.__v;
    },
});
const ToDoModel = mongoose_1.default.model('ToDoModel', toDoSchema);
exports.default = ToDoModel;
