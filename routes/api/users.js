const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../../models/User");

// GET api/users
// Test route
router.get("/test", (req, res) => res.send("User route"));

// POST api/users
// Register user
router.post(
  "/",
  // Express-Validator Checks
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with at least 6 characters"
    ).isLength({ min: 6 })
  ],
  // Asynchronous callback
  async (req, res) => {
    // If any errors exist, send 400 Status and error messages.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user already exists by email in DB, if not create new user
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User with that email already exists" }] });
      }

      user = new User({
        name,
        email,
        password
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save new user to DB
      await user.save();

      // Create payload for JWT Authentication
      const payload = {
        user: {
          id: user.id
        }
      };

      // Pass in payload, secret, additional options
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error.");
    }
  }
);

module.exports = router;
