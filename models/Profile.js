const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    company: {
        type: String,
        required: True
    },
    title: {
        type: String,
        required: True
    },
    location: {
        type: String
    },
    bio: {
        type: String
    },
    social: {
        youtube: {
        type: String
        },
        twitter: {
        type: String
        },
        facebook: {
        type: String
        },
        linkedin: {
        type: String
        },
        instagram: {
        type: String
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
    });

module.exports = Profile = mongoose.model('profile', ProfileSchema);