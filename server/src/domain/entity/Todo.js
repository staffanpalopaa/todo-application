import { v4 as uuidv4 } from 'uuid';

class Todo {
  constructor({ id = uuidv4(), description, isCompleted = 'false' }) {
    if (!description) throw new Error('Description is required');

    this.id = id;
    this.description = description;
    this.isCompleted = isCompleted;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  update({ description, isCompleted }) {
    if (description !== undefined) {
      this.description = description;
    }
    if (isCompleted !== undefined) {
      this.isCompleted = isCompleted;
    }
    this.updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      description: this.description,
      isCompleted: this.isCompleted,
    };
  }
}

export default Todo;