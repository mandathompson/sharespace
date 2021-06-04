const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')
const request = require('request')
const User = require('../../models/User')
const Profile = require('../../models/Profile');
const config = require('config')
const { route } = require('./auth');


//@route   GET api/profile/me
//@desc    Get currect user's profile
//@access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', 
        ['name, avatar']);

        if(!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' })
        }
        res.json(profile)
    } catch(err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
});


//@route   POST api/profile
//@desc    Create or update user profile
//@access  Private
router.post('/', [auth, [
    check('company', 'Company is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { 
        company,
        title,
        location,
        bio,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(title) profileFields.title = title;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;

    // Build social object
    profileFields.social = {}
        if(youtube) profileFields.social.youtube = youtube
        if(twitter) profileFields.social.twitter = twitter
        if(facebook) profileFields.social.facebook = facebook
        if(linkedin) profileFields.social.linkedin = linkedin
        if(instagram) profileFields.social.instagram = instagram

        try{
            let profile = await Profile.findOne({ user: req.user.id });

            if(profile) {
                //Update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id }, 
                    { $set: profileFields}, 
                    { new: true}
                );
                return res.json(profile);
            }

            // Create profile if one was not found
            profile = new Profile(profileFields)
            await profile.save()
            res.json(profile)

        } catch(err) {
            console.error(err.message)
            res.status(500).send('Server error')
        }
    }
)




//@route   GET api/profile
//@desc    Get all profiles
//@access  Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})


//@route   GET api/profile/user/:user_id
//@desc    Get profile by user id
//@access  Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])

        if(!profile) return res.status(400).json({ msg: 'Profile not found' })

        res.json(profile)
    } catch (err) {
        console.error(err.message)
        if(err.kind === 'ObjectId'){
            return res.status(400).json({ msg: 'Profile not found' })
        }
        res.status(500).send('Server error')
    }
})


//@route   PUT api/profile/experience
//@desc    Add profile experience
//@access  Private
// router.put('/experience', [ 
//     auth, 
//     [
//     check('title', 'Title is required').not().isEmpty(),
//     check('company', 'Company is required').not().isEmpty(),
//     check('from', 'From date is required').not().isEmpty()
//     ]
// ],
// async (req, res) => {
//     const errors = validationResult(req)
//     if(!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() })
//     }

//     const { 
//         title, 
//         company, 
//         location, 
//         from,
//         to, 
//         current,
//         description
//     } = req.body;

//     const newExp = {
//         //this is same as doing title: title, we're just using shorthand:
//         title,
//         company, 
//         location, 
//         from,
//         to, 
//         current,
//         description
//     }

//     try {
//         const profile = await Profile.findOne({ user: req.user.id });

//         profile.experience.unshift(newExp);
//         await profile.save() 
//         res.json(profile);
        
//     } catch (err) {
//         console.error(err.message)
//         res.status(500).send('Server error')
//     }

// });



//@route   DELETE api/profile/experience/:exp_id
//@desc    Delete profile experience
//@access  Private
// router.delete('/experience/:exp_id', auth, async (req, res) => {
//     try {
//         //Get user profile
//         const profile = await Profile.findOne({ user: req.user.id });

//         //Get index; return item.id AND id of the :exp_id in the route
//         const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
//         //splice the index out 
//         profile.experience.splice(removeIndex, 1);
//         //save 
//         await profile.save();
//         // return
//         res.json(profile);

//     } catch (err) {
//         console.error(err.message)
//         res.status(500).send('Server error')
//     }
// });






//@route   PUT api/profile/education
//@desc    Add profile education
//@access  Private
// router.put('/education', [ 
//     auth, 
//     [
//     check('school', 'School is required').not().isEmpty(),
//     check('degree', 'Degree is required').not().isEmpty(),
//     check('fieldofstudy', 'Field of study is required').not().isEmpty(),
//     check('from', 'From date is required').not().isEmpty()
//     ]
// ],
// async (req, res) => {
//     const errors = validationResult(req)
//     if(!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() })
//     }

//     const { 
//         school, 
//         degree, 
//         fieldofstudy, 
//         from,
//         to, 
//         current,
//         description
//     } = req.body;

//     const newEdu = {
//         //this is same as doing school: school, we're just using shorthand:
//         school,
//         degree, 
//         fieldofstudy, 
//         from,
//         to, 
//         current,
//         description
//     }

//     try {
//         const profile = await Profile.findOne({ user: req.user.id });

//         profile.education.unshift(newEdu);
//         await profile.save() 
//         res.json(profile);
        
//     } catch (err) {
//         console.error(err.message)
//         res.status(500).send('Server error')
//     }

// });



//@route   DELETE api/profile/education/:edu_id
//@desc    Delete profile education
//@access  Private
// router.delete('/education/:edu_id', auth, async (req, res) => {
//     try {
//         //Get user profile
//         const profile = await Profile.findOne({ user: req.user.id });

//         //Get index; return item.id AND id of the :exp_id in the route
//         const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
//         //splice the index out 
//         profile.education.splice(removeIndex, 1);
//         //save 
//         await profile.save();
//         // return
//         res.json(profile);

//     } catch (err) {
//         console.error(err.message)
//         res.status(500).send('Server error')
//     }
// });




module.exports = router;