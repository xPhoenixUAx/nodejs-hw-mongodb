import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().min(3).max(30).email().required(),
  password: Joi.string().min(6).max(20).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().min(3).max(30).email().required(),
  password: Joi.string().min(6).max(20).required(),
});
export const requestResetPasswordSchema = Joi.object({
  email: Joi.string().min(3).max(30).email().required(),
});

export const resetPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
