import Todo from '../entity/Todo.js';
import db from '../../infrastructure/db/index.js';

class UpdateTodoCommand {
  static async execute({ id, description }) {
    const updatedTodo = await db.update('Todo', id, { description });
    return updatedTodo;
  }
}

export default UpdateTodoCommand;