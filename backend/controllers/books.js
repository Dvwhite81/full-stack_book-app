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
const book_1 = __importDefault(require("../models/book"));
const user_1 = __importDefault(require("../models/user"));
const populateQuery = [
    { path: 'booksRead' },
    { path: 'booksToRead' },
    { path: 'bookReviews' },
];
const booksRouter = (0, express_1.Router)();
booksRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('GET');
    const books = yield book_1.default.find({}).populate('user', { username: 1 });
    console.log('books:', books);
    res.json(books);
}));
booksRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield book_1.default.findById(req.params.id);
    if (book)
        res.json(book);
    else
        res.status(404).end();
}));
// Not Sure if needed
booksRouter.post('/reviews', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('POST REVIEWS');
    const { body, user } = req;
    const dbUser = yield user_1.default.findById(user.id);
    console.log('dbUser:', dbUser);
    if (!dbUser) {
        return res.status(401).json({ error: 'missing or invalid token' });
    }
    const { book, score, reviewText } = body;
    const { bookId, volumeInfo } = book;
    console.log('BOOK:', book);
    console.log('SCORE', score);
    console.log('REVIEWTEXT:', reviewText);
    const newBookModel = new book_1.default({
        bookId,
        volumeInfo,
        userHasRead: true,
        userReview: {
            score,
            reviewText: reviewText || '',
        },
        user: dbUser.id,
    });
    const savedBookModel = yield newBookModel.save();
    dbUser.bookReviews = dbUser.bookReviews.concat(savedBookModel._id);
    yield dbUser.save();
    res.status(201).json(savedBookModel);
}));
booksRouter.post('/:type', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('POST TYPE');
    const { type } = req.params;
    const { body, user } = req;
    const { book } = body;
    const { id, searchInfo, volumeInfo } = book;
    const dbUser = yield user_1.default.findOne({ username: user.username }).populate(populateQuery);
    if (!user || !dbUser) {
        return res.status(401).json({ error: 'missing or invalid token' });
    }
    if (type === 'has-read') {
        const existingBook = yield book_1.default.findOne({ bookId: book.bookId });
        console.log('existing book:', existingBook);
        if (existingBook && existingBook.userHasRead) {
            return res.json({
                success: false,
                message: 'Book Already Saved!',
            });
        }
    }
    const newBookModel = new book_1.default({
        bookId: id,
        searchInfo,
        volumeInfo,
        userHasRead: type === 'has-read',
        user: dbUser.id,
    });
    const savedBookModel = yield newBookModel.save();
    if (type === 'has-read') {
        dbUser.booksRead = dbUser.booksRead.concat(savedBookModel._id);
    }
    else if (type === 'to-read') {
        dbUser.booksToRead = dbUser.booksToRead.concat(savedBookModel._id);
    }
    yield dbUser.save();
    res.status(201).json({
        success: true,
        message: 'Marked book read!',
        book: savedBookModel,
        hasRead: dbUser.booksRead,
    });
}));
booksRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { user } = req;
    if (!user) {
        return res.status(401).json({
            error: 'missing or invalid token',
        });
    }
    const bookToDelete = yield book_1.default.findById(id);
    if (((_a = bookToDelete === null || bookToDelete === void 0 ? void 0 : bookToDelete.user) === null || _a === void 0 ? void 0 : _a.toString()) !== user.id.toString()) {
        res.status(401).end();
    }
    else {
        yield book_1.default.findByIdAndDelete(id);
        res.status(204).end();
    }
}));
booksRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { bookId, volumeInfo } = req.body;
    const book = {
        bookId,
        volumeInfo,
    };
    const updatedBookModel = yield book_1.default.findByIdAndUpdate(id, book, {
        new: true,
    });
    res.json(updatedBookModel);
}));
exports.default = booksRouter;
