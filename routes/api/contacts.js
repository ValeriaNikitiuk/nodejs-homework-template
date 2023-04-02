const express = require('express');
const Joi = require('joi');

const router = express.Router();

const contacts = require('../../models/contacts');
const createHttpError   = require('../../helpers/HttpError');

const schema = Joi.object({
  name: Joi.string()
    .required().messages({ "any.required": "missing required name field" }),

  email: Joi.string()
    .email({ minDomainSegments: 2 })
        .required().messages({"any.required":  "missing required email field"}),

  phone: 
    Joi.number()
     .required().messages({"any.required":  "missing required phone field"}),
    
})


router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  }
  catch (error) {
    next(error);
    
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId);
    if (!result) {
      throw createHttpError(404, 'Not found');
    }
    res.json(result);
  }
  catch (error) {
     next(error);
    }
});
  


router.post('/', async (req, res, next) => {
  try {
    const {error} = schema.validate(req.body);
    if (error) {
      throw createHttpError(400, error.message);
    }
    
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  }
  catch (error) {
    next(error);
  }
});


router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);

    if (!result) {
      throw createHttpError(404, 'Not found');
    }
    res.json({ message: "contact deleted"})
  }
  catch (error) {
    next(error);
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const {error} = schema.validate(req.body);
    if (error) {
      throw createHttpError(400, error.message);
   }
    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId, req.body);
    if (!result) {
      throw HttpError(404, 'Not found');
    }
    res.json(result);
  }
  catch (error) {
    next(error);
  }
});


module.exports = router
