const plmWpSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",

  $id: "https://example.local/schemas/plm-wp.schema.json",

  title: "PLM Work Package",

  description: "Phase 2 structural schema for PLM Work Package JSON.",

  type: "object",

  additionalProperties: false,

  required: [
    "workPackageHeader",
    "productMaster",
    "billOfMaterials",
    "masterManufacturingProcessGroup",
  ],

  properties: {
    // =====================================================
    // 1. WORK PACKAGE HEADER
    // =====================================================

    workPackageHeader: {
      type: "object",

      additionalProperties: false,

      required: [
        "workPackageId",
        "title",
        "revision",
        "status",
        "releasedDate",
        "targetPlant",
        "author",
      ],

      properties: {
        workPackageId: {
          type: "string",
          minLength: 1,
        },

        title: {
          type: "string",
          minLength: 1,
        },

        revision: {
          type: "string",
          minLength: 1,
        },

        status: {
          type: "string",
          minLength: 1,
        },

        releasedDate: {
          type: "string",
          format: "date-time",
        },

        targetPlant: {
          type: "string",
          minLength: 1,
        },

        author: {
          type: "string",
          minLength: 1,
        },
      },
    },

    // =====================================================
    // 2. PRODUCT MASTER
    // =====================================================

    productMaster: {
      type: "object",

      additionalProperties: false,

      required: [
        "productPartNumber",
        "productName",
        "category",
        "unitOfMeasure",
      ],

      properties: {
        productPartNumber: {
          type: "string",
          minLength: 1,
        },

        productName: {
          type: "string",
          minLength: 1,
        },

        category: {
          type: "string",
          minLength: 1,
        },

        unitOfMeasure: {
          type: "string",
          minLength: 1,
        },
      },
    },

    // =====================================================
    // 3. BILL OF MATERIALS
    // =====================================================

    billOfMaterials: {
      type: "object",

      additionalProperties: false,

      required: ["bomId", "bomType", "totalComponentTypes", "items"],

      properties: {
        bomId: {
          type: "string",
          minLength: 1,
        },

        bomType: {
          type: "string",
          minLength: 1,
        },

        totalComponentTypes: {
          type: "integer",
          minimum: 0,
        },

        items: {
          type: "array",

          minItems: 1,

          items: {
            type: "object",

            additionalProperties: false,

            required: [
              "itemNumber",
              "partNumber",
              "description",
              "category",
              "quantity",
              "unitOfMeasure",
              "isCritical",
              "revision",
            ],

            properties: {
              itemNumber: {
                type: "integer",
                minimum: 1,
              },

              partNumber: {
                type: "string",
                minLength: 1,
              },

              description: {
                type: "string",
                minLength: 1,
              },

              category: {
                type: "string",
                minLength: 1,
              },

              quantity: {
                type: "number",
                exclusiveMinimum: 0,
              },

              unitOfMeasure: {
                type: "string",
                minLength: 1,
              },

              isCritical: {
                type: "boolean",
              },

              revision: {
                type: "string",
                minLength: 1,
              },
            },
          },
        },
      },
    },

    // =====================================================
    // 4. MASTER MANUFACTURING PROCESS GROUP
    // =====================================================

    masterManufacturingProcessGroup: {
      type: "object",

      additionalProperties: false,

      required: [
        "mfgpId",
        "mfgpName",
        "routingVersion",
        "totalOperations",
        "operations",
      ],

      properties: {
        mfgpId: {
          type: "string",
          minLength: 1,
        },

        mfgpName: {
          type: "string",
          minLength: 1,
        },

        routingVersion: {
          type: "string",
          minLength: 1,
        },

        totalOperations: {
          type: "integer",
          minimum: 0,
        },

        operations: {
          type: "array",

          minItems: 1,

          items: {
            type: "object",

            additionalProperties: false,

            required: [
              "sequence",
              "operationCode",
              "operationName",
              "workCenter",
              "setupTimeMinutes",
              "cycleTimeSeconds",
              "assignedComponents",
              "inspectionRequired",
            ],

            properties: {
              sequence: {
                type: "integer",
                minimum: 1,
              },

              operationCode: {
                type: "string",
                minLength: 1,
              },

              operationName: {
                type: "string",
                minLength: 1,
              },

              workCenter: {
                type: "string",
                minLength: 1,
              },

              setupTimeMinutes: {
                type: "number",
                minimum: 0,
              },

              cycleTimeSeconds: {
                type: "number",
                minimum: 0,
              },

              assignedComponents: {
                type: "array",

                items: {
                  type: "string",
                  minLength: 1,
                },
              },

              inspectionRequired: {
                type: "boolean",
              },

              inspectionCode: {
                type: "string",
                minLength: 1,
              },
            },
          },
        },
      },
    },
  },
};

export default plmWpSchema;
