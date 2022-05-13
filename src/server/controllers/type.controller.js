const { TypeModel } = require("../models/type.model");

const { isNumericalString } = require("../../utils/isNumericalString");
const { isAlphabeticalString } = require("../../utils/isAlphabeticalString");

const TypeNotFoundErrorPayload = {
  success: false,
  data: {
    msg: 'Failed to find type because it either does not exist or an internal server error has occurred.',
  }
}

const InvalidIdErrorPayload = {
  success: false,
  data: {
    msg: 'The :id parameter must only contain numbers or only contain letters.',
  },
};

const fetchType = async (req, res) => {
  const { id } = req.params;

  if (isNumericalString(id)) return fetchTypeById(id, req, res);
  else if (isAlphabeticalString(id)) return fetchTypeByName(id, req, res);

  res.status(400).json(InvalidIdErrorPayload);
};

const fetchTypeById = async (id, req, res) => {
  const [type] = await TypeModel.find({ id }, { _id: 9, __v: 0 });

  if (!type) return res.status(500).json(TypeNotFoundErrorPayload);

  return res.status(200).json({
    success: true,
    data: type,
  });
};

const fetchTypeByName = async (name, req, res) => {
  const [type] = await TypeModel.find({ name }, { _id: 0, __v: 0 });

  if (!type) return res.status(500).json(TypeNotFoundErrorPayload);

  return res.status(200).json({
    success: true,
    data: type,
  });
};

module.exports = { fetchType, fetchTypeById, fetchTypeByName };
