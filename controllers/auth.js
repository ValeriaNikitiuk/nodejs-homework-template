const ctrlWrapper = require('../utils/ctrlWrapper');
const fs = require('fs/promises');
const path = require('path');
const createHttpError = require('../helpers/HttpError');
const sendEmail = require('../helpers/sendEmail');
const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const Jimp = require('jimp');
const { nanoid } = require('nanoid');

const { ConnectionStates } = require('mongoose');

const { SECRET_KEY , BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');



const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw createHttpError(409, 'Email in use');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    const result = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });
    const verifyEmail = {
        to: email,
        subject: "Verifi Email",
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`
    }
    await sendEmail(verifyEmail);

    res.status(201).json
        ({  user: { email:result.email, subscription: result.subscription } })
    
}

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw createHttpError(404, 'User not found');
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });
    
    res.json({
        message: "Verification successful"
    })

};

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
     if (!email) {
        return res.status(400).json({ message: "missing required field email" });
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(400, "Email not found")
    }
    if (user.verify) {
        throw createHttpError(400, "Verification has already been passed")
    }
    const verifyEmail = {
        to: email,
        subject: "Verifi Email",
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a>`
    }
    await sendEmail(verifyEmail);
    res.json({
        message: "Verification email sent"
    })
}

const login = async (req, res) => {
   const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(401, 'Email or password is wrong');
    }
     if (!user.verify) {
        throw createHttpError(401, 'Email not verify');
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw createHttpError(401, 'Email or password is wrong');
    }
    
    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '23h'});
    await User.findByIdAndUpdate(user._id, { token });
    const subscription = user.subscription || "starter";

    res.json({ token, user: { email, subscription } })
}

const getCurrent = async (req, res) => {
   
    if (!req.user) {
        throw createHttpError(401, 'Not authorized');
    }
    const { email, subscription } = req.user;

    res.status(200).json({
        email,
        subscription
    });
};

const logOut = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json()
}

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, filename } = req.file;
    const avatarName = `${_id}_${filename}`;
    const resultUpload = path.join(avatarsDir, avatarName);
    await fs.rename(tempUpload, resultUpload);

 const avatar = await Jimp.read(resultUpload);
    await avatar.resize(250, 250);
    await avatar.write(resultUpload);
    
    const avatarURL = path.join('avatars', avatarName);
    await User.findByIdAndUpdate(_id, {avatarURL});

    res.json({avatarURL});
}


module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    getCurrent: ctrlWrapper(getCurrent),
    logOut: ctrlWrapper(logOut),
    updateAvatar: ctrlWrapper(updateAvatar),
    verify: ctrlWrapper(verify),
}