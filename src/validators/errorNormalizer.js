export function normalizeValidationErrors(errors = []) {
  return errors.map((error, index) => {
    let category;
    switch (error.keyword) {
      case "required":
        category = "Required Field";
        break;

      case "type":
        category = "Invalid Type";
        break;

      case "format":
        category = "Invalid Format";
        break;

      case "additionalProperties":
        category = "Unexpected Property";
        break;

      case "minimum":
      case "maximum":
      case "exclusiveMinimum":
      case "exclusiveMaximum":
        category = "Invalid Value";
        break;

      case "minLength":
      case "maxLength":
        category = "Invalid Length";
        break;

      case "minItems":
      case "maxItems":
        category = "Invalid Array Length";
        break;

      default:
        category = error.keyword || "Other";
    }

    return {
      id: index + 1,

      category,

      keyword: error.keyword,

      path: error.instancePath || "/",

      message: error.message || "Validation error",

      schemaPath: error.schemaPath || "",

      params: error.params || {},
    };
  });
}
