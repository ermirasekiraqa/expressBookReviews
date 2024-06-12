const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { users } = require('./router/auth_users.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Get the JWT token from the client
    const bearerToken = req.headers.authorization;

    // Check if the token exists
    if (!bearerToken) {
        return res.status(403).json({ message: "User not logged in!" });
    }

    const splitToken = bearerToken.split(" ");
    const token = splitToken[1];

    // Verify the JWT token
    jwt.verify(token, "access", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "User not authenticated!" });
        } else {
            // Set the user information in the request object
            req.user = user;
            next();
        }
    });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
