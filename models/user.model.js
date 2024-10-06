const mongoose = require('mongoose')




const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },
    dob: {
        type: Date,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        
    },
    phoneNumber: {
        type: String
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profile: {
        type: String,
        default: "",
    }
},

    {
        timestamps: true
    })

const userModel = mongoose.model('User', userSchema);

module.exports = {
    userModel
} 