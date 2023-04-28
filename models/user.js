const { Schema, model } = require('mongoose');
const Joi = require('joi');
const mongooseErrorr = require('../utils/mongooseError');


const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: null,
    },
   
    avatarURL: {
        type: String,

    },
    verify: {
    type: Boolean,
    default: false,
    },
    verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  },
},
{ versionKey: false });

userSchema.post("create", mongooseErrorr);

const registerShema = Joi.object({
 email: Joi.string().required(),
 password: Joi.string().required(),
  subscription: Joi.string().valid('starter', 'pro', 'business')
        .default('starter'),
});

const loginSchema = Joi.object({
email: Joi.string().email().required(),
password: Joi.string().required(),

});

const emailSchema = Joi.object({
email: Joi.string().email().required(),
});

const schemas = {
    registerShema,
    loginSchema,
    emailSchema,
}
const User = model('user', userSchema);

module.exports = {
    User,
    schemas
};