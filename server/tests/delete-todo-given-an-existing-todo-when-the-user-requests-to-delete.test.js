import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TODO_DESCRIPTION = 'Test todo description';
const CURRENT_DATE = '2025-10-28T15:35:42.508Z';
let apiResponse;
let todoId;

const feature = loadFeature(path.resolve(__dirname, 'delete-todo-given-an-existing-todo-when-the-user-requests-to-delete.feature'));

defineFeature(feature, test => {
  test(
    'GIVEN an existing Todo; WHEN the user requests to delete the Todo; THEN a \'Todo deleted\' event is published.',
    ({ given, when, then }) => {
      given('an existing Todo', async () => {
        const createResponse = await request(app)
          .post('/api/v1/create-todo')
          .send({ 'description': TODO_DESCRIPTION });
        expect(createResponse.statusCode).toBe(200);
        expect(createResponse.body).toBeDefined();
        expect(createResponse.body.id).toBeDefined();
        expect(createResponse.body.description).toEqual(TODO_DESCRIPTION);
        expect(createResponse.body.isCompleted).toBe('false');
        todoId = createResponse.body.id;
      });

      when('the user requests to delete the Todo', async () => {
        apiResponse = await request(app)
          .post('/api/v1/delete-todo')
          .send({ 'id': todoId });
      });

      then('a \'Todo deleted\' event is published.', async () => {
        expect(apiResponse.statusCode).toBe(200);
        expect(apiResponse.body).toBeDefined();
        expect(apiResponse.body.id).toEqual(todoId);
        expect(apiResponse.body.description).toEqual(TODO_DESCRIPTION);
        expect(apiResponse.body.isCompleted).toBe('false');
      });
    }
  );
});