import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TODO_DESCRIPTION = 'Test todo description';
const CURRENT_DATE = '2025-10-28T15:35:42.507Z';

let apiResponse;
let todoId;

const feature = loadFeature(path.resolve(__dirname, 'complete-todo-given-an-existing-todo-that-is-not-yet-completed-when-the-user-marks.feature'));

defineFeature(feature, test => {
  test(
    'GIVEN an existing Todo that is not yet completed; WHEN the user marks the Todo as completed; THEN a \'Todo completed\' event is published.',
    ({ given, when, then }) => {
      given('an existing Todo that is not yet completed', async () => {
        const createResponse = await request(app)
          .post('/api/v1/create-todo')
          .send({ "description": TODO_DESCRIPTION });

        expect(createResponse.status).toBe(200);
        expect(createResponse.body).toHaveProperty('id');
        expect(createResponse.body).toHaveProperty('description', TODO_DESCRIPTION);
        expect(createResponse.body).toHaveProperty('isCompleted', 'false');

        todoId = createResponse.body.id;
      });

      when('the user marks the Todo as completed', async () => {
        apiResponse = await request(app)
          .post('/api/v1/complete-todo')
          .send({ "id": todoId });
      });

      then('a \'Todo completed\' event is published.', async () => {
        expect(apiResponse.status).toBe(200);
        expect(apiResponse.body).toHaveProperty('id', todoId);
        expect(apiResponse.body).toHaveProperty('description', TODO_DESCRIPTION);
        expect(apiResponse.body).toHaveProperty('isCompleted', 'true');
      });
    }
  );
});