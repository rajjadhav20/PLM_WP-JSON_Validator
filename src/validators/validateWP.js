import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";

import plmWpSchema from "./wpSchema";

import { normalizeValidationErrors } from "./errorNormalizer";

const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
});

addFormats(ajv);

const validate = ajv.compile(plmWpSchema);

export function validateWP(data) {
  const valid = validate(data);

  const rawErrors = validate.errors || [];

  const errors = normalizeValidationErrors(rawErrors);

  return {
    valid,
    errors,
  };
}

export default validateWP;
