---
name: optimize-crud
description: Optimize existing Express + Mongoose CRUD code for performance and safety. Use when improving CRUD handlers/services, reducing query cost, adding pagination, preventing ObjectId crashes, or hardening query logic.
---

# Optimize Existing CRUD Code

## Purpose

Improve existing CRUD operations without rewriting the current architecture.

## Apply This Skill When

- User asks to optimize existing CRUD code
- List/read endpoints fetch too much data
- Queries are missing `.lean()` or projection
- Invalid ids can crash `findById` or `_id` filters
- Pagination behavior is missing or inconsistent

## Optimization Checklist

1. Keep existing structure (`controllers -> services -> crudOperations`).
2. Add `.lean()` to read operations where Mongoose documents are not required.
3. Add pagination with `page` and `limit` in list endpoints.
4. Add `.select()` to reduce payload size.
5. Validate ObjectId before id-based queries.
6. Improve error handling with safe and consistent responses.
7. Optimize `populate` usage to only required fields.

## Implementation Rules

- Do not duplicate CRUD logic already handled in `crudOperations`.
- Keep controllers focused on request/response handling.
- Apply business/query optimizations in services or data layer utilities.
- Keep response format consistent with project conventions.
- Avoid full collection reads when pagination is expected.

## Input Template

```text
{{crud_code}}
```

## Output Requirements

- Optimized version of the CRUD code
- Short explanation of what changed and why
- Explicit mention of:
  - `.lean()` usage
  - pagination (`page`, `limit`)
  - projection via `.select()`
  - ObjectId safety improvements
  - `populate` optimization
