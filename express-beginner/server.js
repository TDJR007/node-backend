// The address of this server connected to the network is: 
// URL -> http://localhost:3000
// IP -> http://127.0.0.1:3000

const express = require("express")
const app = express()
const PORT = 3000

let data = ["tnwr"]

// Middleware
app.use(express.json()) // Configures our server to expect json data as incoming requests

// HTTP VERBS & Routes (or paths)
// The method (or verb) informs the nature of request and the route is a further subdirectory
// (basically we direct the request to the body of code to respond appropriately
// and these locations or routes are called endpoints)

// Type 1- Website endpoints (these endpoints are for sending back html and they typically come when a user enters a URL in the browser)

app.get("/", (req, res) => {
    // this is endpoint number 1- /
    console.log("Yay! I hit an endpoint", req.method);
    // Palette ideas: https://coolors.co/
    res.send(`
        <body style="background:#5CF64A; color:#1B1B3A">
            <h1>DATA: </h1>
            <p>${JSON.stringify(data)}</p>
            <a href="/dashboard">Dashboard</a>
        </body>
        <script>
            console.log("You can also embed js in your response for client side execution");
        </script>
        `)
})

app.get("/dashboard", (req, res) => {
    console.log("Now I hit the /dashboard endpoint");
    res.send(`
        <body>
            <h1>Dashboard Page</h1>
            <a href="/">Home</a>
        </body>
        `);
})

// Type 2 - API endpoints (non visual)

// CRUD-method create-post read-get update-put and delete-delete

app.get("/api/data", (req, res) => {
    console.log("This one was for some data");
    res.status(200).send(data); // Sent status code AND data
})

app.post("/api/data", (req, res) => {
    // most common way of sending requests over the web is JSON

    // the user clicks the sign up button after entering their credentials, and their browser is
    // wired up to send out a network request to the server to handle that action

    const newEntry = req.body;
    console.log(newEntry);
    data.push(newEntry.name);
    res.sendStatus(201);

})

app.delete("/api/data", (req, res) => {
    data.pop();
    console.log("Deleted the last user.")
    res.sendStatus(204);
})

app.listen(PORT, () => console.log(`Server started on: ${PORT}`))