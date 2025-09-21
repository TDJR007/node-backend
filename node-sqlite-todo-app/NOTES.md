# Learning Notes – Backend Tutorial

These are my setup notes while following along the tutorial.  
(Future me: don’t thank me, just buy me a coffee.)

---

## SQLite

- **What it is**: A very lightweight and widely used SQL database.  
- **Why use it**: No server setup needed, runs in-process with your app. Perfect for prototyping, tutorials, and small projects.  
- **Getting started**: It usually comes bundled with dev tools. For most Node/JS projects, you just install a driver (e.g., `sqlite3` or `better-sqlite3`).

---

## Node Version Manager (NVM)

- **What it is**: A tool for installing and switching between multiple versions of Node.js.  
- **Why use it**: Different projects may require different Node versions. NVM keeps them isolated.  
- **Install**: [NVM GitHub repo](https://github.com/nvm-sh/nvm) (check here for the latest instructions).  

### Basic usage:

```bash
# Install Node.js v22
nvm install 22

# Switch to Node.js v22
nvm use 22
```

That’s it — simple as that!

## Running with Node (no nodemon!)

Modern Node has a `--watch` flag so you don’t need nodemon anymore.
You can also load env vars directly with `--env-file`.

Example `package.json` snippet:

```json
"scripts": {
  "dev": "node --watch --env-file=.env --experimental-strip-types --experimental-sqlite ./src/server.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

## Import Syntax
Old (CommonJS)

`const express = require("express")`

New (ES Modules)

`import express from "express"`


To enable module syntax, add this key in your package.json:

```json
"type": "module"
```


⚠️ Place it below `"main": "index.js".`

Snippet to demonstrate all this:

```js 
import express from "express"; // Modern node module syntax

const app = express();
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server has started on port: ${PORT}`)
})
```

## Quick Reminders / Pitfalls

- Restart your terminal after installing NVM, otherwise nvm won’t be found.

- SQLite is file-based → keep track of your .db file, don’t commit it accidentally.

- If --watch isn’t behaving, make sure your Node version is >= 18.

## 🚏Routers in Express

- In Express (Node’s web framework), a router is basically a mini Express app that handles a group of related routes.

- Think of it as a modular way to organize endpoints so your server.js doesn’t turn into one giant spaghetti file. 🍝

### Without a router (everything dumped into ```server.js```):

```js
app.get("/users", (req, res) => { ... });
app.post("/users", (req, res) => { ... });
app.get("/todos", (req, res) => { ... });
app.post("/todos", (req, res) => { ... });
```

This gets messy really fast.

---

## With a router:

You move all users routes into their own file.

`routes/users.js`:

```js
import { Router } from "express";
import db from "../db.js";

const router = Router();

// Get all users
router.get("/", (req, res) => {
  const users = db.prepare("SELECT * FROM users").all();
  res.json(users);
});

// Create new user
router.post("/", (req, res) => {
  const { username, password } = req.body;
  db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(username, password);
  res.json({ message: "User created" });
});

export default router;
```

`server.js`:

```js
import express from "express";
import usersRouter from "./routes/users.js";

const app = express();
app.use(express.json());

// Mount the users router at /users
app.use("/users", usersRouter);

app.listen(5000, () => console.log("Server running on port 5000"));
```

### Now:

- `GET /users` → lists all users

- `POST /users` → creates a user

If later you make a routes/todos.js, you just mount it with `app.use("/todos", todosRouter)`.

### 🧠 Analogy:

- `server.js` = airport terminal ✈️

- Each router = a separate gate for a destination.

- You don’t cram all flights into one gate; you assign routes to the right place.

## JSON WEB TOKEN- JWT

> Json web token is an alphanumeric key that is essentially a secure password that we can associate with a user to authenticate them when they make future network requests without needing them to sign up again.

### 🔑 What is JWT?

- A JSON Web Token is a digitally signed string used for authentication.

- Lets a server trust that a client is who they say they are, without asking for a password on every request.

- Commonly used in APIs to protect routes and data.

---

### 📦 Structure

A JWT has 3 parts (separated by dots):

```header.payload.signature```

### Example:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 
.eyJpZCI6MSwiaWF0IjoxNzU4Mzc1NTAzLCJleHAiOjE3NTg0NjE5MDN9 
.ExelyUenoph6fuQ72CqBB9dKsMGIAZtP3N4X3y1n82w
```

- **Header** → algorithm + token type (e.g., HS256, JWT).

- **Payload** → user info or claims (e.g., { id: 1, iat: 123456, exp: 123456 }).

- **Signature** → prevents tampering, generated using your JWT_SECRET.

👉 You can decode JWTs on [jwt.io](jwt.io)
. Payload is **Base64 encoded**, not encrypted.

---

### ⚙️ How it works in an app

1. **Register/Login**

  - User provides username + password.

  - Server checks/creates the user in DB.

  - Server signs a token with jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" }).

  - Token returned to client.

2. **Future Requests**

  - Client includes token in headers:

  - ```Authorization: Bearer <token>```


  - Server verifies token with ```jwt.verify().```

  - If valid, request proceeds; otherwise returns 401 Unauthorized.

---

### Middleware code:

```js
import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) { return res.status(401).json({ message: "No token provided." }); }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) { return res.status(401).json({ message: "Invalid token." }); }
        req.userId = decoded.id;
        next();
    })
}

export default authMiddleware;
```

then wire it up in main ```server.js``` file (similar to ```Program.cs```):

```js
app.use('/todos', authMiddleware, todoRoutes)
```

---

### ✅ Pros

- Stateless: no need to store sessions on server.

- Scales well for APIs.

- Easy to pass between services.

### ⚠️ Cons

- If JWT_SECRET is leaked, attacker can forge tokens.

- Tokens are not encrypted, just signed → don’t store sensitive info inside.

- Once issued, tokens are valid until expiry (unless you add blacklisting/refresh tokens).

---

## Adding Debugger in Node (VsCode)

Hit ```Ctrl+Shift+P``` → “Toggle Auto Attach”. If enabled, every time you run node source code in your terminal, VS Code auto-attaches the debugger—no config needed.

---

# 📡 HTTP Request Data Types

When we send information from client → server, it can go **several ways**. Knowing the difference is critical for building APIs.

---

## 1️⃣ JSON in Request Body
- **Where**: `POST`, `PUT`, `PATCH` requests (can technically be used in `DELETE`, though not common).  
- **Content-Type**: `application/json`  
- **How it looks**:

```http
POST /todos HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer <token>

{
  "task": "Finish tutorial",
  "completed": false
}
```

- **Pros:** Structured, easy to read and parse.

- Used in modern APIs (REST, GraphQL often uses JSON as payload).

### 2. Query Parameters

**Where:** in the URL of GET requests or even POST/PUT.

**Format:** ?key=value&key2=value2

**Example:**
```http
GET /todos?page=2&limit=10 HTTP/1.1
Host: localhost:3000
Authorization: Bearer <token>
```
- **Pros:** easy to bookmark or share URLs.

- **Cons:** limited length (depends on browser/server), data is visible in URL.

### 3. URL Path Parameters

**Where:** part of the URL path itself.

**Format:** /resource/:id

**Example:**

```http
PUT /todos/5 HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer <token>

{
  "completed": true
}
```

- **Pros:** clean, RESTful way to identify a specific resource.

### 4. HTTP Headers

**Where:** any request; used for metadata, auth tokens, etc.

**Example:**

```http
GET /todos HTTP/1.1
Host: localhost:3000
Authorization: Bearer <token>
X-Custom-Header: custom-value
```

- **Pros:** separates data from body, invisible in URL.

- **Common uses:** authentication, content type, caching info.

### 5. Form Data (application/x-www-form-urlencoded)

**Used:** traditional HTML forms.

**Format:** key-value pairs encoded in URL style.

**Example:**

```http
POST /login HTTP/1.1
Host: localhost:3000
Content-Type: application/x-www-form-urlencoded

username=CyrilFiggis&password=guest
```

- **Pros:** simple, supported everywhere.

- **Cons:** not good for nested structures.

### 6. Multipart/Form-Data

**Used:** file uploads.

**Example:**

```http
POST /upload HTTP/1.1
Host: localhost:3000
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="photo.png"
Content-Type: image/png

<binary data here>
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

- **Pros:** can send files + data in one request.

- **Cons:** more complex to parse manually; usually use middleware like multer in Node.js.