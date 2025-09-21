// File: src/routes/authRoutes.js

import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import db from "../db.js"

const router = express.Router();

// register a new endpoint /auth/register (POST because GET requests don't have a body)

router.post('/register', (req, res) => {
    const { username, password } = req.body; // destructure fields directly

    // Save the username and an irreversibly encrypted password 
    // Save username | some jumbled passowrd

    // Encrypt the password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // console.log(hashedPassword);
    // console.log(username, password);

    // save the new user and hashed password

    try {
        const insertUser = db.prepare(`INSERT INTO users (username, password) 
            VALUES (?, ?)`)
        // prepare method is same as exec but it allows us to do string interpolation
        // using template literal strings (``)
        const result = insertUser.run(username, hashedPassword)

        // Now that we have a user, I want to add their first todo for them
        const defaultTodo = `Hello :) Add your first todo!`;
        const insterTodo = db.prepare(`INSERT INTO todos (user_id, task)
            VALUES (?, ?)`);

        insterTodo.run(result.lastInsertRowid, defaultTodo);

        // create a token
        const token = jwt.sign({ id: result.lastInsertRowid },
            process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    }
    catch (err) {
        console.log(err.message);
        res.sendStatus(503);
    }

})

router.post('/login', (req, res) => {
    // We get their email, and we look up the password associated with that email in the database
    // but we get it back and see it's encrypted, which means we cannot compare it to
    // the one the user just used trying to login
    // so what we can do, is again, one way encrypt the password the user just entered

    const { username, password } = req.body;

    try {

        const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`);
        const user = getUser.get(username);

        // If we cannot find a user associated with that username, return out of the function
        if (!user) { return res.status(404).send({ message: "User not found" }); }

        const passwordIsValid = bcrypt.compareSync(password, user.password);

        // If the password does not match return out of the function
        if (!passwordIsValid) { return res.status(401).send({ message: "Nice try buddy, not getting in today." }); }
        console.log(user)

        // then we have a successful authentication
        console.log(user);
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.json({ token })


    } catch (err){
        console.log(err);
        console.log(err.message);
        res.sendStatus(503);
    }
})

export default router;