const ctrlWrapper = require('../utils/ctrlWrapper');
const fs = require('fs/promises');
const path = require('path');
const createHttpError = require('../helpers/HttpError');
const { User } = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const Jimp = require('jimp');

const { ConnectionStates } = require('mongoose');

const { SECRET_KEY } = process.env;

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw createHttpError(409, 'Email in use');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const result = await User.create({ ...req.body, password: hashPassword, avatarURL });

    res.status(201).json
        ({  user: { email:result.email, subscription: result.subscription } })
    
}

const login = async (req, res) => {
   const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(401, 'Email or password is wrong');
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
    getCurrent: ctrlWrapper(getCurrent),
    logOut: ctrlWrapper(logOut),
    updateAvatar: ctrlWrapper(updateAvatar),
}