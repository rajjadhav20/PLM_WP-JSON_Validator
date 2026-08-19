import { parse } from "json-source-map";

export function createSourceMap(jsonText) {
  try {
    const result = parse(jsonText);

    return result.pointers;
  } catch {
    return {};
  }
}

function escapeJsonPointerSegment(segment) {
  return String(segment).replace(/~/g, "~0").replace(/\//g, "~1");
}

export function getErrorPointer(error) {
  let path = error.path || "/";

  /*
   * AJV required errors point to the parent object.
   *
   * Example:
   *
   * path:
   * /workPackageHeader
   *
   * missingProperty:
   * workPackageId
   *
   * We want:
   *
   * /workPackageHeader/workPackageId
   */

  if (error.keyword === "required" && error.params?.missingProperty) {
    const property = escapeJsonPointerSegment(error.params.missingProperty);

    path = path === "/" ? `/${property}` : `${path}/${property}`;
  }

  return path;
}

export function getErrorLocation(pointers, error) {
  const pointer = getErrorPointer(error);

  let location = pointers[pointer];

  /*
   * Required properties do not physically exist
   * in the JSON, so their pointer won't exist.
   *
   * In that case, fall back to the parent.
   */

  if (!location) {
    location = pointers[error.path || "/"];
  }

  if (!location) {
    return {
      lineNumber: null,
      column: null,
      pointer,
    };
  }

  const position = location.key || location.value;

  return {
    lineNumber: position ? position.line + 1 : null,

    column: position ? position.column + 1 : null,

    pointer,
  };
}
