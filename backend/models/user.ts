import mongoose from 'mongoose';
import EventModel from './event';
import ToDoModel from './toDo';

const userSchema = new mongoose.Schema({
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

const User = mongoose.model('User', userSchema);
export default User;
