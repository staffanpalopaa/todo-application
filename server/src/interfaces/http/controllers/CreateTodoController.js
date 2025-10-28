import express from 'express';
import CreateTodoCommand from '../../../domain/command/CreateTodoCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ message: 'description is required.' });
  }

  try {
    const result = await CreateTodoCommand.execute({ description });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/create-todo',
  router,
};