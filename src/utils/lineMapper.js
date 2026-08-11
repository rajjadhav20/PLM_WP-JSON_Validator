export function getLineNumber(jsonText, instancePath) {
  if (!instancePath || instancePath === "/") {
    return 1;
  }

  const segments = instancePath
    .replace(/^\//, "")
    .split("/")
    .map((segment) => segment.replace(/~1/g, "/").replace(/~0/g, "~"));

  const lines = jsonText.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const lastSegment = segments[segments.length - 1];

    if (
      line.includes(`"${lastSegment}"`) ||
      line.includes(`"${lastSegment}":`)
    ) {
      return i + 1;
    }
  }

  return null;
}
