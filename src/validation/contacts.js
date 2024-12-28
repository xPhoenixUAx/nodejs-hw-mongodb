import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phoneNumber: Joi.string().min(6).max(16).required(),
  email: Joi.string().email().required(),
  isFavorite: Joi.boolean().required(),
});
