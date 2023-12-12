const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'please confirm your password'],
        validate: {
            //will only work for save and create
            validator: function (val) {
                return val === this.password
            },
            message: 'password and current password needs to be same'
        }
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'password is required'],
        validate: [validator.isEmail, 'valid email id is required'],
    },
    passwordChangedAt: Date,
    photo: String,
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
})
userSchema.pre('save', async function (next) {
    if (!this.passwordChangedAt) {
        this.passwordChangedAt = new Date();
    }
    next();
})
userSchema.methods.comparePassword = async function (pword, dbpword) {
    return await bcrypt.compare(pword, dbpword);
}
userSchema.methods.isPasswordChanged = async function (jwttime) {
    if (this.passwordChangedAt) {
        const passwordChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log(passwordChangedTimestamp, jwttime);
        return jwttime < passwordChangedTimestamp;
    }
    return false;
}
const User = new mongoose.model('User', userSchema)
module.exports = User;