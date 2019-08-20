const express = require("express");
const router = express.Router();

// GET api/auth
// Test route
router.get("/", (req, res) => res.send("Auth route"));

module.exports = router;
