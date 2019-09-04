const express = require("express");
const router = express.Router();
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
const User = require("../../models/User");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

// GET api/profile/test
// Test route
router.get("/test", (req, res) => res.send("Profile route"));

// GET api/profile/me
// Get current user's profile
// Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({
        msg: "No profile exists for this user."
      });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// POST api/profile
// Create or Update user profile
// Private
router.post(
  "/",
  [
    auth,
    [
      check("location", "Location is required.")
        .not()
        .isEmpty(),
      check("instruments", "Instruments is required.")
        .not()
        .isEmpty(),
      check("status", "Status is required.")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
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
      itunes
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (instruments) {
      profileFields.instruments = instruments
        .split(",")
        .map(instrument => instrument.trim());
    }
    if (projects) {
      profileFields.projects = projects
        .split(",")
        .map(project => project.trim());
    }
    if (albums) {
      profileFields.albums = albums.split(",").map(album => album.trim());
    }
    if (genres) {
      profileFields.genres = genres.split(",").map(genre => genre.trim());
    }
    if (status) {
      profileFields.status = status.map(item => item.trim());
    }
    if (website) profileFields.website = website;

    // Build social object
    profileFields.social = {};
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (twitter) profileFields.social.twitter = twitter;
    if (youtube) profileFields.social.youtube = youtube;
    if (spotify) profileFields.social.spotify = spotify;
    if (soundcloud) profileFields.social.soundcloud = soundcloud;
    if (itunes) profileFields.social.itunes = itunes;

    // Check if profile exists.
    try {
      let profile = await Profile.findOne({
        user: req.user.id
      });
      // If it does, then update it with new info.
      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          {
            user: req.user.id
          },
          {
            $set: profileFields
          },
          {
            new: true
          }
        );

        return res.json(profile);
      }

      // If not, Create new profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error.");
    }
  }
);

// GET api/profile
// Get all profiles
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// GET api/profile/user/:user_id
// Get profile by user id
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profile)
      return res.status(400).json({
        msg: "No profile exists for this user."
      });

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == "ObjectId") {
      return res.status(400).json({
        msg: "Profile not found."
      });
    }
    res.status(500).send("Server Error");
  }
});

// DELETE api/profile
// Delete profile, user & posts
// Private
router.delete("/", auth, async (req, res) => {
  try {
    // Delete Posts by User
    await Post.deleteMany({ user: req.user.id });
    // Delete User's Profile
    await Profile.findOneAndRemove({
      user: req.user.id
    });
    // Delete User
    await User.findOneAndRemove({
      _id: req.user.id
    });

    res.json({
      msg: "User deleted."
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error.");
  }
});

// GET api/profile/followers/:user_id
// Get user's followers
// Private
router.get("/followers/:user_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    })
      .populate("user", ["name", "avatar"])
      .populate("profile");

    if (profile.followers.length === 0)
      return res.status(400).json({
        msg: "User has no followers."
      });

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error.");
  }
});

// PUT api/profile/follow/:user_id
// Follow user
// Private
router.put("/follow/:user_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    })
      .populate("user", ["name", "avatar"])
      .populate("profile", ["instruments", "status", "location"]);

    const userToFollow = await Profile.findOne({
      user: req.params.user_id
    })
      .populate("user", ["name", "avatar"])
      .populate("profile", ["instruments", "status", "location"]);

    // Check to see if profile is already following user
    let alreadyFollowing = userToFollow.followers.filter(
      follower => follower.user.toString() === profile.user._id.toString()
    );

    let toFollowInfo = {
      profileId: userToFollow._id,
      instruments: userToFollow.instruments,
      status: userToFollow.status,
      location: userToFollow.location
    };
    let followerInfo = {
      profileId: profile._id,
      instruments: profile.instruments,
      status: profile.status,
      location: profile.location
    };
    if (!alreadyFollowing.length) {
      const newFollowing = {
        user: userToFollow.user._id,
        name: userToFollow.user.name,
        avatar: userToFollow.user.avatar,
        info: toFollowInfo
      };
      const newFollower = {
        user: profile.user._id,
        name: profile.user.name,
        avatar: profile.user.avatar,
        info: followerInfo
      };
      profile.following.unshift(newFollowing);
      userToFollow.followers.unshift(newFollower);

      await profile.save();
      await userToFollow.save();
      console.log(newFollowing);
      return res.status(200).json(profile);
    }

    res.status(400).json({
      msg: "Already following this user."
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error.");
  }
});

// DELETE api/profile/follow/:user_id
// Unfollow user
// Private
router.delete("/follow/:user_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "avatar"]);
    const userToUnfollow = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    // Check to see if profile exists in user's followers
    let isFollowing = userToUnfollow.followers.filter(
      follower => follower.user.toString() === profile.user._id.toString()
    );
    if (isFollowing.length) {
      const followers = userToUnfollow.followers;
      const following = profile.following;
      const updatedFollowers = followers.filter(
        person => person.user.toString() !== profile.user._id.toString()
      );
      const updatedFollowing = following.filter(
        person => person.user.toString() !== userToUnfollow.user._id.toString()
      );
      userToUnfollow.followers = updatedFollowers;
      profile.following = updatedFollowing;

      await profile.save();
      await userToUnfollow.save();
      return res.status(200).json(profile);
    }
    // If they don't exist in user's followers
    res.status(400).json({
      msg: "You are not yet following this user."
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error.");
  }
});

module.exports = router;
