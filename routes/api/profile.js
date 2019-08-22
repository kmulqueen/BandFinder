const express = require("express");
const router = express.Router();
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const auth = require('../../middleware/auth');
const {
    check,
    validationResult
} = require('express-validator');

// GET api/profile/test
// Test route
router.get("/test", (req, res) => res.send("Profile route"));

// GET api/profile/me
// Get current user's profile
// Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name']);

        if (!profile) {
            return res.status(400).json({
                msg: 'No profile exists for this user.'
            })
        }

        res.json(profile)
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error')
    }
});

// POST api/profile
// Create or Update user profile
// Private
router.post('/', [auth, [
    check('location', 'Location is required.').not().isEmpty(),
    check('instruments', "Please enter at least 1 instrument you play.").not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const {
        location,
        bio,
        instruments,
        projects,
        albums,
        genres,
        status,
        website,
        facebook,
        instagram,
        twitter,
        youtube,
        spotify,
        soundcloud,
        applemusic
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (instruments) {
        profileFields.instruments = instruments.split(',').map(instrument => instrument.trim())
    }
    if (projects) {
        profileFields.projects = projects.split(',').map(project => project.trim())
    }
    if (albums) {
        profileFields.albums = albums.split(',').map(album => album.trim())
    }
    if (genres) {
        profileFields.genres = genres.split(',').map(genre => genre.trim())
    };
    if (status) {
        profileFields.status = status.split(',').map(item => item.trim())
    };
    if (website) profileFields.website = website;

    // Build social object
    profileFields.social = {};
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (twitter) profileFields.social.twitter = twitter;
    if (youtube) profileFields.social.youtube = youtube;
    if (spotify) profileFields.social.spotify = spotify;
    if (soundcloud) profileFields.social.soundcloud = soundcloud;
    if (applemusic) profileFields.social.applemusic = applemusic;

    // Check if profile exists. 
    try {
        let profile = await Profile.findOne({
            user: req.user.id
        });
        // If it does, then update it with new info.
        if (profile) {
            //Update
            profile = await Profile.findOneAndUpdate({
                user: req.user.id
            }, {
                $set: profileFields
            }, {
                new: true
            })

            return res.json(profile)
        }

        // If not, Create new profile
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error.")
    }

})

// GET api/profile
// Get all profiles
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name']);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error")
    }
})

// GET api/profile/user/:user_id
// Get profile by user id
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name']);

        if (!profile) return res.status(400).json({
            msg: "No profile exists for this user."
        })

        res.json(profile)

    } catch (error) {
        console.error(error.message);
        if (error.kind == 'ObjectId') {
            return res.status(400).json({
                msg: "Profile not found."
            })
        }
        res.status(500).send("Server Error")
    }
})

// DELETE api/profile
// Delete profile, user & posts
// Private
router.delete('/', auth, async (req, res) => {
    try {
        await Profile.findOneAndRemove({
            user: req.user.id
        });
        await User.findOneAndRemove({
            _id: req.user.id
        });

        res.json({
            msg: 'User deleted.'
        })
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error.')
    }
})

// GET api/profile/followers/:user_id
// Get followers
// Private
router.get('/followers/:user_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        });

        if (profile.followers.length === 0) return res.status(400).json({
            msg: "User has no followers."
        });

        res.json(profile.followers)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error.")
    }
})

// PUT api/profile/follow/:user_id
// Follow user
// Private
router.put('/follow/:user_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['name']);
        const userToFollow = await Profile.findOne({
            user: req.params.user_id
        }).populate('user', ['name']);

        // Check to see if user is already being followed
        if (!userToFollow.followers.includes(profile.user._id)) {
            profile.following.unshift(userToFollow.user._id);
            userToFollow.followers.unshift(profile.user._id);

            await profile.save();
            await userToFollow.save();
            return res.status(200).json(profile)
        }
        res.status(400).json({
            msg: "Already following this user."
        })


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error.")
    }
})



module.exports = router;