"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
    },
    passwordHash: {
        type: String,
        required: true,
        minLength: 4,
    },
    events: [],
    toDos: [],
});
userSchema.set('toJSON', {
    transform: (document, returnedUser) => {
        returnedUser.id = returnedUser._id.toString();
        delete returnedUser._id;
        delete returnedUser.__v;
        delete returnedUser.passwordHash;
    },
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
