import Joi from "joi";

const createStudent = Joi.object().keys({
  name: Joi.string().required().messages({
    "any.required": "Name is required",
    "string.empty": "Name cannot be empty",
    "string.base": "Name must be a string",
  }),

  rollNumber: Joi.string().required().messages({
    "any.required": "Roll number is required",
    "string.empty": "Roll number cannot be empty",
    "string.base": "Roll number must be a string",
  }),

  course: Joi.string().required().messages({
    "any.required": "Course is required",
    "string.empty": "Course cannot be empty",
    "string.base": "Course must be a string",
  }),

  age: Joi.number().integer().min(1).required().messages({
    "any.required": "Age is required",
    "number.base": "Age must be a number",
    "number.empty": "Age cannot be empty",
    "number.min": "Age must be at least 1",
  }),

  std: Joi.string().required().messages({
    "any.required": "Standard is required",
    "string.empty": "Standard cannot be empty",
    "string.base": "Standard must be a string",
  }),

  division: Joi.string().required().messages({
    "any.required": "Division is required",
    "string.empty": "Division cannot be empty",
    "string.base": "Division must be a string",
  }),
});

export default {
  createStudent,
};
