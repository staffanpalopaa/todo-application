import express from 'express';
import CompleteTodoCommand from '../../../domain/command/CompleteTodoCommand.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'id is required.' });
  }

  try {
    const result = await CompleteTodoCommand.execute({ id });
    res.status(200).json(result);
  } catch (err) {
    if (err.message === 'Todo not found.') {
      return res.status(404).json({ message: err.message });
    }
    res.status(400).json({ message: err.message });
  }
});

export default {
  routeBase: '/complete-todo',
  router,
};