You will receive:
- Current folder structure and tech stacks
- Existing **read model-related** code files (before changes)
- Read model metadata
- Swagger (OpenAPI 3.0.x) specification

## Rules
1. **The Golden Rule: OpenAPI is the ONLY Source of Truth for Code Structure**
   - All request/response schemas, JSON field names (e.g. `createdAt`), data types, and route paths MUST come **exclusively** from the provided OpenAPI specification.
   - The minimal metadata provides: IDs for tagging, description to locate the endpoint, entity name for database operations.

2. **Business Logic Source**
   - Crucially, the business logic for the query (filtering, sorting, data shaping) MUST be derived from the natural language requirements provided in the `allDescriptions` array in the metadata.
   - OpenAPI defines the API contract, `allDescriptions` defines how to filter/transform the data.

3. **Scope**
   - Generate code **only for one read model** specified in the read model metadata.
   - **Conflict Resolution:** If the descriptions in `allDescriptions` are contradictory, you must synthesize a single, coherent rule. Prioritize the most specific or logical requirement to resolve the conflict.
   - Do **not** generate unrelated files or touch other domains like commands or entities.
   - Only files inside `src/domain/readmodel` and `src/interfaces/http/controllers` may be updated or created.

4. **Strictness**
   - The query logic, including any specific data filtering or transformations, must come **strictly from the `allDescriptions` array** in the metadata.
   - Do not invent logic not explicitly defined in the specification or the provided descriptions.
   - Only implement logic for read models defined in the **paths** section with HTTP methods.
   - Use only status codes: **200**, **400** and **404**.

5. **Implementation**
   - Extract path parameters from the OpenAPI endpoint definition. Use the logic from `allDescriptions` to implement the filtering within the function body.
   - Assume the data structure of objects returned from the database already matches the OpenAPI schema.
   - Database operations are limited to: `insert`, `findAll`, `findById`, `update`, `remove`.
   - For all database operations (e.g., `findAll`, `findById`), the collection name (the first argument) **MUST** be the `associatedEntityName` from the metadata.
   - Controller must export both `routeBase` and `router`.
   - Route must match the read model name in **lowercase kebab-case** (e.g. `/get-all-todos`).
   - Do **not** use query parameters — all inputs must come from the path parameters.
   - **Path Resolution for `db`:** When importing the `db` module into any read model file located at `src/domain/readmodel/`, the import path **MUST** be `../../infrastructure/db/index.js`. Always use this exact relative path for `db` imports in read model files.

6. **File Naming Rules**
   - Read model files: Use exact pattern `{ReadModelName}ReadModel.js` (e.g., `GetAllTodosReadModel.js`)
   - Controller files: Use exact pattern `{ReadModelName}Controller.js` (e.g., `GetAllTodosController.js`)
   - Import paths must match exact file names

7. **Code Style Requirements**
   - Do NOT include JSDoc comments or documentation
   - Use concise, functional programming style
   - NO inline comments explaining business logic
   - NO comments for type conversions
   - NO comments anywhere in the generated code

8. **File Path Rules**
    - Always use relative paths starting from `src/` (not `root/server/src/`)
    - Read model files: `src/domain/readmodel/{ReadModelName}ReadModel.js`
    - Controller files: `src/interfaces/http/controllers/{ReadModelName}Controller.js`
    - Import paths must be relative to the file location

9. **Implementation Order**
    - Import statements (in alphabetical order)
    - Class declaration
    - Static query method
    - Export statement
    - Controller: Import statements, router setup, route handler, export

10. **Quote Style Rules**
    - Always use single quotes for string literals
    - Always use double quotes for JSON property names

11. **Tagging**
    - The `TAG` line for each generated file **MUST** contain a `readmodel-<ID>` tag for **every ID** present in the `allIds` array of the metadata.
    - All tags must be comma-separated. For example: `readmodel-abc-123, readmodel-def-456`.

## Structure of Read Model Metadata
- `allIds`: Array of read model identifiers for file tagging (tag with ALL of these)
- `description`: Read Model description to locate the endpoint in OpenAPI paths
- `allDescriptions`: Array of natural language requirements defining filtering/sorting logic
- `associatedEntityName`: Name of the entity this read model queries (for database collection name)

## Output Format
Use the following structure exactly:

=== FILE: path/to/file.ext ===  
=== TAG: readmodel-<READMODEL_ID> ===
```javascript
<FILE CONTENT HERE>
```

## Formatting Requirements
- FILE and TAG labels must be ALL UPPERCASE, enclosed in triple equals (===).
- FILE = full path under src/, e.g. `src/domain/readmodel/GetAllTodos.js`.
- TAG = A comma-separated list of tags, one for each ID in the `allIds` array, following the format `readmodel-<ID>`. Tag values must be ALL lowercase
- For deleted files, append (deleted) to the file path.
- Output only new or modified files — do not include unchanged files.
- Do not include explanations or comments — only file path, tag, and code block.
- Always wrap code in triple backticks and specify the language (```javascript).

Tech Stacks:  
{{ TECH_STACKS }}

Folder Structure:  
{{ FOLDER_STRUCTURE }}

Route Code:  
=== FILE: root/src/routes/index.js ===
```javascript
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const controllersPath = path.join(__dirname, '../interfaces/http/controllers');

const files = fs.readdirSync(controllersPath);

for (const file of files) {
  if (!file.endsWith('.js')) continue;

  const modulePath = pathToFileURL(path.join(controllersPath, file)).href;
  const controller = await import(modulePath);

  if (controller.default?.router && controller.default?.routeBase) {
    router.use(controller.default.routeBase, controller.default.router);
  }
}

export default router;
```

Database Operations:  
{{ DATABASE_OPERATIONS }}

Example Code:  
{{ EXAMPLE_CODE }}

Old Files:  
{{ ORIGINAL_FILES }}

Old Read Model Metadata:  
{{ LEGACY_INFO }}

Current Read Model Metadata:  
{{ LATEST_INFO }}

OpenAPI Specification:  
```yaml
{{ SWAGGER_DOCUMENT }}
```

## Your task
1. Use the `description` to find the corresponding GET endpoint in the OpenAPI `paths` section
2. Use the endpoint's response schema and path parameters for the API contract
3. Implement filtering/sorting logic from `allDescriptions`
4. Use `associatedEntityName` as the database collection name
5. Tag files with `readmodel-<id>` for EVERY id in `allIds` array (comma-separated)
6. Follow all rules above

