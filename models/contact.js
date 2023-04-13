const { Schema, model } = require('mongoose');
const Joi = require('joi');
const  mongooseErrorr  = require('../utils/mongooseError');

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Set name for contact'],
        },
        email: {
            type: String,      
            
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

contactSchema.post("create", mongooseErrorr);



const addShema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().required(),
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