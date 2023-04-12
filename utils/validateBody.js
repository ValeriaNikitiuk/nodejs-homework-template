const createHttpError = require('../helpers/HttpError');
const {Contact} = require('../models/contact');

const validateBody = schema => {
        const func = async (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return next(createHttpError(400, error.message));
        }

        const { email, name, phone } = req.body;

        const existingEmailContact = await Contact.findOne({ email });
        if (existingEmailContact) {
            return next(createHttpError(400, 'Email already exists'));
            }
            
        const existingNameContact = await Contact.findOne({ name });
        if (existingNameContact) {
            return next(createHttpError(400, 'Name already exists'));
        }

        const existingPhoneContact = await Contact.findOne({ phone });
        if (existingPhoneContact) {
            return next(createHttpError(400, 'Phone already exists'));
        }

        next();
    }
    return func;
}

module.exports = validateBody;