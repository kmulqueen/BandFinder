const express = require("express");
const router = express.Router();
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
})

module.exports = router;