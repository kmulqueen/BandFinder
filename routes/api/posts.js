const express = require("express");
const router = express.Router();
const auth = require('../../middleware/auth');
const {
    check,
    validationResult
} = require('express-validator');
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// GET api/posts
// Test route
router.get("/test", (req, res) => res.send("Posts route"));

// POST api/posts
// Create a post
// Private
router.post('/', [auth,
    check('text', 'Text is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            user: req.user.id
        })

        const post = await newPost.save()

        res.json(post)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error.")
    }

})

// GET api/posts
// Get all posts
// Private
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({
            date: -1
        });
        res.json(posts)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error.")
    }
})

// GET api/posts/:id
// Get post by id
// Private
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if post exists
        if (!post) {
            return res.status(404).json({
                msg: "Post not found."
            })
        }

        res.json(post)
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                msg: "Post not found."
            })
        }
        res.status(500).send("Server Error.")
    }
})

// DELETE api/posts/:id
// Delete post by id
// Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if post exists
        if (!post) {
            return res.status(404).json({
                msg: "Post not found."
            })
        }

        // Check if user wrote post
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({
                msg: "User not authorized to delete post."
            })
        }

        await post.remove();
        res.json({
            msg: "Post deleted."
        })
    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({
                msg: "Post not found."
            })
        }
        res.status(500).send("Server Error.")
    }
})

// PUT api/posts/like/:id
// Add Likes to post
// Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if post has already been liked by user
        if (post.likes.filter(like => like.user.toString() === req.user.id).length) {
            return res.status(400).json({
                msg: "Post already liked."
            })
        }
        post.likes.unshift({
            user: req.user.id
        });
        await post.save();
        res.json(post.likes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error.")

    }
})

// PUT api/posts/unlike/:id
// Remove Like from post
// Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Check if post has been liked by user
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({
                msg: "Post has not yet been liked."
            })
        }

        const updated = post.likes.filter(like => like.user.toString() !== req.user.id);
        post.likes = updated

        await post.save();
        res.json(post.likes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error.")

    }
})

module.exports = router;