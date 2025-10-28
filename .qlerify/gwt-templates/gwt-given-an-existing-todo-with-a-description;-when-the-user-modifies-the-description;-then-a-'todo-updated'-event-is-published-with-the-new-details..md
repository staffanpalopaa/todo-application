You will receive:
- GWT metadata for identification and file naming
- Example test code templates
- Swagger (OpenAPI 3.0.x) specification

## Rules
1. **The Golden Rule: OpenAPI is the ONLY Source of Truth for API Interaction**
   - All API endpoints, request/response bodies, JSON field names (e.g., `createdAt`), and data types used in the test code MUST come **exclusively** from the provided OpenAPI specification.
   - The GWT `description` field contains the Given-When-Then scenario text for the test scenario ONLY. When writing the test code, **you MUST IGNORE the casing and exact wording from the GWT description for field names.** For example, if the GWT says "...with a 'Task' longer than...", the test code must use the field `task` as defined in the spec.
   - **Server Base URL:** If the OpenAPI `servers[0].url` exists (e.g., `/api/v1`), **prefix every request path with it**.

2. **File Generation**
   - Generate code **only for one Given-When-Then scenario** specified in the GWT metadata.
   - Create two files: one `.feature` file and its corresponding `.test.js` file.
   - **File naming:** Use pattern `{eventDescription}-{first-10-words-of-description}` (e.g., `create-todo-given-a-user-wants-to-create-a-new-todo.feature`)
   - Always truncate description to first 10 words for filename consistency
   - Both files must be co-located in the `tests/` folder.
   - Do not generate, modify, or delete any other files.

3. **Test Data Rules**
   - Always use: `const TODO_DESCRIPTION = 'Test todo description';`
   - Always use: `const CURRENT_DATE = '{{ CURRENT_DATE }}';`
   - Use exact variable names: `apiResponse`, `TODO_DESCRIPTION`, `CURRENT_DATE`
   - Never vary test data or variable names

4. **Code Style Requirements**
   - Do NOT include comments in test code
   - Use single quotes for string literals
   - Use double quotes for JSON property names
   - Use exact variable naming patterns
   - NO comments anywhere in the generated code

5. **Feature File Content (.feature)**
   - The file must contain exactly one `Scenario`.
   - The scenario statement must match the **Given-When-Then statement exactly** from the context information—no paraphrasing.

6. **Implementation Order**
   - Import statements (exact order)
   - Constants (TODO_DESCRIPTION, CURRENT_DATE)
   - Variable declarations (apiResponse)
   - Test definition
   - Given step (no comments)
   - When step (API call)
   - Then step (assertions)

7. **Constant Placement Rule**
   - Place constants (`TODO_DESCRIPTION`, `CURRENT_DATE`) **outside** the `defineFeature` block
   - Place variable declarations (`let apiResponse`) **outside** the `defineFeature` block
   - Use empty function `async () => {}` for Given steps with no setup
   - Use direct object in `.send()` method: `.send({ "description": TODO_DESCRIPTION })`
   - Do NOT create intermediate variables for request bodies

8. **Test File Implementation (.test.js)**
   - **Dependencies & Setup:**
      - Use **jest-cucumber** and **supertest**.
      - Must be ES Modules (`import` syntax).
      - Use `import.meta.url` and `path.resolve()` to load the `.feature` file.
      - The Express app is assumed to be exported from `src/bootstrap/app.js`.
      - **Code Template Fidelity Rule (MANDATORY):**
        - You **MUST** copy the following setup **exactly**, without any renaming, typos, or added underscores:
          ```javascript
          import path from 'path';
          import { fileURLToPath } from 'url';
          import { loadFeature, defineFeature } from 'jest-cucumber';
          import request from 'supertest';
          import app from '../src/bootstrap/app.js';

          const __filename = fileURLToPath(import.meta.url);
          const __dirname = path.dirname(__filename);
          ```
        - Do **not** alter built-in Node import names (`path`, `fileURLToPath`) or introduce variants (e.g., `fileURLTo__filename`).
        - Use `loadFeature(path.resolve(__dirname, '<feature file url here>'))` exactly as shown.
   - **Data Handling:**
      - **ID Generation (Critical Exception):** For **`create`** operations, you **MUST NOT** include the `id` field in the request payload, even if the OpenAPI specification includes it. This rule **overrides** the "OpenAPI is Truth" rule. The backend is always responsible for generating IDs.
      - Never assume an entity exists unless explicitly stated in a "Given" step.
      - Always create required test data by making real API calls in the "Given" step definitions.
      - Never hardcode IDs. Always capture the ID from a creation response and reuse it in subsequent steps.
      - Do not send properties not defined in the OpenAPI request schema. Only send fields that the schema allows.
   - **Assertions:**
      - Verify outcomes by asserting against real API responses (status codes and body content).
      - All assertions about the API response structure must strictly match the OpenAPI specification (check **required** fields and any returned properties defined by the `schema`).
      - Available status codes for all operations are: **200**, **400**, and **404**. Only assert codes that are defined for the specific operation in the OpenAPI paths.
   - **Date:**
      - The current date is **{{ CURRENT_DATE }}** and should be used where relevant.
   - **Server Pathing:**
      - When sending requests, prefix endpoints with the first server URL from the OpenAPI (e.g., `request(app).post('/api/v1/update-todo')`).

9. **Template Integrity & Output Discipline**
   - **Copy-Exactly Rule:** You must copy the provided **Code Template** structure, imports, and setup **exactly**. Only replace placeholder comments and scenario strings.
   - **Syntax Integrity Rule:**
     - Do not introduce typos or extra underscores in identifiers (e.g., `fileURLToPath`, `__filename`, `__dirname`).
     - Ensure the ES Module syntax is correct and consistent.
   - **Validation Rule:**
     - Before finalizing, ensure all imported functions actually exist in Node’s standard library and that the test would compile under Node ESM with jest-cucumber.

##  Structure of GWT Metadata
- `id`: GWT identifier for file tagging (use in TAG line)
- `description`: The Given-When-Then scenario text (exact text to use in .feature file)
- `eventDescription`: The event/command this GWT tests (for file naming)

## Output Format
Use the following structure exactly:

=== FILE: tests/path/to/file.ext ===
=== TAG: gwt-<GWT_ID> ===
```javascript
<FILE CONTENT HERE>
```

## Formatting Requirements
- FILE and TAG labels must be ALL UPPERCASE, enclosed in triple equals (===).
- FILE = full path inside tests/, e.g. tests/create-todo-given-no-todo-exists.feature.
- TAG = gwt-<GWT_ID> where <GWT_ID> is from "Current Given-When-Then Information". Tag values must be ALL lowercase.
- Multiple tags may be chained with commas, but this prompt is for a single gwt.
- Output both the .feature file and its matching .test.js file.
- Output only new or modified files — do not include unchanged files.
- No explanations or comments — only file path, tag, and code block.
- Always wrap code in triple backticks and specify the language (javascript).
- **Important:** The `.feature` and `.test.js` files must reference each other by filename only (co-located in `tests/`), and the `app` import path must be exactly `../src/bootstrap/app.js` (relative to `tests/`).

**Preflight Checklist (apply silently before emitting output)**
- [ ] Endpoints are prefixed with `servers[0].url` from OpenAPI.
- [ ] `fileURLToPath` is spelled correctly; no `fileURLTo__filename`.
- [ ] `__filename` and `__dirname` are derived exactly from `fileURLToPath`.
- [ ] Only OpenAPI-defined fields are used in requests; `id` omitted for creates.
- [ ] Required fields and expected status codes match the OpenAPI operation.
- [ ] Feature scenario text matches **exactly** the GWT description.

**Code Template:**  
{{ EXAMPLE_CODE }}

**Old GWT Metadata:**  
{{ LEGACY_INFO }}

**Current GWT Metadata:**  
{{ LATEST_INFO }}

**OpenAPI Specification:**
```yaml
{{ SWAGGER_DOCUMENT }}
```

## Your task
1. Use the `eventDescription` and `description` to create the slugified file names
2. Use the `description` text EXACTLY as-is in the .feature file Scenario
3. Use OpenAPI specification for all API endpoint details and field names in test code
4. Tag both files with `gwt-<id>` where `<id>` comes from the metadata
5. Follow all rules above

