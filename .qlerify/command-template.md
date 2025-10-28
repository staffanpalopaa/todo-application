You will receive:
- Current folder structure and tech stacks
- Existing **command-related** code files (before changes)
- Command metadata
- Swagger (OpenAPI 3.0.x) specification

## Rules
1. **The Golden Rule: OpenAPI is the ONLY Source of Truth for Code Structure**
   - All request/response schemas, JSON field names (e.g. `createdAt`), data types, and required properties MUST come **exclusively** from the provided OpenAPI specification.
   - The minimal metadata provides: command ID for tagging, description to locate the endpoint, entity name for imports.

2. **Business Logic Source**
   - Crucially, implement the business logic described in the `gwtDescriptions` array within the metadata. This is the primary source for the command's behavior (validations, side effects, constraints).
   - OpenAPI defines the API contract, `gwtDescriptions` defines what the command DOES.

3. **Scope - STRICTLY COMMAND-ORIENTED**
   - Generate code **only for one command** specified in the command metadata.
   - Do **not** generate, modify, or delete any unrelated files.
   - Do **not** generate, modify, or update any **Entity classes** (e.g., `Todo.js` or `User.js`), read models, queries, or any other domains outside of command handling.
   - Only files inside `src/domain/command` and `src/interfaces/http/controllers` may be updated or created.

4. **Strictness**
   - All request/response schemas, field names, data types, required properties, and descriptions must come **strictly from the provided OpenAPI Specification**.
   - The business logic, validations, and outcomes must come **strictly from the `gwtDescriptions`** in the metadata.
   - Do not invent fields, structures, or logic not explicitly defined in the specification or GWT descriptions.
   - Only implement logic for commands defined in the **paths** section with HTTP methods.
   - Use only status codes: **200**, **400** and **404**.

5. **Implementation - FOCUS ON COMMAND EXECUTION**
   - Assume that Entity classes (e.g., `new Todo(...)`) already exist and expect objects whose property names and casing already match the OpenAPI specification's schemas. **Do NOT generate or modify these Entity classes.** No mapping layer is needed between the controller's request body and the command/entity.
   - Database operations limited to: `insert`, `findAll`, `findById`, `update`, `remove`, `clear`.
   - For all database operations (e.g., `insert`, `findById`), the collection name (the first argument) **MUST** be the `associatedEntityName` from the metadata.
   - Use `uuid` to generate IDs for Create operations.
   - Database updates must use the corresponding Entity class.
   - Delete operations must return the deleted item, not just a success message.
   - Controller must export both `routeBase` and `router`.
   - Do **not** use route parameters — all input must come from the request body.
   - **Path Resolution for `db`:** When importing the `db` module into any command file located at `src/domain/command/`, the import path **MUST** be `../../infrastructure/db/index.js`. Always use this exact relative path for `db` imports in command files.

6. **File Naming Rules**
   - Command files: Use exact pattern `{CommandName}Command.js` (e.g., `CreateTodoCommand.js`)
   - Controller files: Use exact pattern `{CommandName}Controller.js` (e.g., `CreateTodoController.js`)
   - Import paths must match exact file names

7. **Validation Rules**
   - Input validation MUST occur in the controller layer before calling the command
   - Command classes should NOT contain input validation logic
   - Use exact validation pattern: `if (!field) return res.status(400).json({ message: 'Field is required.' });`
   - NO comments in command classes, even for OpenAPI compliance

8. **Code Style Requirements**
   - Do NOT include JSDoc comments or documentation
   - Use concise, functional programming style
   - NO inline comments explaining business logic
   - NO comments for type conversions
   - NO comments anywhere in the generated code

9. **File Path Rules**
   - Always use relative paths starting from `src/` (not `root/server/src/`)
   - Command files: `src/domain/command/{CommandName}Command.js`
   - Controller files: `src/interfaces/http/controllers/{CommandName}Controller.js`
   - Import paths must be relative to the file location

10. **Implementation Order**
    - Import statements (in alphabetical order)
    - Class declaration
    - Static execute method
    - Export statement
    - Controller: Import statements, router setup, route handler, export

## Structure of Command Metadata
- `id`: Command identifier for file tagging (use in TAG line)
- `description`: Command description to locate the endpoint in OpenAPI paths
- `gwtDescriptions`: Array of Given-When-Then scenarios defining business logic
- `associatedEntityName`: Name of the entity this command operates on (for imports)

## Output Format
Use the following structure exactly:

=== FILE: path/to/file.ext ===  
=== TAG: command-<COMMAND_ID> ===  
```javascript
<FILE CONTENT HERE>
```

## Formatting Requirements
- FILE and TAG labels must be ALL UPPERCASE, enclosed in triple equals (===).
- FILE = full path under src/, e.g. src/domain/command/CreateTodo.js.
- TAG = command-<COMMAND_ID> where <COMMAND_ID> is from "Current Command Information". Tag values must be ALL lowercase.
- Multiple tags may be chained with commas, but this prompt is for a single command.
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

Old Command Metadata:  
{{ LEGACY_INFO }}

Current Command Metadata:  
{{ LATEST_INFO }}

OpenAPI Specification:  
```yaml
{{ SWAGGER_DOCUMENT }}
```

## Your task
1. Use the `description` to find the corresponding POST endpoint in the OpenAPI `paths` section
2. Use the endpoint's request/response schemas for the API contract
3. Implement business logic from `gwtDescriptions` (validations, constraints, side effects)
4. Import the entity class using `associatedEntityName`
5. Use `associatedEntityName` as the database collection name
6. Tag files with `command-<id>` where `<id>` comes from the metadata
7. Follow all rules above

