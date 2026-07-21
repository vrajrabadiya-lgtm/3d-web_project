# Backend Audit & Stabilization Report

## 1. Project Structure
The current backend has a very flat structure. It lacks separate folders for controllers, middleware, or configuration, which might make scaling difficult.

```text
server/
├── models/
│   ├── Contact.js
│   ├── Design.js
│   └── User.js
├── routes/
│   ├── auth.js
│   ├── contactRoutes.js
│   └── designs.js
├── .env.example
├── .gitignore
├── index.js
├── package-lock.json
├── package.json
└── vercel.json
```

## 2. Existing APIs
A complete list of currently exposed endpoints:

### Authentication (`/api/auth`)
- **`POST /api/auth/signup`**
  - **Request Body:** `{ name, email, password }`
  - **Validation:** Basic existence checks, password length >= 6.
  - **Authentication:** None.
  - **Response:** `201 Created` with JWT token and user info.
  - **Error Response:** `400 Bad Request` (missing fields, short password, email exists), `500 Server Error`.
- **`POST /api/auth/login`**
  - **Request Body:** `{ email, password }`
  - **Validation:** Basic existence checks.
  - **Authentication:** None.
  - **Response:** `200 OK` with JWT token and user info.
  - **Error Response:** `400 Bad Request` (incorrect password), `404 Not Found` (user not found), `500 Server Error`.
- **`GET /api/auth/me`**
  - **Authentication:** **Protected** (Requires Bearer token).
  - **Response:** `200 OK` with user details (excluding password).
  - **Error Response:** `401 Unauthorized` (invalid/missing token), `404 Not Found`, `500 Server Error`.

### Designs (`/api/designs`)
- **`POST /api/designs`**
  - **Request Body:** `{ userId, designName, config, imageUrl (optional) }`
  - **Validation:** Basic existence checks.
  - **Authentication:** **None (Security Flaw)**.
  - **Response:** `201 Created` with saved design.
  - **Error Response:** `400 Bad Request`, `500 Server Error`.
- **`GET /api/designs/:userId`**
  - **Authentication:** **None (Security Flaw)**.
  - **Response:** `200 OK` with array of designs for the given `userId`.
  - **Error Response:** `500 Server Error`.
- **`DELETE /api/designs/:id`**
  - **Authentication:** **None (Security Flaw)**.
  - **Response:** `200 OK` with deleted message and `id`.
  - **Error Response:** `404 Not Found`, `500 Server Error`.

### Contact (`/api/contact`)
- **`POST /api/contact`**
  - **Request Body:** `{ name, email, message }`
  - **Validation:** Basic existence checks.
  - **Authentication:** None.
  - **Response:** `201 Created` with saved contact info and `emailSent` boolean.
  - **Error Response:** `400 Bad Request`, `500 Server Error`.

### General
- **`GET /`**: Health check returning API status and available endpoints.

---

## 3. Database Models

### `User`
- **Fields:** 
  - `name`: String, required, trimmed.
  - `email`: String, required, unique, trimmed, lowercase.
  - `password`: String, required.
  - `lastLogin`: Date, default `null`.
- **Indexes:** Implicit on `email` (unique).
- **Timestamps:** `createdAt`, `updatedAt` enabled.

### `Design`
- **Fields:**
  - `userId`: String, required, indexed. *(Should ideally be an ObjectId reference to User)*.
  - `designName`: String, required, trimmed.
  - `config`: Mixed (mongoose.Schema.Types.Mixed), required.
  - `imageUrl`: String, default `""`.
- **Indexes:** Explicit on `userId`.
- **Timestamps:** `createdAt`, `updatedAt` enabled.

### `Contact`
- **Fields:**
  - `name`: String, required, trimmed.
  - `email`: String, required, trimmed, lowercase.
  - `message`: String, required, trimmed.
- **Timestamps:** `createdAt`, `updatedAt` enabled.

---

## 4. Authentication Flow

1. **Register (`/signup`)**: Receives credentials -> Hashes password with `bcryptjs` (salt: 10) -> Saves User -> Generates JWT (`jsonwebtoken`, expires: 7d) -> Returns JWT.
2. **Login (`/login`)**: Finds User by email -> Compares password hash -> Updates `lastLogin` -> Generates JWT (expires: 7d) -> Returns JWT.
3. **Protected Routes (`authMiddleware`)**: Reads `Authorization: Bearer <token>` -> `jwt.verify()` -> Attaches `req.userId` -> Calls `next()`.

---

## 5. Middleware
The project currently has very limited middleware.

- **`cors`**: Defined in `index.js`. Allows specified origins (`localhost:5173/5174`, `CLIENT_URL` from env) and allows wildcard `.vercel.app` and `.onrender.com` subdomains via regex.
- **`express.json()`**: Defined in `index.js`. Parses incoming JSON payloads.
- **`authMiddleware`**: Defined and exported within `routes/auth.js`. Validates JWTs.

**Missing Middleware:** Error Handler, Logger (e.g., Morgan), Security headers (Helmet), Rate Limiter.

---

## 6. Folder Responsibilities
- **Who talks to Mongo?** Mongoose setup is in `index.js`. Route handlers in `routes/*.js` directly interact with models to perform DB operations.
- **Who validates input?** Route handlers do basic `if (!field)` checks. No robust validation logic exists.
- **Who sends emails?** `routes/contactRoutes.js` uses `nodemailer` directly inside the route handler.
- **Who creates JWT?** `routes/auth.js` (`/signup` and `/login` handlers).
- **Who handles errors?** Individual `try/catch` blocks inside every route handler. Duplicate error logic.

---

## 7. Dependencies Audit

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | `^4.19.2` | Web framework. |
| `mongoose` | `^8.3.1` | MongoDB ODM. |
| `cors` | `^2.8.5` | Cross-Origin Resource Sharing. |
| `dotenv` | `^16.4.5` | Environment variables loader. |
| `bcryptjs` | `^3.0.3` | Password hashing. |
| `jsonwebtoken` | `^9.0.3` | Authentication tokens. |
| `nodemailer` | `^9.0.3` | Sending emails. |

**Dev Dependencies:**
| Package | Version | Purpose |
|---------|---------|---------|
| `nodemon` | `^3.1.0` | Live reloading for development. |

---

## 8. Environment Variables
- `PORT`: Server port.
- `MONGO_URI`: MongoDB connection string.
- `EMAIL_USER`: Gmail address for Nodemailer.
- `EMAIL_PASS`: App password for Nodemailer.
- `CLIENT_URL`: Allowed frontend origin.
- `JWT_SECRET`: Missing from `.env.example`, but used in code (with a hardcoded, insecure fallback).

---

## 9. Code Quality Audit
- **Flat Architecture**: Controllers and routes are mixed. Business logic is written directly inside Express route callbacks.
- **Misplaced Logic**: `authMiddleware` is defined inside `routes/auth.js` rather than a dedicated `middleware/` folder.
- **Duplicate Error Handling**: Every route has a basic `try/catch` with a generic `res.status(500)` return.
- **Validation**: Manual string checks instead of a schema validation library (Zod/Joi).
- **Relation Mapping**: `userId` in `Design` model is a `String` instead of a Mongoose `ObjectId` referencing the `User` model.

---

## 10. Security Audit
- **JWT Expiry**: Hardcoded to `7d` (acceptable, but could be configurable).
- **Password Hashing**: `bcryptjs` with 10 rounds (standard).
- **Hardcoded Secret**: `auth.js` falls back to a hardcoded `JWT_SECRET` (`"3d_studio_secret_key_change_in_prod"`). Very dangerous if deployed without env var.
- **MAJOR FLAW - Unprotected Routes**: The `/api/designs` endpoints do NOT use `authMiddleware`. Anyone can query `GET /api/designs/:userId` or delete via `DELETE /api/designs/:id` without a token.
- **Missing Security Best Practices**: No `helmet` (HTTP headers), no `express-rate-limit` (brute-force protection), and no explicit input sanitization against NoSQL injection beyond basic mongoose casting.
- **CORS Regex**: Allowing `/\.vercel\.app$/` permits any Vercel app (even a malicious attacker's app) to make authenticated requests if credentials are set to true.

---

## 11. Current Limitations
- ❌ **No Route Protection**: Design CRUD operations are open to the public.
- ❌ **No Error Handler**: Lacks a global async error handling middleware.
- ❌ **No Controllers**: Business logic is not decoupled from HTTP routing.
- ❌ **No Validation Layer**: No strict incoming request schema validation.
- ❌ **No Background Jobs/Queue**: Email sending blocks the API response (synchronous wait on SMTP).
- ❌ **No Logging**: No standard request/error logger (like Morgan/Winston).
- ❌ **No Rate Limiting / Helmet**: Missing fundamental API security layers.
- ❌ **No Relational Integrity**: Designs reference `userId` as a string without DB-level or Mongoose-level foreign key enforcement.

---

## Expected Output Summary

**Current Backend Architecture**
✔ Authentication (Basic JWT + Bcrypt)
✔ Design CRUD (Database logic exists)
✔ Contact (Nodemailer integrated)
✔ Mongo (Mongoose configured)
❌ Route Security (Designs are fully unprotected)
❌ Controllers/Services separation
❌ Global Error Handling
❌ Input Validation Framework
❌ Queue / Workers (Email blocks thread)
❌ Logging Layer
❌ Redis / Caching
❌ Advanced Security (Helmet/Rate-limiting)
