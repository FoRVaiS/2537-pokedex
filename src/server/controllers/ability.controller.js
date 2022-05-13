const { AbilityModel } = require("../models/ability.model");

const { isNumericalString } = require("../../utils/isNumericalString");
const { isAlphabeticalString } = require("../../utils/isAlphabeticalString");

const AbilityNotFoundErrorPayload = {
  success: false,
  data: {
    msg: 'Failed to find ability because it either does not exist or an internal server error has occurred.',
  }
}

const InvalidIdErrorPayload = {
  success: false,
  data: {
    msg: 'The :id parameter must only contain numbers or only contain letters.',
  },
};

const fetchAbility = async (req, res) => {
  const { id } = req.params;

  if (isNumericalString(id)) return fetchAbilityById(id, req, res);
  else if (isAlphabeticalString(id)) return fetchAbilityByName(id, req, res);

  res.status(400).json(InvalidIdErrorPayload);
};

const fetchAbilityById = async (id, req, res) => {
  const [ability] = await AbilityModel.find({ id }, { _id: 0, __v: 0 });

  if (!ability) return res.status(500).json(AbilityNotFoundErrorPayload);

  return res.status(200).json({
    success: true,
    data: ability,
  });
};

const fetchAbilityByName = async (name, req, res) => {
  const [ability] = await AbilityModel.find({ name }, { _id: 0, __v: 0 });

  if (!ability) return res.status(500).json(AbilityNotFoundErrorPayload);

  return res.status(200).json({
    success: true,
    data: ability,
  });
};

module.exports = { fetchAbility, fetchAbilityById, fetchAbilityByName };
