# Transport Route Complete Documentation

This document explains `transportRoute.js` in detail: how to use each endpoint, where to use it in ERP screens, request examples, and route/vehicle workflow.

## Module Overview

- Route file: `routes/transportRoute.js`
- Controller file: `controllers/transportController.js`
- Models:
  - `models/transportRouteModel.js`
  - `models/transportVehicleModel.js`
- Base API path: `/api/v1/transport`

This module has two domains:

1. Bus routes (`/bus-routes`)
2. Vehicles (`/vehicles`)

---

## Middleware and Access

All transport endpoints use:

1. `identifyTenant`
2. `protect`

Important note:

- There is no `authorize(...)` permission check currently on these routes.
- Any authenticated user in tenant context can access them unless permission guards are added.

---

## Data Models

## 1) Transport Route Model

Main fields:

- `name` (String, required)
- `academicYear` (String, required)
- `stops[]`:
  - `name` (String, required)
  - `pickupTime` (String, optional)
  - `latitude` (Number, optional)
  - `longitude` (Number, optional)
- `assignedVehicle` (ObjectId ref: `TransportVehicle`)
- `isActive` (Boolean, default `true`)
- `metaData[]`

## 2) Transport Vehicle Model

Main fields:

- `registrationNumber` (String, required, unique)
- `makeModel` (String)
- `capacity` (Number, required, min `1`)
- `driverName` (String)
- `driverPhone` (String)
- `gpsDeviceId` (String)
- `isActive` (Boolean, default `true`)
- `route` (ObjectId ref: `TransportRoute`)
- `metaData[]`

---

## Endpoints (How to Use + Where to Use)

## Bus Route APIs

### 1) Create Bus Route

`POST /api/v1/transport/bus-routes`

- Purpose: Create a transport route with optional stops and vehicle assignment
- Controller: `createBusRoute`

Request example:

```json
{
  "name": "Route A - North Zone",
  "academicYear": "2026-2027",
  "stops": [
    {
      "name": "Main Chowk",
      "pickupTime": "07:10 AM",
      "latitude": 26.9124,
      "longitude": 75.7873
    },
    {
      "name": "Sector 9 Circle",
      "pickupTime": "07:25 AM"
    }
  ],
  "assignedVehicle": "665555555555555555555555",
  "isActive": true
}
```

Where to use:

- Transport admin route creation form
- New academic year route setup workflow

---

### 2) List Bus Routes

`GET /api/v1/transport/bus-routes`

- Purpose: Get all routes
- Controller: `listBusRoutes`
- Optional query:
  - `academicYear`

Example:

- `GET /api/v1/transport/bus-routes?academicYear=2026-2027`

Behavior:

- Populates `assignedVehicle`
- Response pattern:

```json
{
  "success": true,
  "data": []
}
```

Where to use:

- Route listing grid
- Route planner by academic year

---

### 3) Get Bus Route by ID

`GET /api/v1/transport/bus-routes/:id`

- Purpose: Get one route detail
- Controller: `getBusRouteById`
- Behavior:
  - Populates `assignedVehicle`
  - Returns `404` if not found

Where to use:

- Route details page
- Assign/review route screen

---

### 4) Update Bus Route

`PUT /api/v1/transport/bus-routes/:id`

- Purpose: Update route details/stops/assignment
- Controller: `updateBusRoute`
- Behavior:
  - Uses `findByIdAndUpdate(..., { new: true, runValidators: true })`
  - Returns `404` if not found

Where to use:

- Route edit page
- Operational updates (new stop, timing change, vehicle reassignment)

---

### 5) Delete Bus Route

`DELETE /api/v1/transport/bus-routes/:id`

- Purpose: Delete route
- Controller: `deleteBusRoute`
- Response:

```json
{ "success": true }
```

- Returns `404` if not found

Where to use:

- Route cleanup/archive management

---

## Vehicle APIs

### 6) Create Vehicle

`POST /api/v1/transport/vehicles`

- Purpose: Register a transport vehicle
- Controller: `createVehicle`

Request example:

```json
{
  "registrationNumber": "RJ14-AB-1234",
  "makeModel": "Tata Starbus 40",
  "capacity": 40,
  "driverName": "Ramesh Sharma",
  "driverPhone": "+919876543210",
  "gpsDeviceId": "GPS-DEV-1008",
  "route": "666666666666666666666666",
  "isActive": true
}
```

Where to use:

- Fleet onboarding
- Vehicle registry module

---

### 7) List Vehicles

`GET /api/v1/transport/vehicles`

- Purpose: List all vehicles
- Controller: `listVehicles`
- Behavior:
  - Populates `route` reference
  - Returns `{ success, data }`

Where to use:

- Fleet list page
- Driver/vehicle assignment dashboard

---

### 8) Get Vehicle by ID

`GET /api/v1/transport/vehicles/:id`

- Purpose: Get one vehicle with route detail
- Controller: `getVehicleById`
- Behavior:
  - Populates `route`
  - Returns `404` if not found

Where to use:

- Vehicle profile/details screen

---

### 9) Update Vehicle

`PUT /api/v1/transport/vehicles/:id`

- Purpose: Update vehicle metadata/driver/route
- Controller: `updateVehicle`
- Behavior:
  - `findByIdAndUpdate(..., { new: true, runValidators: true })`
  - Returns `404` if not found

Where to use:

- Driver change
- Capacity or status updates
- Route reassignment

---

### 10) Delete Vehicle

`DELETE /api/v1/transport/vehicles/:id`

- Purpose: Delete vehicle
- Controller: `deleteVehicle`
- Response:

```json
{ "success": true }
```

- Returns `404` if not found

Where to use:

- Fleet retirement/decommission workflow

---

## End-to-End Operational Flows

## A) New Year Transport Setup

1. Create vehicles (`POST /vehicles`)
2. Create bus routes (`POST /bus-routes`)
3. Assign vehicles to routes using:
   - route field in vehicle, or
   - assignedVehicle in bus route
4. Verify through list endpoints with populated references

## B) Daily Operations Update

1. Fetch routes by academic year
2. Update stop timings and assignments
3. Update driver details when changed

---

## Common Errors and Validation

Common failure cases:

- `404 Not found` on get/update/delete with invalid/non-existing id
- Mongoose validation failures for required fields:
  - route name
  - route academicYear
  - vehicle registrationNumber
  - vehicle capacity
- Duplicate `registrationNumber` because it is unique

---

## Implementation Notes

- Route and vehicle assignment can exist on both models (`assignedVehicle` and `route`).
- Keep these in sync at service/business layer or in client workflow rules.
- Current implementation is CRUD-focused and does not enforce bidirectional sync automatically.

---

## Security Recommendations

Since `transportRoute.js` currently uses only `protect`:

- Add role/permission checks for transport admin users.
- Restrict delete endpoints to admin/super-admin.
- Add audit logs for route/vehicle create/update/delete in production.

---

## Quick Reference Table

| Method | Endpoint | Current Guard | Use Case |
|---|---|---|---|
| POST | `/api/v1/transport/bus-routes` | `identifyTenant + protect` | Create route |
| GET | `/api/v1/transport/bus-routes` | `identifyTenant + protect` | List routes |
| GET | `/api/v1/transport/bus-routes/:id` | `identifyTenant + protect` | Route detail |
| PUT | `/api/v1/transport/bus-routes/:id` | `identifyTenant + protect` | Update route |
| DELETE | `/api/v1/transport/bus-routes/:id` | `identifyTenant + protect` | Delete route |
| POST | `/api/v1/transport/vehicles` | `identifyTenant + protect` | Create vehicle |
| GET | `/api/v1/transport/vehicles` | `identifyTenant + protect` | List vehicles |
| GET | `/api/v1/transport/vehicles/:id` | `identifyTenant + protect` | Vehicle detail |
| PUT | `/api/v1/transport/vehicles/:id` | `identifyTenant + protect` | Update vehicle |
| DELETE | `/api/v1/transport/vehicles/:id` | `identifyTenant + protect` | Delete vehicle |
