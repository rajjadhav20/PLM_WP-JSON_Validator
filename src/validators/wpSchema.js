const wpSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  type: "object",
  required: ["name", "version", "components"],
  properties: {
    name: {
      type: "string",
      minLength: 1,
    },
    version: {
      type: "string",
      minLength: 1,
    },
    components: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "name", "quantity"],
        properties: {
          id: {
            type: "string",
            minLength: 1,
          },
          name: {
            type: "string",
            minLength: 1,
          },
          quantity: {
            type: "number",
            minimum: 1,
          },
        },
        additionalProperties: true,
      },
    },
  },
  additionalProperties: true,
};

export default wpSchema;
