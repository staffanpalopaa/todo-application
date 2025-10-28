import db from '../../infrastructure/db/index.js';

class CompleteTodoCommand {
  static async execute({ id }) {
    const associatedEntityName = 'Todo';

    const existingTodo = await db.findById(associatedEntityName, id);

    if (!existingTodo) {
      throw new Error('Todo not found.');
    }

    if (existingTodo.isCompleted === 'true') {
      throw new Error('Todo is already completed.');
    }

    const updatedTodo = await db.update(associatedEntityName, id, { isCompleted: 'true' });
    return updatedTodo;
  }
}

export default CompleteTodoCommand;