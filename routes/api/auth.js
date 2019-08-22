const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
const config = require("config");
const {
    check,
    validationResult
} = require("express-validator");
const auth = require('../../middleware/auth');
const User = require('../../models/User')

// GET api/auth/test
// Test route
router.get("/test", auth, (req, res) => res.send("Auth route"));

// Get api/auth
// Get authorized user
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});

// POST api/auth
// Log In
router.post(
    "/",
    // Express-Validator Checks
    [
        check("email", "Please include a valid email.").isEmail(),
        check(
            "password",
            "Password is required."
        ).exists()
    ],
    // Asynchronous callback
    async (req, res) => {
        // If any errors exist, send 400 Status and error messages.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        const {
            email,
            password
        } = req.body;

        // Check if user doesn't exist
        try {
            let user = await User.findOne({
                email
            });
            if (!user) {
                return res
                    .status(400)
                    .json({
                        errors: [{
                            msg: "Invalid Credentials."
                        }]
                    });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400)
                    .json({
                        errors: [{
                            msg: "Invalid Credentials"
                        }]
                    })
            }

            // Create payload for JWT Authentication
            const payload = {
                user: {
                    id: user.id
                }
            };

            // Pass in payload, secret, additional options
            jwt.sign(
                payload,
                config.get("jwtSecret"), {
                    // Change to 3600 for 1 hour <<<<<<<<<<<<<<<======================== TODO TODO TODO TODO
                    expiresIn: 3600000000000000000
                },
                // Send back token
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token
                    });
                }
            );
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server Error.");
        }
    }
);


module.exports = router;