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
            return next(createHttpError(400, 'missing required email field'));
            }
            
        const existingNameContact = await Contact.findOne({ name });
        if (existingNameContact) {
            return next(createHttpError(400, 'missing required name field'));
        }

        const existingPhoneContact = await Contact.findOne({ phone });
        if (existingPhoneContact) {
            return next(createHttpError(400, 'missing required phone field'));
        }

        next();
    }
    return func;
}

module.exports = validateBody;