const nodemailer = require('nodemailer');
require("dotenv").config();


const nodemailerConfig = {
  host: 'smtp.meta.ua',
  port: 466,
  secure: true,
  auth: {
    user: 'leraovod@meta.ua',
    pass: process.env.META_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);


const sendEmail = async (data) => {
    const email = { ...data, from: 'leraovod@meta.ua' };
    await transport.sendMail(email); 
    return true;
}

module.exports = sendEmail;