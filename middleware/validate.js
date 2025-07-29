import { apiResponse } from "../helper/apiResponse.js";
import { StatusCodes } from "http-status-codes";

const validate = (schema) => (req, res, next) => {
  if (!schema) {
    return apiResponse({
      res,
      status: false,
      message: "Validation schema not found",
      statusCode: StatusCodes.BAD_REQUEST,
    });
  }

  const { error } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorMessage = error.details[0].message;

    return apiResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: errorMessage,
      status: false,
    });
  }

  next();
};

export default validate;
