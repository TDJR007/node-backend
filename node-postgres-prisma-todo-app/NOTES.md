# Learning Notes – Backend Tutorial

## 🏗 Why Use an ORM?

ORM = **Object-Relational Mapping.**

It’s basically a translator between your **database (tables/SQL)** and your program **(objects/classes in code).**

### 1. The Pain Without ORM

- You write raw SQL queries everywhere: ```SELECT * FROM users WHERE id = ?.```

- If your schema changes: every query might need updates.

- Manual database connections, error handling, and injection protection.

- Cross-database differences: MySQL vs Postgres vs SQLite? Your SQL might break.

Basically: a **lot of boilerplate, fragile code, and repetitive pain.**

### 2. What ORMs Give You

### 1. Model Classes

```js
// Using Prisma (simplified)
const user = await prisma.user.create({
  data: { username: "Dev", password: "hashedPass" }
});
```

- You never write raw SQL.

- Your code talks to **objects**, ORM talks to SQL.

### 2. Automatic Queries

- Fetch, create, update, delete: one line each.

- Relationships: foreign keys, joins, many-to-many, handled in code.

### 3. Migrations

- A **migration** is a script describing schema changes (tables, columns, types).

- EF Core: `Add-Migration <name>` → generates SQL from your C# models.

- Prisma: `prisma migrate dev` → same idea.

- Then `Update-Database` (EF) or `prisma migrate deploy` (Prisma) applies it.

- ✅ No more manual CREATE TABLE/ALTER TABLE unless you really want to.

### 4. Cross-DB Compatibility

- Want to switch from SQLite → Postgres → MySQL? ORM usually handles it.

### 5. Safety

- Protects against SQL injection automatically (parameterized queries).

## Prisma vs EF Core vs Others

| Feature       | EF Core (.NET)                      | Prisma (Node)                   | Sequelize / TypeORM        |
| ------------- | ----------------------------------- | ------------------------------- | -------------------------- |
| Language      | C#                                  | JS/TS                           | JS/TS                      |
| Schema-first  | Optional                            | Yes (schema.prisma)             | Optional                   |
| Migrations    | `Add-Migration` → `Update-Database` | `prisma migrate dev`            | Manual / CLI               |
| Relationships | Fluent / Data Annotations           | Declarative in schema           | Declarative / annotations  |
| Query Style   | LINQ / Fluent                       | Prisma Client (JS/TS functions) | JS methods / Active Record |
| Ecosystem     | .NET                                | Node / TypeScript               | Node                       |

**Key Prisma idea:**

You declare the schema in schema.prisma, then Prisma generates a type-safe client you use in code. It knows your DB structure, relationships, and even gives autocompletion in VS Code.

## Summary

- ORM = convenience + safety + maintainability.

- Migrations = version control for your database.

- Prisma = modern, JS-friendly ORM with type safety.

- Without ORM → manual SQL, fragile, more chances to mess up.

## Prisma Setup (from docs)

1. Kick off Prisma client using ```npx prisma init```
2. Prisma schema gets created at ```prisma/schema.prisma```
3. Run prisma dev to start a local Prisma Postgres server.
4. Define models in the ```schema.prisma``` file.
5. Run ```prisma migrate dev ``` to migrate your local Prisma Postgres database.
6. Tip: Explore how you can extend the ORM with scalable connection pooling, global caching, and a managed serverless Postgres database. Read: https://pris.ly/cli/beyond-orm

---

# 🐳 Docker 

Docker lets you **package applications with all dependencies** into a lightweight container so it runs the same everywhere.

---

## 1. Key Concepts

| Term | What it is |
|------|------------|
| **Image** | A snapshot of your app + dependencies (read-only). |
| **Container** | A running instance of an image (read-write). |
| **Dockerfile** | Instructions to build an image. |
| **Docker Hub** | Registry to store/pull public/private images. |
| **Volume** | Persistent storage outside container filesystem. |
| **Network** | Isolated communication between containers. |

---

## 2. Common Docker Commands

```bash
# Build image
docker build -t my-app:latest .

# List images
docker images

# Run container
docker run -p 3000:3000 my-app:latest

# Run interactively with shell
docker run -it my-app:latest sh

# List running containers
docker ps

# Stop a container
docker stop <container_id>

# Remove a container
docker rm <container_id>

# Remove an image
docker rmi <image_id>
```

---

## 3. Dockerfile Basics

```dockerfile
# Use an official Node.js runtime
FROM node:22-alpine

# Set working directory in container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json .
RUN npm install

# Copy the rest of your code
COPY . .

# Expose port of container on which the app runs on (or we will not be able to access it from the outside)
EXPOSE 3000

# Command to run app
CMD ["node", "src/server.js"]
```

- **COPY . .** → first . = host folder, second . = container WORKDIR.

- **WORKDIR** sets the container’s “current directory” for later commands.

- **CMD** is what runs when container starts.

## Docker COPY Syntax

```dockerfile
COPY <src> <dest>
```

- `<src>` → on your host machine (where you build the image)

- `<dest>` → inside the container, relative to the current WORKDIR

> The dot . is just shorthand for “current directory” in both cases — but they live in different worlds.

---

## Docker Compose (when running multiple containers)

`docker-compose.yml` example:

```yaml
services:
  app:
    build: .
    container_name: todo-app
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/todoapp
      JWT_SECRET: your_jwt_secret_here
      NODE_ENV: development
      PORT: 3000
    ports:
      - "3000:3000"   # host:container
    depends_on:
      - db
    volumes:
      - .:/app        # Mount local folder into /app in container (dev hot-reload)

  db:
    image: postgres:13-alpine
    container_name: postgres-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: todoapp
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data  # named volume for persistence

volumes:
  postgres-data:     # named volume definition
```

- **volumes** → share code between host and container (useful for dev).

- **ports** → map host port → container port.

- **environment** → env vars inside container.

- Indentation is pretty important in this file

---

## Docker Build Caching (clever stuff)

### 1. How Docker builds an image

Docker **reads your Dockerfile line by line** and executes each instruction. Each instruction becomes a **layer**.

Example:
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
CMD ["node", "src/server.js"]
```

- `FROM node:22-alpine` → layer 1

- `WORKDIR /app` → layer 2

- `COPY package*.json` . → layer 3

- `RUN npm install` → layer 4

- `COPY . .` → layer 5

- `CMD ...` → layer 6

Each layer is **cached** after the first build.

---

## 2. How caching works

- If nothing changed in a layer, Docker **reuses the cached layer** next time.

- As soon as Docker sees a **changed line** in the Dockerfile or something that affects a previous layer, **all subsequent layers are rebuilt**.

So, consider this:

1. You change only `src/server.js` (your code).

2. Layers 1–4 (`FROM`, `WORKDIR`, `COPY package*.json`, `RUN npm install`) didn’t change → Docker **reuses the cache**.

3. Layer 5 (`COPY . .`) changes because your app code changed → Docker rebuilds this layer and the following layers.

✅ This saves tons of time because `npm install` (which can take minutes) doesn’t run again if `package.json` didn’t change.

3. Why copy `package*.json` first

```dockerfile
COPY package*.json .
RUN npm install
COPY . .
```

- `package*.json` **first** → installs dependencies first.

- Later code changes **won’t trigger** `npm install` **again**, only the `COPY . .` layer is rebuilt.

If you copied everything at once:

```dockerfile
COPY . .
RUN npm install
```

- Any code change (even a tiny `.js` file) invalidates the whole cache → `npm install` runs **every build** → slow.

---

## Zussamenfassung

- Docker builds **layers** → each layer cached.

- Copy `package.json` first → dependencies cached separately → faster builds.

- Any change after a cached layer → rebuilds that layer + subsequent layers.
