import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feature = loadFeature(path.resolve(__dirname, 'update-todo-given-an-existing-todo-with-a-description-when-the.feature'));

const TODO_DESCRIPTION = 'Test todo description';
const CURRENT_DATE = '2025-10-28T15:35:42.506Z';
let apiResponse;
let todoId;

defineFeature(feature, test => {
  test(
    'GIVEN an existing Todo with a description; WHEN the user modifies the description; THEN a \'Todo updated\' event is published with the new details.',
    ({ given, when, then }) => {
      given('an existing Todo with a description', async () => {
        apiResponse = await request(app)
          .post('/api/v1/create-todo')
          .send({ 'description': TODO_DESCRIPTION });
        expect(apiResponse.status).toBe(200);
        expect(apiResponse.body.id).toBeDefined();
        todoId = apiResponse.body.id;
      });

      when('the user modifies the description', async () => {
        apiResponse = await request(app)
          .post('/api/v1/update-todo')
          .send({ 'id': todoId, 'description': 'Updated ' + TODO_DESCRIPTION });
      });

      then('a \'Todo updated\' event is published with the new details', async () => {
        expect(apiResponse.status).toBe(200);
        expect(apiResponse.body).toEqual(
          expect.objectContaining({
            'id': todoId,
            'description': 'Updated ' + TODO_DESCRIPTION,
            'isCompleted': expect.any(String)
          })
        );
      });
    }
  );
});