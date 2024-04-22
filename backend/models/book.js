"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bookSchema = new mongoose_1.default.Schema({
    bookId: {
        type: String,
        required: true,
    },
    volumeInfo: {
        type: Object,
        required: true,
    },
    userHasRead: {
        type: Boolean,
        required: true,
        default: false,
    },
    userReview: {
        score: {
            type: Number,
            required: false,
        },
        reviewText: {
            type: String,
            required: false,
        },
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
});
bookSchema.set('toJSON', {
    transform: (document, returnedBook) => {
        returnedBook.id = returnedBook._id.toString();
        delete returnedBook._id;
        delete returnedBook.__v;
    },
});
const BookModel = mongoose_1.default.model('BookModel', bookSchema);
exports.default = BookModel;
