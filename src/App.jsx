import { useMemo, useState } from "react";

import {
  FileJson,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Download,
} from "lucide-react";

// ============================================================
// PHASE 3 COMPONENTS
// ============================================================

import FileUploader from "./components/FileUploader";
import ValidationSummary from "./components/ValidationSummary";
import ValidationErrors from "./components/ValidationErrors";
import ValidationFilters from "./components/ValidationFilters";

// ============================================================
// PHASE 4 COMPONENTS
// ============================================================

import JsonTreeViewer from "./components/JsonTreeViewer";
import JsonSearch from "./components/JsonSearch";
import ErrorInspector from "./components/ErrorInspector";

// ============================================================
// VALIDATOR
// ============================================================

import { validateWP } from "./validators/validateWP";

// ============================================================
// CSS
// ============================================================

import "./index.css";

function App() {
  // ============================================================
  // PHASE 3 STATE
  // ============================================================

  // Uploaded file
  const [file, setFile] = useState(null);

  // Original JSON text
  const [jsonText, setJsonText] = useState("");

  // Parsed JSON object
  const [parsedJson, setParsedJson] = useState(null);

  // Validation result
  const [validationResult, setValidationResult] = useState(null);

  // JSON parsing error
  const [parseError, setParseError] = useState(null);

  // Validation loading state
  const [isValidating, setIsValidating] = useState(false);

  // Currently selected validation error
  const [selectedError, setSelectedError] = useState(null);

  // Selected source line
  const [selectedLine, setSelectedLine] = useState(null);

  // Phase 3 validation filter
  const [activeFilter, setActiveFilter] = useState("ALL");

  // ============================================================
  // PHASE 4 STATE
  // ============================================================

  // Currently selected JSON path
  const [selectedPath, setSelectedPath] = useState(null);

  // Currently selected JSON node
  const [selectedNode, setSelectedNode] = useState(null);

  // Expanded JSON tree paths
  const [expandedPaths, setExpandedPaths] = useState(new Set(["/"]));

  // JSON search query
  const [searchQuery, setSearchQuery] = useState("");

  // ============================================================
  // FILE UPLOAD + JSON PARSING + VALIDATION
  // ============================================================

  async function handleFileUpload(uploadedFile) {
    if (!uploadedFile) {
      return;
    }

    // ----------------------------------------------------------
    // Reset previous validation state
    // ----------------------------------------------------------

    setFile(uploadedFile);

    setJsonText("");

    setParsedJson(null);

    setValidationResult(null);

    setParseError(null);

    setSelectedError(null);

    setSelectedNode(null);

    setSelectedPath(null);

    setSelectedLine(null);

    setSearchQuery("");

    setActiveFilter("ALL");

    setExpandedPaths(new Set(["/"]));

    try {
      // --------------------------------------------------------
      // Read local file
      // --------------------------------------------------------

      const text = await uploadedFile.text();

      setJsonText(text);

      // --------------------------------------------------------
      // Parse JSON
      // --------------------------------------------------------

      let data;

      try {
        data = JSON.parse(text);
      } catch (error) {
        console.error("JSON parsing error:", error);

        setParsedJson(null);

        setParseError(`Invalid JSON syntax: ${error.message}`);

        return;
      }

      // Save parsed JSON
      setParsedJson(data);

      // --------------------------------------------------------
      // Start schema validation
      // --------------------------------------------------------

      setIsValidating(true);

      const result = validateWP(data, text);

      setValidationResult(result);
    } catch (error) {
      console.error("File processing error:", error);

      setParseError(error.message || "Unable to process the uploaded file.");
    } finally {
      setIsValidating(false);
    }
  }

  // ============================================================
  // PHASE 3
  // HANDLE VALIDATION ERROR CLICK
  // ============================================================

  function handleErrorClick(error) {
    console.log("Selected validation error:", error);

    // Save selected error
    setSelectedError(error);

    // Clear selected JSON node
    setSelectedNode(null);

    // ----------------------------------------------------------
    // Determine JSON Pointer
    // ----------------------------------------------------------

    const errorPath = error.pointer || error.instancePath || error.path || "/";

    // Save selected path
    setSelectedPath(errorPath);

    // ----------------------------------------------------------
    // Expand parent nodes
    // ----------------------------------------------------------

    expandParents(errorPath);

    // ----------------------------------------------------------
    // Source line
    // ----------------------------------------------------------

    if (error.lineNumber !== undefined && error.lineNumber !== null) {
      setSelectedLine(error.lineNumber);
    } else {
      setSelectedLine(null);
    }
  }

  // ============================================================
  // PHASE 4
  // EXPAND PARENT JSON PATHS
  // ============================================================

  function expandParents(path) {
    if (!path || path === "/") {
      setExpandedPaths((previous) => {
        const next = new Set(previous);

        next.add("/");

        return next;
      });

      return;
    }

    // ----------------------------------------------------------
    // Split JSON Pointer
    // ----------------------------------------------------------

    const parts = path.split("/").filter(Boolean);

    const paths = ["/"];

    let currentPath = "";

    // ----------------------------------------------------------
    // Build parent paths
    // ----------------------------------------------------------

    for (const part of parts) {
      // Decode JSON Pointer
      // ~1 = /
      // ~0 = ~

      const decodedPart = part.replace(/~1/g, "/").replace(/~0/g, "~");

      currentPath += "/" + decodedPart;

      paths.push(currentPath);
    }

    // ----------------------------------------------------------
    // Add paths to expanded set
    // ----------------------------------------------------------

    setExpandedPaths((previous) => {
      const next = new Set(previous);

      paths.forEach((path) => {
        next.add(path);
      });

      return next;
    });
  }

  // ============================================================
  // PHASE 4
  // TOGGLE TREE NODE
  // ============================================================

  function handleToggle(path) {
    setExpandedPaths((previous) => {
      const next = new Set(previous);

      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }

      return next;
    });
  }

  // ============================================================
  // PHASE 4
  // SELECT JSON NODE
  // ============================================================

  function handleNodeSelect(node) {
    console.log("Selected JSON node:", node);

    // Save selected node
    setSelectedNode(node);

    // Save selected path
    setSelectedPath(node.path);

    // Clear validation error selection
    setSelectedError(null);

    // Clear source line selection
    setSelectedLine(null);
  }

  // ============================================================
  // PHASE 4
  // SEARCH RESULT COUNT
  // ============================================================

  const searchResultCount = useMemo(() => {
    // Nothing to search
    if (!parsedJson || !searchQuery.trim()) {
      return 0;
    }

    let count = 0;

    const query = searchQuery.toLowerCase().trim();

    // --------------------------------------------------------
    // Recursive JSON search
    // --------------------------------------------------------

    function walk(value, key = "") {
      let searchableText = key;

      // Primitive value
      if (value === null) {
        searchableText += " null";
      } else if (typeof value !== "object") {
        searchableText += ` ${String(value)}`;
      }

      // Check current node
      if (searchableText.toLowerCase().includes(query)) {
        count++;
      }

      // Search nested objects / arrays
      if (value && typeof value === "object") {
        Object.entries(value).forEach(([childKey, childValue]) => {
          walk(childValue, childKey);
        });
      }
    }

    walk(parsedJson);

    return count;
  }, [parsedJson, searchQuery]);

  // ============================================================
  // RESET APPLICATION
  // ============================================================

  function handleReset() {
    setFile(null);

    setJsonText("");

    setParsedJson(null);

    setValidationResult(null);

    setParseError(null);

    setIsValidating(false);

    setSelectedError(null);

    setSelectedLine(null);

    setSelectedPath(null);

    setSelectedNode(null);

    setSearchQuery("");

    setActiveFilter("ALL");

    setExpandedPaths(new Set(["/"]));
  }

  // ============================================================
  // DOWNLOAD ORIGINAL JSON
  // ============================================================

  function handleDownload() {
    if (!jsonText) {
      return;
    }

    const blob = new Blob([jsonText], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = file?.name || "plm-wp.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  // ============================================================
  // ALL VALIDATION ERRORS
  //
  // IMPORTANT:
  // Wrapped in useMemo so ESLint does not report:
  //
  // "allErrors could make dependencies change
  // on every render"
  // ============================================================

  const allErrors = useMemo(() => {
    return validationResult?.errors ?? [];
  }, [validationResult]);

  // ============================================================
  // FILTER VALIDATION ERRORS
  // ============================================================

  const filteredErrors = useMemo(() => {
    if (activeFilter === "ALL") {
      return allErrors;
    }

    return allErrors.filter((error) => error.category === activeFilter);
  }, [allErrors, activeFilter]);

  // ============================================================
  // VALIDATION STATUS
  // ============================================================

  const isValid = validationResult?.valid === true;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="app-container">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="app-header">
        <div className="header-title">
          <FileJson size={32} />

          <div>
            <h1>PLM WP JSON Validator</h1>

            <p>Validate and inspect PLM Work Package JSON</p>
          </div>
        </div>

        <div className="header-actions">
          {/* Download */}

          {file && (
            <button className="secondary-button" onClick={handleDownload}>
              <Download size={17} />
              Download JSON
            </button>
          )}

          {/* Reset */}

          {file && (
            <button className="secondary-button" onClick={handleReset}>
              <RotateCcw size={17} />
              Reset
            </button>
          )}
        </div>
      </header>

      {/* ======================================================
          FILE UPLOAD
      ====================================================== */}

      <section className="upload-section">
        <FileUploader onFileSelected={handleFileUpload} />
      </section>

      {/* ======================================================
          FILE INFORMATION
      ====================================================== */}

      {file && (
        <section className="file-info-card">
          <div>
            <strong>File</strong>

            <span>{file.name}</span>
          </div>

          <div>
            <strong>Size</strong>

            <span>{(file.size / 1024).toFixed(2)} KB</span>
          </div>

          <div>
            <strong>Type</strong>

            <span>{file.type || "application/json"}</span>
          </div>
        </section>
      )}

      {/* ======================================================
          INVALID JSON SYNTAX
      ====================================================== */}

      {parseError && (
        <div className="status-card error">
          <XCircle size={22} />

          <div>
            <strong>Invalid JSON</strong>

            <p>{parseError}</p>
          </div>
        </div>
      )}

      {/* ======================================================
          VALIDATION LOADING
      ====================================================== */}

      {isValidating && (
        <div className="status-card">
          <AlertTriangle size={22} />

          <div>
            <strong>Validating...</strong>

            <p>
              Validating the uploaded PLM Work Package against the configured
              JSON schema.
            </p>
          </div>
        </div>
      )}

      {/* ======================================================
          VALIDATION STATUS
      ====================================================== */}

      {validationResult && (
        <div className={`status-card ${isValid ? "success" : "error"}`}>
          {isValid ? <CheckCircle size={24} /> : <XCircle size={24} />}

          <div>
            <strong>{isValid ? "VALID JSON" : "INVALID JSON"}</strong>

            <p>
              {isValid
                ? "The uploaded PLM WP JSON passed schema validation."
                : `${allErrors.length} validation error(s) found.`}
            </p>
          </div>
        </div>
      )}

      {/* ======================================================
          PHASE 3
          VALIDATION SUMMARY
      ====================================================== */}

      {validationResult && (
        <section className="phase3-section">
          <ValidationSummary result={validationResult} />
        </section>
      )}

      {/* ======================================================
          PHASE 3
          VALIDATION FILTERS
      ====================================================== */}

      {validationResult && allErrors.length > 0 && (
        <section className="phase3-section">
          <ValidationFilters
            errors={allErrors}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </section>
      )}

      {/* ======================================================
          PHASE 3
          VALIDATION ERRORS
      ====================================================== */}

      {validationResult && filteredErrors.length > 0 && (
        <section className="phase3-section">
          <ValidationErrors
            errors={filteredErrors}
            selectedError={selectedError}
            onErrorClick={handleErrorClick}
          />
        </section>
      )}

      {/* ======================================================
          PHASE 4
          INTERACTIVE JSON EXPLORER
      ====================================================== */}

      {parsedJson && (
        <section className="phase4-workspace">
          {/* ==================================================
              LEFT PANEL
              JSON TREE
          ================================================== */}

          <div className="json-explorer">
            <div className="workspace-header">
              <div>
                <h2>JSON Explorer</h2>

                <p>Interactive PLM WP JSON structure</p>
              </div>
            </div>

            {/* Search */}

            <JsonSearch
              value={searchQuery}
              onChange={setSearchQuery}
              resultCount={searchResultCount}
            />

            {/* JSON Tree */}

            <JsonTreeViewer
              data={parsedJson}
              selectedPath={selectedPath}
              expandedPaths={expandedPaths}
              onToggle={handleToggle}
              onSelect={handleNodeSelect}
              searchQuery={searchQuery}
            />
          </div>

          {/* ==================================================
              RIGHT PANEL
              ERROR / NODE INSPECTOR
          ================================================== */}

          <div className="inspector-panel">
            <ErrorInspector error={selectedError} selectedNode={selectedNode} />
          </div>
        </section>
      )}

      {/* ======================================================
          PHASE 3
          SOURCE LINE
      ====================================================== */}

      {selectedLine && (
        <div className="source-location-card">
          <strong>Selected Source Location</strong>

          <span>Line {selectedLine}</span>
        </div>
      )}

      {/* ======================================================
          EMPTY STATE
      ====================================================== */}

      {!file && (
        <div className="empty-state">
          <FileJson size={48} />

          <h2>Upload a PLM WP JSON file</h2>

          <p>
            Upload a local JSON file to start validation and interactive
            inspection.
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
