import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync(":memory:") // sqlite db can be stored on a file or in memory, here we're storing it in memory

/* 

If you want a persistent file, you’d use something like:

const db = new DatabaseSync("./mydb.sqlite");

*/

// Execute SQL statements from strings

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )    
`)

db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        task TEXT,
        completed BOOLEAN DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )      
`)

// FOREIGN KEY constraint ensures you can’t add a todo for a non-existent user ie. only values inside master tables are permitted.

export default db; // let's you interact with your db object through other source files/folders