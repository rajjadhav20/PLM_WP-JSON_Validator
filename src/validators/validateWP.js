import Ajv2020 from "ajv/dist/2020.js";
import wpSchema from "./wpSchema";

const ajv = new Ajv2020({ allErrors: true, strict: false });

const validate = ajv.compile(wpSchema);

export function validateWP(data) {
  const valid = validate(data);
  return { valid, errors: validate.errors || [] };
}
