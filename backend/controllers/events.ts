import { Response, Router } from 'express';
import EventModel from '../models/event';

const eventsRouter = Router();

// Get All Events
eventsRouter.get('/', async (req, res: Response) => {
  console.log('GET');
  const events = await EventModel.find({}).populate('user', { username: 1 });
  console.log('events:', events);
  res.json(events);
});

// Get Event by ID
eventsRouter.get('/:id', async (req, res: Response) => {
  const event = await EventModel.findById(req.params.id);
  if (event) res.json(event);
  else res.status(404).end();
});

// Add Event
eventsRouter.post('/', async (req, res: Response) => {
  console.log('POST');
  const { body, user } = req;

  if (!user) {
    return res.status(401).json({ error: 'missing or invalid token' });
  }

  const { event } = body;
  const { description, allDay, start, end } = event;

  const newEventModel = new EventModel({
    description,
    allDay,
    start,
    end,
    user: user.id,
  });

  user.events = user.events.concat(newEventModel);
  await user.save();
  res.status(201).json({
    newEventModel,
    success: true,
    message: 'Added event successfully',
    events: user.events,
  });
});

// Not sure if I need this -
// Right now events are deleted through usersRouter,
// but might want to verify token
eventsRouter.delete('/:id', async (req, res: Response) => {
  const { id } = req.params;
  const { user } = req;

  if (!user) {
    return res.status(401).json({
      error: 'missing or invalid token',
    });
  }

  const eventToDelete = await EventModel.findById(id);

  if (eventToDelete?.user?.toString() !== user.id.toString()) {
    res.status(401).end();
  } else {
    await EventModel.findByIdAndDelete(id);
    res.status(204).end();
  }
});

// Edit Event
eventsRouter.put('/:id', async (req, res: Response) => {
  const { id } = req.params;
  const { description, allDay, start, end } = req.body;

  const event = {
    description,
    allDay,
    start,
    end,
  };

  const updatedEventModel = await EventModel.findByIdAndUpdate(id, event, {
    new: true,
  });
  res.json(updatedEventModel);
});

export default eventsRouter;
