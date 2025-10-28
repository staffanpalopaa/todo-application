import { v4 as uuidv4 } from 'uuid';
import db from '../../infrastructure/db/index.js';
import Todo from '../entity/Todo.js';

class CreateTodoCommand {
  static async execute({ description }) {
    const id = uuidv4();
    const todo = new Todo({ id, description, isCompleted: 'false' });
    await db.insert('Todo', todo.toJSON());
    return todo.toJSON();
  }
}

export default CreateTodoCommand;