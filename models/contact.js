const { Schema, model } = require('mongoose');
const Joi = require('joi');
const  mongooseErrorr  = require('../utils/mongooseError');

const contactSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: [true, 'Set name for contact'],
        },
        email: {
            type: String,
            unique: true,
            
        },
        phone: {
            type: String,
            unique: true,
        },
        favorite: {
            type: Boolean,
            default: false,
        },
    }, {versionKey: false}
);

contactSchema.post("save", mongooseErrorr);



const addShema = Joi.object({
  name: Joi.string(),
  phone: Joi.string(),
  email: Joi.string(),
});

const updateShema = Joi.object({
  name: Joi.string(),
  phone: Joi.string(),
    email: Joi.string(),
 
}).or("name", "phone", "email");

const upStatus = Joi.object({
  favorite: Joi.boolean().required(),
}).unknown(false);

const updFavoriteSchema = Joi.object({
     favorite: Joi.boolean().required(),
})

const Contact = model('contact', contactSchema);

const schemas = {
addShema,
    updateShema,
    upStatus,
    updFavoriteSchema
}

module.exports = {
    Contact,
    schemas
};