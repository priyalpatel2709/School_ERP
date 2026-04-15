---
name: use-crud-operations
description: Create Express CRUD APIs by wiring existing crudOperations.js without rewriting CRUD logic. Use when generating model controllers/services with getAll, getById, create, updateById, deleteById, plus pagination, standard response format, and safer error handling.
---

# Use Existing CRUD Operations

Use this skill to generate APIs with the existing `crudOperations.js` layer.
Never duplicate or rewrite CRUD database logic that already exists in the shared helper.

## Inputs

- `Model Name: {{model}}`
- `Populate Fields: {{populate}}` (array; use `[]` if not needed)

## Core Rules

1. Do **not** rewrite CRUD logic.
2. Import and configure CRUD exactly once:

```js
const crud = crudOperations({
  mainModel: Model,
  populateModels: [],
});
```

3. Controller must use CRUD methods:
   - `getAll`
   - `getById`
   - `create`
   - `updateById`
   - `deleteById`
4. Keep architecture clean:
   - controller: request/response only
   - service: business orchestration (optional wrapper)
   - crudOperations: data access abstraction

## Required Additions (Always)

### Pagination (IMPORTANT)

- Support `page` and `limit` on list endpoints.
- Parse and sanitize query params before calling CRUD.
- Pass pagination values into CRUD/service wrapper.
- Avoid full collection fetch patterns.

### Standard Response Format

Return this shape from API handlers:

```json
{
  "success": true,
  "message": "string",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 0
  }
}
```

- Keep `success`, `message`, and `data` consistent in all handlers.
- Include `meta` (`page`, `limit`, `total`) for paginated responses.

### Error Handling Improvements

- Forward async errors to centralized middleware (`next(error)` pattern).
- Use `http-errors` for expected/typed failures.
- Do not leak raw/internal error details to clients.

## Generation Instructions

When generating for `{{model}}` and `{{populate}}`, output:

1. **Controller using crudOperations**
   - Imports model and `crudOperations`
   - Configures:

   ```js
   const crud = crudOperations({
     mainModel: Model,
     populateModels: {{populate}},
   });
   ```

   - Exposes handlers mapped to `crud.getAll`, `crud.getById`, `crud.create`, `crud.updateById`, `crud.deleteById`
   - Adds pagination parsing for `getAll`
   - Returns the standard response envelope
   - Uses centralized error forwarding

2. **Optional service wrapper (if needed)**
   - Performs light orchestration only (pagination defaults, message mapping, request shaping)
   - Calls CRUD methods (does not replace CRUD internals)
   - Keeps controller thin and focused on req/res

## Output Contract

The generated result must include:

- A controller using `crudOperations`
- Optional service wrapper when architecture requires it
- Clear handling of pagination, response envelope, and errors

## Quality Checklist

- [ ] No rewritten CRUD internals
- [ ] Uses configured `crudOperations` instance
- [ ] Includes `getAll`, `getById`, `create`, `updateById`, `deleteById`
- [ ] Supports `page` and `limit` pagination
- [ ] Uses standard response format
- [ ] Uses improved centralized error handling
- [ ] Optional service wrapper still delegates to CRUD
