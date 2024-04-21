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
const event_1 = __importDefault(require("../models/event"));
const eventsRouter = (0, express_1.Router)();
// Get All Events
eventsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('GET');
    const events = yield event_1.default.find({}).populate('user', { username: 1 });
    console.log('events:', events);
    res.json(events);
}));
// Get Event by ID
eventsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield event_1.default.findById(req.params.id);
    if (event)
        res.json(event);
    else
        res.status(404).end();
}));
// Add Event
eventsRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('POST');
    const { body, user } = req;
    if (!user) {
        return res.status(401).json({ error: 'missing or invalid token' });
    }
    const { event } = body;
    const { description, allDay, start, end } = event;
    const newEventModel = new event_1.default({
        description,
        allDay,
        start,
        end,
        user: user.id,
    });
    user.events = user.events.concat(newEventModel);
    yield user.save();
    res.status(201).json({
        newEventModel,
        success: true,
        message: 'Added event successfully',
        events: user.events,
    });
}));
// Not sure if I need this -
// Right now events are deleted through usersRouter,
// but might want to verify token
eventsRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { user } = req;
    if (!user) {
        return res.status(401).json({
            error: 'missing or invalid token',
        });
    }
    const eventToDelete = yield event_1.default.findById(id);
    if (((_a = eventToDelete === null || eventToDelete === void 0 ? void 0 : eventToDelete.user) === null || _a === void 0 ? void 0 : _a.toString()) !== user.id.toString()) {
        res.status(401).end();
    }
    else {
        yield event_1.default.findByIdAndDelete(id);
        res.status(204).end();
    }
}));
// Edit Event
eventsRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { description, allDay, start, end } = req.body;
    const event = {
        description,
        allDay,
        start,
        end,
    };
    const updatedEventModel = yield event_1.default.findByIdAndUpdate(id, event, {
        new: true,
    });
    res.json(updatedEventModel);
}));
exports.default = eventsRouter;
