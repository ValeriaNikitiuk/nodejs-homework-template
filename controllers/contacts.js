
const createHttpError = require('../helpers/HttpError');
const {Contact} = require('../models/contact');

const ctrlWrapper = require('../utils/ctrlWrapper');



const getContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find({ owner }, { _id: 0, limit: 0, skip: 0 }).skip(skip).limit(limit);
    res.json(result);
  
};

const getContactId = async (req, res) => {
  const { id } = req.params;
    const result = await Contact.findById(id);
    if (!result ) {
      throw createHttpError(404, 'Not found');
    }
    res.json(result);
 
};
  


const postContact = async (req, res) => {
if (!Object.keys(req.body).length) {
      throw createHttpError(400, 'missing fields');
  }
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);
  
};


const delContact = async (req, res) => {
        const { id } = req.params;
        const result = await Contact.findByIdAndDelete(id);

        if (!result) {
            throw createHttpError(404, 'Not found');
        }
        res.json({ message: "contact deleted" })
   
};

const updateContact = async (req, res, next) => {
    if (!Object.keys(req.body).length) {
      throw createHttpError(400, 'missing fields');
    }
        
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, {new:true});
    if (!result) {
      throw createHttpError(404, 'Not found');
    }
    res.json(result);
};

const updateStatusContact = async (req, res, next) => {
    if (!Object.keys(req.body).length) {
      throw createHttpError(400, 'missing field favorite');
    }
        
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, {new:true});
    if (!result) {
      throw createHttpError(404, 'Not found');
    }
    res.json(result);
};

module.exports = {
    getContact: ctrlWrapper(getContact),
    getContactId: ctrlWrapper(getContactId),
    postContact: ctrlWrapper(postContact),
    delContact: ctrlWrapper(delContact),
    updateContact: ctrlWrapper(updateContact),
    updateStatusContact : ctrlWrapper(updateStatusContact),
};