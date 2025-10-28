import path from 'path';
import { fileURLToPath } from 'url';
import { loadFeature, defineFeature } from 'jest-cucumber';
import request from 'supertest';
import app from '../src/bootstrap/app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TODO_DESCRIPTION = 'Test todo description';
const CURRENT_DATE = '2025-10-28T15:35:42.506Z';
let apiResponse;

const feature = loadFeature(path.resolve(__dirname, 'create-todo-given-a-user-is-on-the-todo-creation-screen-when.feature'));

defineFeature(feature, test => {
  test(
    "GIVEN a user is on the todo creation screen; WHEN the user enters a description and submits; THEN a 'Todo created' event is published.",
    ({ given, when, then }) => {
      given('a user is on the todo creation screen;', async () => {});

      when('the user enters a description and submits;', async () => {
        apiResponse = await request(app).post('/api/v1/create-todo').send({ "description": TODO_DESCRIPTION });
      });

      then("a 'Todo created' event is published.", async () => {
        expect(apiResponse.statusCode).toBe(200);
        expect(apiResponse.body).toHaveProperty('id');
        expect(apiResponse.body.description).toEqual(TODO_DESCRIPTION);
        expect(apiResponse.body).toHaveProperty('isCompleted');
        expect(apiResponse.body.isCompleted).toEqual('false');
      });
    }
  );
});