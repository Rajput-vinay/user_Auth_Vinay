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
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`,
        }
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