import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT;
const DB_URL = process.env.MONGODB_URI;
const SECRET = process.env.SECRET;

export default {
  DB_URL,
  PORT,
  SECRET,
};
