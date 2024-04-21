import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
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

const EventModel = mongoose.model('EventModel', eventSchema);
export default EventModel;
