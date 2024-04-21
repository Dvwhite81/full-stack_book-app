"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const eventSchema = new mongoose_1.default.Schema({
    description: {
        type: String,
        required: true,
    },
    allDay: {
        type: Boolean,
        required: true,
    },
    start: {
        type: Date,
        required: true,
    },
    end: {
        type: Date,
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
    },
});
eventSchema.set('toJSON', {
    transform: (document, returnedEvent) => {
        returnedEvent.id = returnedEvent._id.toString();
        delete returnedEvent._id;
        delete returnedEvent.__v;
    },
});
const EventModel = mongoose_1.default.model('EventModel', eventSchema);
exports.default = EventModel;
