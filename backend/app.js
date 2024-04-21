"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./utils/config"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./utils/logger"));
const middleware_1 = __importDefault(require("./utils/middleware"));
const users_1 = __importDefault(require("./controllers/users"));
const register_1 = __importDefault(require("./controllers/register"));
const login_1 = __importDefault(require("./controllers/login"));
const events_1 = __importDefault(require("./controllers/events"));
const toDos_1 = __importDefault(require("./controllers/toDos"));
const app = (0, express_1.default)();
mongoose_1.default.set('strictQuery', false);
logger_1.default.info(`connecting to ${config_1.default.DB_URL}`);
mongoose_1.default
    .connect(config_1.default.DB_URL)
    .then(() => {
    logger_1.default.info('connected to DB');
})
    .catch((err) => {
    logger_1.default.error(`error connecting to DB: ${err.message}`);
});
app.use((0, cors_1.default)());
app.use(express_1.default.static('dist'));
app.use(express_1.default.json());
// app.use(middleware.tokenExtractor);
app.use(middleware_1.default.requestLogger);
app.use('/api/register', register_1.default);
app.use('/api/login', login_1.default);
app.use('/api/users', users_1.default);
app.use('/api/events', middleware_1.default.userExtractor, events_1.default);
app.use('/api/toDos', middleware_1.default.userExtractor, toDos_1.default);
app.use(middleware_1.default.unknownEndpoint);
app.use(middleware_1.default.errorHandler);
exports.default = app;
