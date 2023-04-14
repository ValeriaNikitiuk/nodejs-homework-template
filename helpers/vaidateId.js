const mongoose = require("mongoose");
const createHttpError = require("../helpers/HttpError");

const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    next(createHttpError(404));
  }
  next();
};

module.exports = validateId;