// File: src/server.js

import express from "express"; // Modern node module syntax
import path, { dirname } from "path"; // for handling filesystem paths
import { fileURLToPath } from "url"; // converts module URL to a usable file path

import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 3000

// Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url)

// Get the directory name from the file path
const __dirname = dirname(__filename)

// Middleware
app.use(express.json()) // Have our server expect json from client

// Serving up the HTML file from the /public directory
// Tells express to serve all files from public folder as static assets / files.
// Any requests for the css files will be resolved to the public directory.

app.use(express.static(path.join(__dirname, "../public")))

// Routes
app.use('/auth', authRoutes)
app.use('/todos', authMiddleware, todoRoutes)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.listen(PORT, () => {
    console.log(`Server has started on port: ${PORT}`)
})