# PLM WP JSON Validator

A lightweight **React + Vite frontend application** for validating PLM WP JSON files against a configurable **JSON Schema**.

The application allows users to upload a local `.json` file, parse and validate its contents, display validation results and errors, and preview the uploaded JSON with line numbers.

> **Note:** The included PLM WP schema is a starter/example schema. It should be replaced with the actual PLM WP JSON specification and business rules.

---

## 🚀 Features

- 📁 Upload local PLM WP JSON files
- 🔍 Validate JSON syntax
- ✅ Validate JSON data against JSON Schema
- 🧩 Powered by **AJV**
- 📊 Display validation status
- ❌ Display validation errors
- 🛣️ Display JSON instance paths
- 📋 Display schema paths
- 🔢 JSON preview with line numbers
- 🔄 Reset validation state
- 💻 Fully frontend-based
- 🔒 No backend or database required
- 📱 Responsive layout
- 🎨 Clean PLM-style validation interface

---

## 🏗️ Architecture

```text
                    ┌──────────────────────┐
                    │      User            │
                    │  Select JSON File    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   FileUploader.jsx   │
                    │  File Selection      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      App.jsx         │
                    │ Application State    │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
        ┌─────────────────┐        ┌──────────────────┐
        │   JSON.parse()  │        │    JsonViewer    │
        │ Syntax Check    │        │ JSON + Line No.  │
        └────────┬────────┘        └──────────────────┘
                 │
                 ▼
        ┌──────────────────────┐
        │     validateWP()     │
        │       AJV            │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │     wpSchema.js      │
        │    JSON Schema       │
        └──────────┬───────────┘
                   │
                   ▼
        ┌────────────────────────────┐
        │     Validation Result      │
        │                            │
        │ valid / invalid            │
        │ validation errors          │
        │ instance paths             │
        │ schema paths               │
        └────────────┬───────────────┘
                     │
             ┌───────┴────────┐
             ▼                ▼
    ┌────────────────┐ ┌──────────────────┐
    │ Validation     │ │ Validation       │
    │ Summary        │ │ Errors           │
    └────────────────┘ └──────────────────┘
```

---

## 🛠️ Tech Stack

| Technology   | Purpose                           |
| ------------ | --------------------------------- |
| React        | Frontend UI                       |
| Vite         | Development server and build tool |
| JavaScript   | Application logic                 |
| AJV          | JSON Schema validation            |
| JSON Schema  | Data validation rules             |
| Lucide React | UI icons                          |
| CSS          | Styling and responsive layout     |

---

## 📂 Project Structure

```text
plm-wp-validator/
│
├── public/
│
├── src/
│   │
│   ├── components/
│   │   ├── FileUploader.jsx
│   │   ├── ValidationSummary.jsx
│   │   ├── ValidationErrors.jsx
│   │   └── JsonViewer.jsx
│   │
│   ├── validators/
│   │   ├── wpSchema.js
│   │   └── validateWP.js
│   │
│   ├── utils/
│   │   └── lineMapper.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── package-lock.json
├── index.html
└── README.md
```

The component structure separates file uploading, validation results, validation errors, and JSON visualization, while the `validators` and `utils` folders isolate validation and line-mapping logic.

---

# 📦 Installation

## 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Example:

```bash
git clone https://github.com/<your-username>/plm-wp-json-validator.git
```

Navigate into the project:

```bash
cd plm-wp-json-validator
```

---

## 2. Install dependencies

```bash
npm install
```

Install the required packages:

```bash
npm install ajv lucide-react
```

The project guide uses Vite with the React template and installs `ajv` and `lucide-react` as the main additional dependencies.

---

## 3. Start the development server

```bash
npm run dev
```

Vite will display a local development URL in the terminal.

Open that URL in your browser.

---

# 🧪 How the Application Works

The validation pipeline is:

```text
JSON File
   │
   ▼
File.text()
   │
   ▼
Raw JSON String
   │
   ▼
JSON.parse()
   │
   ├── ❌ Invalid JSON
   │       │
   │       ▼
   │   Parsing Error
   │
   └── ✅ Valid JSON
           │
           ▼
       validateWP()
           │
           ▼
          AJV
           │
           ▼
      wpSchema.js
           │
           ▼
    Validation Result
           │
      ┌────┴────┐
      ▼         ▼
   VALID     INVALID
      │         │
      ▼         ▼
  Success    Error List
```

The browser reads the selected file using `File.text()`. The text is then parsed using `JSON.parse()`. If parsing succeeds, AJV validates the resulting JavaScript object against `wpSchema.js`.

---

# 📋 JSON Schema

The current example schema expects the root JSON object to contain:

```text
name
version
components
```

Each component requires:

```text
id
name
quantity
```

The current rules include:

- `name` → string
- `version` → string
- `components` → array
- `id` → string
- `name` → string
- `quantity` → number
- `quantity` → minimum value of `1`

The schema also allows additional properties.

### Example Valid JSON

```json
{
  "name": "Sample Work Package",
  "version": "1.0.0",
  "components": [
    {
      "id": "COMP-001",
      "name": "Engine Assembly",
      "quantity": 2
    },
    {
      "id": "COMP-002",
      "name": "Brake Assembly",
      "quantity": 4
    }
  ]
}
```

### Example Invalid JSON

```json
{
  "name": "",
  "components": [
    {
      "id": "",
      "name": "Engine Assembly",
      "quantity": 0
    }
  ]
}
```

This can produce validation errors because:

- `version` is missing
- `name` has a minimum length requirement
- component `id` has a minimum length requirement
- `quantity` must be at least `1`

---

# 🔎 Validation Engine

AJV is configured with:

```javascript
const ajv = new Ajv({
  allErrors: true,
  strict: false,
});
```

`allErrors: true` allows the application to return multiple validation errors instead of stopping at the first error.

The validation function returns:

```javascript
{
  valid: true,
  errors: []
}
```

or:

```javascript
{
  valid: false,
  errors: [...]
}
```

---

# ❌ Validation Errors

For every validation error, the application can display:

```text
Error Number
Validation Keyword
Error Message
JSON Instance Path
Schema Path
```

Example:

```text
#1
required

must have required property 'version'

Path: /

Schema: #/required
```

For nested data:

```text
Path: /components/0/quantity
```

This makes it easier to understand which part of the JSON failed validation.

---

# 🔢 JSON Line Numbers

The JSON viewer displays the uploaded JSON with line numbers:

```text
1   {
2     "name": "Sample Work Package",
3     "version": "1.0.0",
4     "components": [
5       {
6         "id": "COMP-001",
7         "name": "Engine Assembly",
8         "quantity": 2
9       }
10    ]
11  }
```

The current `JsonViewer` renders each line separately and displays its corresponding line number.

---

# 🧭 Line Mapping

The project contains:

```text
src/utils/lineMapper.js
```

Its purpose is to map an AJV `instancePath` to a line in the original JSON text.

For example:

```text
/components/0/quantity
```

can be used to identify the relevant JSON field.

The utility also handles JSON Pointer escaping such as:

```text
~1 → /
~0 → ~
```

> **Current limitation:** the supplied implementation uses a simple line/key search. It is not a full JSON parser-based source-location mapper, so duplicate keys or complex structures may require a more robust implementation.

---

# 🖥️ User Interface

The application contains the following major UI sections.

## Header

Displays:

```text
PLM WP JSON Validator
Local JSON validation and inspection tool
```

It also provides a **Reset** button.

---

## File Upload

Users can select a local JSON file.

Supported format:

```text
.json
```

The uploader rejects non-JSON files.

---

## Validation Summary

After validation, the dashboard displays:

```text
Status
Errors
File
```

Example:

```text
STATUS       VALID
ERRORS       0
FILE         sample-wp.json
```

---

## Validation Status

For valid JSON:

```text
✓ The uploaded PLM WP JSON passed all configured validation rules.
```

For invalid JSON:

```text
✕ The uploaded PLM WP JSON contains validation errors.
```

---

# 🔐 Security & Privacy

This application performs validation in the browser.

The basic workflow is:

```text
Local File
    ↓
Browser
    ↓
File.text()
    ↓
JSON.parse()
    ↓
AJV
    ↓
Validation Result
```

There is no backend component in the supplied architecture.

Therefore, the application is designed as a **frontend-only JSON inspection and validation tool**.

> Avoid uploading confidential production PLM data to external services unless the application's architecture and security requirements explicitly permit it.

---

# ⚙️ Configuration

The main configuration point is:

```text
src/validators/wpSchema.js
```

Replace the starter schema with the actual PLM WP JSON specification.

For example:

```javascript
const wpSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",

  type: "object",

  required: ["name", "version", "components"],

  properties: {
    name: {
      type: "string",
    },

    version: {
      type: "string",
    },

    components: {
      type: "array",
    },
  },
};

export default wpSchema;
```

The supplied documentation explicitly states that the exact PLM WP JSON specification was not provided, so `wpSchema.js` is intended as a starter example.

---

# 🧩 Customizing the PLM Schema

For a production implementation, the schema can be extended to support:

- Nested objects
- Arrays
- Required properties
- Optional properties
- Enumerations
- String constraints
- Number constraints
- Boolean values
- Date formats
- `$ref`
- Conditional validation
- Custom business rules
- Multiple PLM WP versions

Example:

```javascript
{
  type: "object",
  required: ["id", "status"],

  properties: {
    id: {
      type: "string",
      minLength: 1
    },

    status: {
      type: "string",
      enum: [
        "DRAFT",
        "ACTIVE",
        "RELEASED"
      ]
    }
  }
}
```

---

# 🏛️ Component Responsibilities

## `App.jsx`

Main application controller.

Responsibilities:

- Maintain application state
- Read selected files
- Parse JSON
- Trigger validation
- Handle parsing errors
- Reset application state
- Render application sections

---

## `FileUploader.jsx`

Responsible for:

- File selection
- `.json` extension validation
- Passing selected files to the parent component

---

## `ValidationSummary.jsx`

Responsible for displaying:

- Validation status
- Number of errors
- Uploaded filename

---

## `ValidationErrors.jsx`

Responsible for displaying:

- AJV errors
- Error keyword
- Error message
- Instance path
- Schema path

---

## `JsonViewer.jsx`

Responsible for:

- Displaying uploaded JSON
- Rendering line numbers
- Providing a readable JSON preview

---

## `wpSchema.js`

Contains the JSON Schema validation rules.

---

## `validateWP.js`

Creates the AJV validator and exposes:

```javascript
validateWP(data);
```

---

## `lineMapper.js`

Provides utility functionality for mapping JSON paths to source lines.

---

# 📊 System Design

```text
┌─────────────────────────────────────────────┐
│                  Browser                    │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │              React App                │  │
│  │                                       │  │
│  │  FileUploader                         │  │
│  │       │                               │  │
│  │       ▼                               │  │
│  │    App.jsx                            │  │
│  │       │                               │  │
│  │       ├───────────────┐               │  │
│  │       ▼               ▼               │  │
│  │  JSON.parse()    JsonViewer           │  │
│  │       │                               │  │
│  │       ▼                               │  │
│  │  validateWP()                         │  │
│  │       │                               │  │
│  │       ▼                               │  │
│  │      AJV                              │  │
│  │       │                               │  │
│  │       ▼                               │  │
│  │  wpSchema.js                          │  │
│  │       │                               │  │
│  │       ▼                               │  │
│  │ Validation Result                     │  │
│  │       │                               │  │
│  │   ┌───┴──────────────┐                │  │
│  │   ▼                  ▼                │  │
│  │ Summary          Error Details        │  │
│  └───────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

---

# 🔄 Application Flow

```text
1. User opens application
             ↓
2. User selects .json file
             ↓
3. Browser reads file
             ↓
4. JSON text displayed
             ↓
5. JSON.parse()
             ↓
        ┌────┴────┐
        │         │
     Invalid    Valid
        │         │
        ▼         ▼
   Parse Error   AJV
                  │
                  ▼
              JSON Schema
                  │
           ┌──────┴──────┐
           ▼             ▼
         Valid         Invalid
           │             │
           ▼             ▼
        Success      Error List
                         │
                         ▼
                   Error Details
```

---

# 🚀 Production Build

Create a production build using:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

# 🧹 Reset Application

Click the **Reset** button to clear:

```text
JSON text
Validation result
Parsing errors
```

The application then returns to the initial upload state.

---

# 📱 Responsive Design

The application includes a responsive layout.

For smaller screens, the three-column validation summary changes to a single-column layout.

The supplied CSS includes a media query for screens below `700px`.

---

# 🔮 Future Enhancements

The following improvements are recommended for the next version:

### File Handling

- Drag-and-drop upload
- File size validation
- Multiple file support
- Recent files

### Validation

- Highlight exact JSON lines
- Warning vs. error severity
- Custom business-rule validation
- Multiple schema versions
- Schema selection
- JSON Schema `$ref` support

### JSON Viewer

- Expandable JSON tree
- Syntax highlighting
- Search within JSON
- Error-line highlighting
- Collapsible objects and arrays

### Reporting

- Export validation results as JSON
- Export validation results as CSV
- Generate PDF validation reports
- Download validation reports

### History

- Local validation history
- Previous validation results
- Validation timestamps
- File metadata

### UI/UX

- Professional PLM dashboard
- Dark mode
- Improved error navigation
- Error filtering
- Search validation errors
- Improved accessibility

These enhancements are consistent with the recommendations in the supplied project guide.

---

# 🧪 Testing Strategy

A production version should include tests for:

### JSON Parsing

```text
Valid JSON
Invalid JSON
Empty JSON
Malformed JSON
```

### Schema Validation

```text
Missing required fields
Invalid data types
Invalid arrays
Invalid numbers
Invalid enum values
Nested validation errors
```

### UI

```text
File upload
Reset
Validation success
Validation failure
Error display
JSON preview
Responsive layout
```

---

# 🐛 Troubleshooting

## `npm run dev` does not work

Check the available scripts:

```bash
npm run
```

Then verify that `package.json` contains:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## AJV validation error

Verify that the schema is compatible with the AJV version installed in the project.

Check:

```bash
npm list ajv
```

Also verify the schema declaration:

```javascript
$schema: "https://json-schema.org/draft/2020-12/schema";
```

---

## JSON parsing error

Make sure the uploaded file contains valid JSON.

For example, this is invalid:

```json
{
  "name": "Test"
}
```

because JSON does not allow the trailing comma.

Correct:

```json
{
  "name": "Test"
}
```

---

# 📌 Current Limitations

The current project is a frontend starter implementation.

Important limitations include:

1. The exact production PLM WP JSON specification is not included.
2. The provided schema is therefore only an example.
3. Validation is currently performed in the browser.
4. Line mapping uses a simple text/key lookup approach.
5. There is no backend persistence.
6. There is no validation history.
7. There is no report-generation functionality.
8. There is no schema version management.

The project documentation specifically recommends replacing the starter schema with the actual PLM WP specification before production use.

---

# 👨‍💻 Development

Start the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# 📜 License

This project can be adapted for educational, portfolio, or internal development purposes.

Add an appropriate license before distributing the project publicly.

---

# ⭐ Why This Project Is Valuable

This project demonstrates practical frontend engineering concepts including:

- React component architecture
- Vite development workflow
- File handling in the browser
- JSON parsing
- JSON Schema
- AJV validation
- Error handling
- State management with React hooks
- Reusable components
- Data visualization
- Responsive UI
- Enterprise-oriented validation workflows

It can also serve as a foundation for a larger **PLM/MES JSON validation and inspection platform**.

---

# 📞 Project Summary

**PLM WP JSON Validator** is a frontend-only React application designed to provide a simple and user-friendly interface for validating PLM WP JSON files.

```text
Upload
   ↓
Parse
   ↓
Validate
   ↓
Analyze Errors
   ↓
Inspect JSON
```

The architecture is intentionally modular so that the starter schema, validation engine, UI components, and future PLM-specific business rules can be expanded independently.
