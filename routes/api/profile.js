const express = require("express");
const router = express.Router();

// GET api/profile
// Test route
router.get("/", (req, res) => res.send("Profile route"));

module.exports = router;
