import Joi from "joi";
import dotenv from "dotenv";
import { parseJoiError } from "../helper/apiResponse.js";

dotenv.config({ path: ".env" });

const envVarsSchema = Joi.object({
  PORT: Joi.number().description("port number"),
  MONGODB_URL: Joi.string().trim().description("Mongodb url"),
  JWT_SECRET_KEY: Joi.string().description("Jwt secret key"),

})
  .unknown()
  .prefs({ errors: { label: "key" } });

const { value: envVars, error } = envVarsSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  const parsedError = parseJoiError(error);
  console.log("Config Error: ", parsedError);
}

export default {
  port: envVars.PORT,
  mongodb: {
    url: envVars.MONGODB_URL,
    options: {},
  },
  jwt: {
    secretKey: envVars.JWT_SECRET_KEY,
    expiresIn: envVars.JWT_TOKEN_EXPIRES_IN,
  },
};
