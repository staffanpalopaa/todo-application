You will receive:
- Current folder structure and tech stacks
- Existing **entity-related** code files (before changes)
- Entity metadata for identification and tagging only
- Swagger (OpenAPI 3.0.x) specification

## Rules
1. **The Golden Rule: OpenAPI is the ONLY Source of Truth for Code**
   - The entity's properties, constructor parameters, and method signatures MUST come **exclusively** from the corresponding schema in the provided OpenAPI specification.
   - The minimal metadata (id, name) is provided ONLY for file tagging and finding the correct schema in the OpenAPI spec.

2. **Scope**
   - Generate code for **one entity only**, as specified in "Current Entity Information".
   - Implement only the entity's data structure and required methods (constructor, update, toJSON).
   - Do **not** generate commands, controllers, or read models.
   - The entity file must be located in `src/domain/entity`.

3. **Strictness**
   - Do not invent any properties, methods, or logic not directly implied by the OpenAPI schema and the provided example code.
   - Entities must be self-contained and must not import from other domains.
   - Do not output unchanged files.

4. **Implementation**
   - If the primary key of the entity is not named as `id` in the specification, then the generated entity MUST have an internal `id` property used for database operations (db.findById, db.update). This id should be a UUID and is a persistence-layer detail.
   - The internal id MAY NOT be part of the OpenAPI specification.
   - Use `uuid` for generating IDs in the constructor for new entities.
   - The entity class should represent the state and behavior of a single domain object.

5. **Code Style Requirements**
   - Do NOT include JSDoc comments or documentation
   - Use concise, functional programming style
   - Method signatures should use object destructuring for parameters
   - Update methods should NOT return the entity instance (no fluent interface)
   - NO inline comments explaining business logic
   - NO comments for type conversions

6. **Required Methods**
   - constructor: Initialize all properties from OpenAPI schema
   - update: Accept object with updatable properties, update internal state, set updatedAt timestamp
   - toJSON: Return plain object representation matching OpenAPI schema exactly

7. **Implementation Order**
   - Import statements (in alphabetical order)
   - Class declaration
   - Constructor method
   - Update method (always implement)
   - toJSON method
   - Export statement

8. **Date Handling Rules**
   - All date properties (createdAt, updatedAt) must be stored as Date objects internally
   - Only convert to ISO strings in the toJSON() method
   - Constructor defaults: createdAt = new Date(), updatedAt = new Date()
   - Update method: this.updatedAt = new Date()

## Structure of Entity Metadata
- `id`: Entity identifier for file tagging (use in TAG line)
- `name`: Entity name to locate the corresponding schema in the OpenAPI spec

## Output Format
Use the following structure exactly:

=== FILE: path/to/file.ext ===  
=== TAG: entity-<ENTITY_ID> ===
```javascript
<FILE CONTENT HERE>
```

## Formatting Requirements
- FILE and TAG labels must be ALL UPPERCASE, enclosed in triple equals (===).
- FILE = full path under src/, e.g. src/domain/entity/Todo.js.
- TAG = entity-<ENTITY_ID> where <ENTITY_ID> is from "Current Entity Information". Tag values must be ALL lowercase.
- Multiple tags may be chained with commas, but this prompt is for a single entity.
- For deleted files, append (deleted) to the file path.
- Output only new or modified files — do not include unchanged files.
- Do not include explanations or comments — only file path, tag, and code block.
- Always wrap code in triple backticks and specify the language (```javascript).

Tech Stacks:  
{{ TECH_STACKS }}

Folder Structure:  
{{ FOLDER_STRUCTURE }}

Database Operations:  
{{ DATABASE_OPERATIONS }}

Example Code:  
{{ EXAMPLE_CODE }}

Old Files:  
{{ ORIGINAL_FILES }}

Old Entity Metadata:  
{{ LEGACY_INFO }}

Current Entity Metadata:  
{{ LATEST_INFO }}

OpenAPI Specification:  
```yaml
{{ SWAGGER_DOCUMENT }}
```

## Your task
1. Use the `name` from Current Entity Metadata to find the schema in the OpenAPI `components.schemas` section
2. Generate entity code using ONLY the properties, types, and examples defined in that schema
3. Tag the generated file with `entity-<id>` where `<id>` comes from the metadata
4. Follow all rules above

