/**
 * Normalize AJV validation errors into a structure
 * that can be consumed easily by Phase 3 + Phase 4 + Phase 5.
 */

export function normalizeErrors(errors = []) {
  return errors.map((error, index) => {
    const path = error.instancePath || error.dataPath || "";

    let category;

    switch (error.keyword) {
      case "required":
        category = "Required Field";
        break;

      case "type":
        category = "Type Error";
        break;

      case "format":
        category = "Format Error";
        break;

      case "enum":
        category = "Invalid Value";
        break;

      case "additionalProperties":
        category = "Additional Property";
        break;

      case "minLength":
      case "maxLength":
      case "pattern":
        category = "String Constraint";
        break;

      case "minimum":
      case "maximum":
      case "exclusiveMinimum":
      case "exclusiveMaximum":
        category = "Number Constraint";
        break;

      case "minItems":
      case "maxItems":
        category = "Array Constraint";
        break;

      default:
        category = "Schema Validation";
    }

    return {
      id: index + 1,

      keyword: error.keyword,

      instancePath: path,

      schemaPath: error.schemaPath || "",

      message: error.message || "Validation error",

      category,

      severity: "ERROR",

      params: error.params || {},

      originalError: error,
    };
  });
}

/**
 * Add application-level warnings.
 *
 * These are not AJV schema errors.
 * They represent additional PLM WP quality checks.
 */
export function generateWarnings(data) {
  const warnings = [];

  if (!data || typeof data !== "object") {
    return warnings;
  }

  /*
   * Example warning:
   * Work package has no description.
   */
  if (
    Object.prototype.hasOwnProperty.call(data, "description") &&
    !data.description
  ) {
    warnings.push({
      id: `warning-description`,
      keyword: "businessRule",
      instancePath: "/description",
      schemaPath: "",
      message: "Work package description is empty.",
      category: "Business Rule",
      severity: "WARNING",
      params: {},
    });
  }

  /*
   * Example warning for operations.
   */
  if (Array.isArray(data.operations) && data.operations.length === 0) {
    warnings.push({
      id: `warning-operations`,
      keyword: "businessRule",
      instancePath: "/operations",
      schemaPath: "",
      message: "Work package contains no operations.",
      category: "Business Rule",
      severity: "WARNING",
      params: {},
    });
  }

  return warnings;
}
