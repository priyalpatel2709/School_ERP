---
name: safe-query
description: Harden dynamic query logic in Express + Mongoose APIs. Use when implementing or reviewing getByField-style endpoints, sanitizing query params, validating ObjectId input, preventing Mongo injection, and returning safe validation errors.
---

# Secure Dynamic Query (getByField)

## Purpose

Secure dynamic query APIs so they remain flexible without exposing injection or validation risks.

## Apply This Skill When

- Building endpoints with dynamic filters (for example, `getByField`)
- Reviewing query params taken directly from `req.query` or `req.params`
- User asks to prevent Mongo injection or unsafe filtering
- Existing code allows arbitrary fields/operators from user input

## Security Checklist

1. Allow only whitelisted query fields.
2. Reject unknown fields and disallowed operators.
3. Sanitize incoming values before query construction.
4. Validate ObjectId values before id-based filtering.
5. Enforce type checks for expected field types (string, number, boolean, date).
6. Return safe, clear validation errors without exposing internals.

## Implementation Rules

- Keep controllers focused on request/response only.
- Put validation/sanitization logic in services or helpers.
- Use `express-validator` for input validation where applicable.
- Prevent direct pass-through of user-provided query objects to Mongoose.
- Keep response format aligned with project conventions.

## Input Template

```text
{{query_logic}}
```

## Output Requirements

- Secure version of the query logic
- Validation and sanitization logic
- Explicit mention of:
  - allowed field whitelist
  - injection prevention strategy
  - ObjectId validation handling
  - graceful invalid-query response behavior
