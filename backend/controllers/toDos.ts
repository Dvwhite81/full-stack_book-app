import { Response, Router } from 'express';
import ToDoModel from '../models/toDo';

const toDosRouter = Router();

toDosRouter.get('/', async (req, res: Response) => {
  console.log('GET');
  const toDos = await ToDoModel.find({}).populate('user', { username: 1 });
  console.log('toDos:', toDos);
  res.json(toDos);
});

toDosRouter.get('/:id', async (req, res: Response) => {
  const toDo = await ToDoModel.findById(req.params.id);
  if (toDo) res.json(toDo);
  else res.status(404).end();
});

toDosRouter.post('/', async (req, res: Response) => {
  console.log('POST');
  const { body, user } = req;

  if (!user) {
    return res.status(401).json({ error: 'missing or invalid token' });
  }

  const { toDo } = body;
  const { title, color, urgency } = toDo;

  const newToDoModel = new ToDoModel({
    title,
    color,
    urgency,
    user: user.id,
  });

  const savedToDoModel = await newToDoModel.save();
  user.toDos = user.toDos.concat(savedToDoModel._id);
  await user.save();
  res.status(201).json(savedToDoModel);
});

toDosRouter.delete('/:id', async (req, res: Response) => {
  const { id } = req.params;
  const { user } = req;

  if (!user) {
    return res.status(401).json({
      error: 'missing or invalid token',
    });
  }

  const toDoToDelete = await ToDoModel.findById(id);

  if (toDoToDelete?.user?.toString() !== user.id.toString()) {
    res.status(401).end();
  } else {
    await ToDoModel.findByIdAndDelete(id);
    res.status(204).end();
  }
});

toDosRouter.put('/:id', async (req, res: Response) => {
  const { id } = req.params;
  const { title, color, urgency } = req.body;

  const toDo = {
    title,
    color,
    urgency,
  };

  const updatedToDoModel = await ToDoModel.findByIdAndUpdate(id, toDo, {
    new: true,
  });
  res.json(updatedToDoModel);
});

export default toDosRouter;
