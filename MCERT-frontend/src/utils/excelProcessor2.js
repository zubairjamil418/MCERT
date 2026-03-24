import * as XLSX from "xlsx";

/**
 * Excel Data Processor for Flow Inspection Forms
 *
 * This utility extracts data from Excel files based on specific cell references
 * mentioned in the form documentation. It maps Excel cells to form fields.
 */

// Cell mapping configuration with sheet-specific mappings
const SHEET_CELL_MAPPINGS = {
  // Input Data sheet - primary source for main form fields
  inputData: {
    C4: "siteName", // Site Name from Input Data C4
    C5: "consentPermitNo", // Consent/Permit No from Input Data C5
    H10: "secondaryDeviceType_part1", // Type of flowmeter part 1 from H10
    H11: "secondaryDeviceType_part2", // Type of flowmeter part 2 from H11 - combine with H10
    H20: "flowmeterSensorSerial", // Sensor serial from H20
    H12: "flowmeterTransmitterSerial", // Transmitter serial from H12
    H5: "dryW", // Dry Weather Flow from H5
    C6: "dailyVolume", // Daily Max Volume from C6
    I5: "maxFFT", // Max FFT Flow from I5
    I4: "qmaxF_secondary", // Qmax of Flowmeter from I4
    H26: "verificationPlateMeasurement_part1", // Plate Measurement part 1 from H26
    H27: "verificationPlateMeasurement_part2", // Plate Measurement part 2 from H27 - combine with H26
  },

  // Main data sheet - "Data & Results" sheet (for additional fields if needed)
  main: {
    D19: "verificationInstrumentDisplay_part1", // Instrument Display part 1 from D19 (Data & Results)
    D20: "verificationInstrumentDisplay_part2", // Instrument Display part 2 from D20 (Data & Results) - combine with D19
    // Additional mappings for other fields (from Data & Results sheet if needed)
    E5: "dwfM3", // DWF (m3)
    E6: "fftM3", // FFT (m3)
    E7: "flowmeterMakeModel", // Flow meter make/model
    E8: "flowmeterSerial1", // Sensor serial number
    E9: "flowmeterSerial2", // Transmitter serial number
    E10: "boreSize", // Bore size (mm)
    E11: "calibrationFactors", // Calibration factors
    E12: "upstreamApproach", // Upstream approach (mm)
    E13: "downstreamApproach", // Downstream approach (mm)
    E14: "qmaxF", // Qmax
    E15: "earthBonding", // Earth bonding
    E16: "runningFull", // Running full
    E17: "stableReadings", // Stable readings
    E18: "entrainedAir", // Entrained air
    E21: "factoryCalibrationDate", // Factory calibration certificate date
    E22: "maintenanceMethod", // Method for maintenance
  },

  // Uncertainty sheet - get value directly from F104 and date from F2
  uncertainty: {
    F104: "uncertainty", // Get uncertainty value directly from F104 cell (raw value: "5.29" or "3.03")
    F2: "conclusionUncertaintySheetF2", // Get date from F2 cell for conclusion section 6.0
    F104_2: "conclusionUncertaintySheetF104", // Get uncertainty from F104 for conclusion section 6.0
  },

  // Curves sheet (if it contains relevant data)
  curves: {
    // Add mappings for curves sheet if needed
  },

  // Additional data sheet (if exists)
  additional: {
    A1: "consentPermitNo", // Consent/Permit No
    B1: "siteContact", // Site Contact
    C1: "siteAddress", // Site Address
    D1: "siteRefPostcode", // Site Ref or Postcode
    F1: "irishGridRef", // Irish Grid ref
    G1: "niwAssetId", // NIW Asset ID
    H1: "inspectionReportNo", // Inspection report No
    I1: "dateOfInspection", // Date of Inspection
  },
};

// Legacy single mapping for backward compatibility
const CELL_MAPPINGS = {
  E4: "siteName",
  E7: "flowmeterMakeModel",
  E8: "flowmeterSerial1",
  E9: "flowmeterSerial2",
  E14: "qmaxF",
  E5: "dwfM3",
  E6: "fftM3",
  F104: "uncertainty",
  f104: "uncertainty",
};

// Sheet names to look for in the Excel file
const SHEET_NAMES = [
  "Emag data",
  "FFT Uncertainty", // Updated based on actual sheet name
  "Uncertainty",
  "Sheet1",
  "Data",
  "Main",
  "Flow Data",
];

/**
 * Maps actual sheet names to our logical categories
 * @param {string} sheetName - Actual sheet name from Excel
 * @returns {string} - Logical category (main, uncertainty, additional)
 */
function getSheetCategory(sheetName) {
  const name = sheetName.toLowerCase().trim();

  // Check for uncertainty sheet - match "uncertainty" or "uncertainty sheet"
  if (name.includes("uncertainty")) {
    return "uncertainty";
  }

  if (name === "curves") {
    return "curves";
  }

  // Prioritize "Data & Results" sheet for main data extraction
  // Match variations: "Data & Results", "Data and Results", "Data & Results Sheet", etc.
  if (
    name.includes("data & results") ||
    name.includes("data and results") ||
    (name.includes("data") && name.includes("results"))
  ) {
    return "main";
  }

  // "Input Data" sheet - match "Input Data" or "Input Data Sheet"
  if (name.includes("input data")) {
    return "inputData"; // Return "inputData" category for Input Data sheet
  }

  if (
    name.includes("emag") ||
    (name.includes("data") &&
      !name.includes("results") &&
      !name.includes("input")) ||
    name.includes("main") ||
    name === "sheet1" ||
    name.includes("flow")
  ) {
    return "main";
  }

  return "additional";
}

function columnNumberToLetters(columnNumber) {
  let letters = "";
  let num = columnNumber;

  while (num > 0) {
    const remainder = (num - 1) % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    num = Math.floor((num - 1) / 26);
  }

  return letters;
}

function encodeCell({ row, col }) {
  return `${columnNumberToLetters(col + 1)}${row + 1}`;
}

function decodeRange(rangeRef) {
  const [startRef, endRef] = rangeRef.split(":");
  const start = parseCellReference(startRef);
  const end = parseCellReference(endRef);
  return {
    s: { r: start.row, c: start.col },
    e: { r: end.row, c: end.col },
  };
}

function createCellObject(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  let type = "s";
  let formatted = value;

  if (typeof value === "number") {
    type = "n";
    formatted = value;
  } else if (value instanceof Date) {
    type = "d";
    formatted = value.toISOString();
  } else {
    formatted = String(value);
  }

  return {
    v: value,
    w: formatted,
    t: type,
    f: null,
  };
}

function uint8ArrayToBinaryString(uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(
      i,
      Math.min(i + chunkSize, uint8Array.length)
    );
    binary += String.fromCharCode.apply(null, chunk);
  }
  return binary;
}

function readWorkbook(data, options = {}) {
  const { fileName, ...readOptions } = options;
  const baseOptions = { type: "array", ...readOptions };
  const dataArray = data instanceof Uint8Array ? data : new Uint8Array(data);
  const maybeBinaryString =
    fileName && fileName.toLowerCase().endsWith(".xls")
      ? uint8ArrayToBinaryString(dataArray)
      : null;

  try {
    return XLSX.read(dataArray, baseOptions);
  } catch (error) {
    const message = error && error.message ? error.message : "";
    if (typeof message === "string" && message.includes("password-protected")) {
      const fallbackPasswords = ["", "VelvetSweatshop"];
      console.warn("Workbook reported as password-protected.");

      for (const fallback of fallbackPasswords) {
        try {
          console.warn(
            `Retrying workbook read with fallback password "${
              fallback ? fallback : "<empty>"
            }".`
          );
          return XLSX.read(dataArray, { ...baseOptions, password: fallback });
        } catch (retryError) {
          console.warn(
            `Workbook read failed with fallback password "${
              fallback ? fallback : "<empty>"
            }".`
          );
          if (maybeBinaryString) {
            try {
              console.warn(
                `Retrying workbook read as binary string with fallback password "${
                  fallback ? fallback : "<empty>"
                }".`
              );
              return XLSX.read(maybeBinaryString, {
                type: "binary",
                ...readOptions,
                password: fallback,
              });
            } catch (binaryRetryError) {
              console.warn(
                `Binary string workbook read failed with fallback password "${
                  fallback ? fallback : "<empty>"
                }".`
              );
            }
          }
        }
      }

      console.error(
        "All password fallbacks failed. Re-throwing original error.",
        error
      );
      const guidance =
        "Workbook appears to be password-protected. Please remove workbook protection in Excel (File ➜ Info ➜ Protect Workbook) or re-export a copy without passwords, then upload again.";
      const enriched = new Error(guidance);
      enriched.originalError = error;
      throw enriched;
    }
    throw error;
  }
}

function getCellObject(worksheet, row, col) {
  const address = encodeCell({ row, col });
  let cell = worksheet[address];

  if (!cell) {
    const rows = worksheet.__rows || [];
    const rowData = rows[row];
    if (rowData && col < rowData.length) {
      cell = createCellObject(rowData[col]);
      if (cell) {
        worksheet[address] = cell;
      }
    }
  }

  return cell || null;
}

async function loadWorkbookFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = readWorkbook(data, { fileName: file.name });

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            raw: true,
            blankrows: false,
          });
          worksheet.__rows = rows;
        });

        resolve(workbook);
      } catch (error) {
        reject(new Error(`Failed to read workbook: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read Excel file"));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Converts Excel cell reference (like 'E4') to row and column indices
 * @param {string} cellRef - Excel cell reference (e.g., 'E4', 'f104')
 * @returns {Object} - Object with row and column indices
 */
function parseCellReference(cellRef) {
  // Convert to uppercase for consistency
  cellRef = cellRef.toUpperCase();

  // Extract column letters and row number
  const match = cellRef.match(/^([A-Z]+)(\d+)$/);
  if (!match) {
    throw new Error(`Invalid cell reference: ${cellRef}`);
  }

  const [, columnLetters, rowNumber] = match;

  // Convert column letters to number (A=1, B=2, ..., Z=26, AA=27, etc.)
  let columnNumber = 0;
  for (let i = 0; i < columnLetters.length; i++) {
    columnNumber = columnNumber * 26 + (columnLetters.charCodeAt(i) - 64);
  }

  return {
    row: parseInt(rowNumber) - 1, // Convert to 0-based index
    col: columnNumber - 1, // Convert to 0-based index
  };
}

function calculateRangeSum(worksheet, range) {
  try {
    const [startCell, endCell] = range.split(":");
    const startPos = parseCellReference(startCell);
    const endPos = parseCellReference(endCell);

    let sum = 0;
    let validCells = 0;

    for (let r = startPos.row; r <= endPos.row; r++) {
      for (let c = startPos.col; c <= endPos.col; c++) {
        let cell = getCellObject(worksheet, r, c);

        if (cell && cell.v !== null && cell.v !== undefined) {
          const value = cell.v;
          const numericValue = parseFloat(value);

          if (!isNaN(numericValue) && isFinite(numericValue)) {
            sum += numericValue;
            validCells++;
          }
        }
      }
    }

    // Round to reasonable precision for uncertainty values
    const roundedSum = Math.round(sum * 100) / 100; // Round to 2 decimal places

    return validCells > 0 ? roundedSum : null;
  } catch (error) {
    return null;
  }
}

/**
 * Gets the value from a specific cell in a worksheet
 * @param {Object} worksheet - Worksheet object
 * @param {string} cellRef - Excel cell reference (e.g., 'E4') or range (e.g., 'F7:F102')
 * @returns {string|number|null} - Cell value, range sum, or null if not found
 */
function getCellValue(worksheet, cellRef) {
  try {
    // Check if this is a range (contains ':')
    if (cellRef.includes(":")) {
      return calculateRangeSum(worksheet, cellRef);
    }

    const { row, col } = parseCellReference(cellRef);
    const cell = getCellObject(worksheet, row, col);
    let value = null;

    if (cell) {
      // For text fields, prioritize formatted value (cell.w) which preserves text and formatting
      // For numeric fields, use raw value (cell.v)
      if (cell.w !== undefined && cell.w !== null && cell.w !== "") {
        // Use formatted value if available (preserves text, units, formatting)
        value = cell.w;
      } else if (cell.v !== undefined && cell.v !== null) {
        // Fallback to raw value if formatted value not available
        value = cell.v;
      }
    }

    // Special handling for F104 to ensure we get the numeric value for uncertainty
    if (cellRef === "F104" && cell) {
      // For uncertainty, prefer raw numeric value, but use formatted if raw is not numeric
      if (typeof cell.v === "number" && !isNaN(cell.v)) {
        value = cell.v;
      } else if (cell.w !== undefined && cell.w !== null && cell.w !== "") {
        value = cell.w;
      } else if (cell.v !== undefined && cell.v !== null) {
        value = cell.v;
      }
    }

    // Special handling for F2 to ensure we get the date value
    if (cellRef === "F2" && cell) {
      // Handle Excel date serial numbers
      if (typeof cell.v === "number" && cell.t === "n") {
        // Convert Excel date serial number to JavaScript Date
        const excelDate = new Date((cell.v - 25569) * 86400 * 1000);
        value = excelDate.toISOString().split("T")[0]; // YYYY-MM-DD format
      } else if (cell.v !== null && cell.v !== undefined) {
        value = cell.v;
      }
    }

    // If we got 0 but expected text, try alternative approaches
    if (value === 0 && cellRef === "E4" && cell) {
      // Try reading as text
      if (cell.w) {
        value = cell.w;
      } else if (cell.t === "s" || cell.t === "str") {
        value = cell.v;
      } else {
        // Try direct cell address lookup
        const directCell = worksheet["E4"];
        if (directCell && directCell.v !== 0) {
          value = directCell.v;
        }
      }
    }

    return value;
  } catch (error) {
    return null;
  }
}

/**
 * Searches for a value in a worksheet by looking through all cells
 * @param {Object} worksheet - Worksheet object
 * @param {string} searchValue - Value to search for
 * @returns {string|null} - Found value or null
 */
function searchValueInWorksheet(worksheet, searchValue) {
  const range = decodeRange(worksheet["!ref"] || "A1:A1");

  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cell = getCellObject(worksheet, row, col);
      if (
        cell &&
        cell.v &&
        cell.v.toString().toLowerCase().includes(searchValue.toLowerCase())
      ) {
        return cell.v;
      }
    }
  }
  return null;
}

/**
 * Processes an Excel file and extracts data based on cell mappings
 * @param {File} file - Excel file to process
 * @returns {Promise<Object>} - Extracted data object
 */
export async function processExcelFile(file) {
  try {
    const workbook = await loadWorkbookFromFile(file);

    const extractedData = {};
    const processedSheets = [];

    // Log sheet names with their categories
    console.log("=== EXCEL FILE SHEETS ===");
    console.log("Total sheets found:", workbook.SheetNames.length);
    workbook.SheetNames.forEach((sheetName, index) => {
      const category = getSheetCategory(sheetName);
      console.log(
        `Sheet ${index + 1}: "${sheetName}" -> Category: ${category}`
      );
    });
    console.log("=== END SHEET LIST ===\n");

    // Categorize sheets first
    const sheetCategories = {};
    workbook.SheetNames.forEach((sheetName) => {
      const category = getSheetCategory(sheetName);
      sheetCategories[category] = sheetName;
    });

    // Process each sheet with appropriate mappings
    const sheetExtractedData = {}; // Track data per sheet

    // Sort sheets to process "Data & Results" first for main data
    const sortedSheetNames = [...workbook.SheetNames].sort((a, b) => {
      const aLower = a.toLowerCase().trim();
      const bLower = b.toLowerCase().trim();
      if (
        aLower.includes("data & results") ||
        aLower.includes("data and results") ||
        (aLower.includes("data") && aLower.includes("results"))
      )
        return -1;
      if (
        bLower.includes("data & results") ||
        bLower.includes("data and results") ||
        (bLower.includes("data") && bLower.includes("results"))
      )
        return 1;
      return 0;
    });

    sortedSheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      processedSheets.push(sheetName);

      const sheetCategory = getSheetCategory(sheetName);
      console.log(
        `Processing sheet "${sheetName}" -> Category: ${sheetCategory}`
      );

      // Log full "Input Data" sheet
      if (
        sheetName.toLowerCase().includes("input data") ||
        sheetName.toLowerCase() === "input data"
      ) {
        console.log("\n=== FULL INPUT DATA SHEET ===");
        console.log("Sheet Name:", sheetName);
        console.log("Full Worksheet Object:", worksheet);

        // Convert worksheet to a more readable format
        const sheetData = {};
        const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:Z100");
        for (let R = range.s.r; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ c: C, r: R });
            const cell = worksheet[cellAddress];
            if (cell) {
              sheetData[cellAddress] = {
                raw: cell.v,
                formatted: cell.w,
                type: cell.t,
              };
            }
          }
        }
        console.log("Sheet Data (Cell by Cell):", sheetData);
        console.log("=== END FULL INPUT DATA SHEET ===\n");
      }

      // Get the appropriate mappings for this sheet category
      const mappingsForSheet = SHEET_CELL_MAPPINGS[sheetCategory] || {};
      const sheetData = {}; // Data extracted from this specific sheet

      // Extract from "Input Data" sheet (inputData category) and "Data & Results" sheet (main category)
      // Skip other main category sheets that are not "Data & Results"
      const sheetNameLower = sheetName.toLowerCase().trim();
      if (
        sheetCategory === "main" &&
        !sheetNameLower.includes("data & results") &&
        !sheetNameLower.includes("data and results") &&
        !(sheetNameLower.includes("data") && sheetNameLower.includes("results"))
      ) {
        console.log(
          `  Skipping main data extraction from "${sheetName}" - only extracting from "Data & Results" sheet`
        );
        return;
      }
      // Allow extraction from "Input Data" sheet (inputData category) - no skipping

      // Process each cell mapping for this sheet category
      Object.entries(mappingsForSheet).forEach(([cellRef, fieldName]) => {
        // Skip special handling cells that are processed separately
        if (cellRef.includes("_") && !cellRef.includes("part")) {
          return;
        }

        let value = getCellValue(worksheet, cellRef);

        if (fieldName === "uncertainty") {
          if (cellRef.includes(":")) {
            // Range calculation
          } else {
            const valueStr = String(value);
            const isHeader =
              valueStr.includes("UQ") ||
              valueStr.includes("±%") ||
              valueStr.includes("(±%)");

            if (isHeader) {
              value = null;
            }
          }
        }

        if (
          value !== null &&
          value !== undefined &&
          (value !== "" || value === 0)
        ) {
          if (
            fieldName === "flowmeterSerial1" ||
            fieldName === "flowmeterSerial2"
          ) {
            if (!extractedData.flowmeterSerial) {
              extractedData.flowmeterSerial = value;
            } else {
              extractedData.flowmeterSerial += `, ${value}`;
            }
            // Track for this sheet
            if (!sheetData.flowmeterSerial) {
              sheetData.flowmeterSerial = value;
            } else {
              sheetData.flowmeterSerial += `, ${value}`;
            }
          } else {
            extractedData[fieldName] = value;
            sheetData[fieldName] = value;
          }
        }
      });

      // Log extracted data from this sheet
      sheetExtractedData[sheetName] = sheetData;
      console.log(
        `\n=== Data extracted from "${sheetName}" (${sheetCategory}) ===`
      );
      const sheetDataKeys = Object.keys(sheetData).filter(
        (k) => !k.startsWith("_")
      );
      if (sheetDataKeys.length > 0) {
        sheetDataKeys.forEach((key) => {
          console.log(`  ${key}: "${sheetData[key]}"`);
        });
      } else {
        console.log(`  (No data extracted from this sheet)`);
      }
      console.log(`=== End data from "${sheetName}" ===\n`);
    });

    // Post-processing: Combine secondaryDeviceType parts (I10 + I11)
    if (
      extractedData.secondaryDeviceType_part1 !== undefined ||
      extractedData.secondaryDeviceType_part2 !== undefined
    ) {
      const part1 =
        extractedData.secondaryDeviceType_part1 != null
          ? String(extractedData.secondaryDeviceType_part1).trim()
          : "";
      const part2 =
        extractedData.secondaryDeviceType_part2 != null
          ? String(extractedData.secondaryDeviceType_part2).trim()
          : "";

      let combined = "";
      if (part1 && part2) {
        combined = `${part1} ${part2}`.trim();
      } else {
        combined = part1 || part2;
      }

      if (combined) {
        extractedData.secondaryDeviceType = combined;
      }
      delete extractedData.secondaryDeviceType_part1;
      delete extractedData.secondaryDeviceType_part2;
    }

    // Post-processing: Combine verificationPlateMeasurement parts (I26 + I27)
    if (
      extractedData.verificationPlateMeasurement_part1 !== undefined ||
      extractedData.verificationPlateMeasurement_part2 !== undefined
    ) {
      const part1 =
        extractedData.verificationPlateMeasurement_part1 != null
          ? String(extractedData.verificationPlateMeasurement_part1).trim()
          : "";
      const part2 =
        extractedData.verificationPlateMeasurement_part2 != null
          ? String(extractedData.verificationPlateMeasurement_part2).trim()
          : "";

      let combined = "";
      if (part1 && part2) {
        combined = `${part1} ${part2}`.trim();
      } else {
        combined = part1 || part2;
      }

      if (combined) {
        extractedData.verificationPlateMeasurement = combined;
      }
      delete extractedData.verificationPlateMeasurement_part1;
      delete extractedData.verificationPlateMeasurement_part2;
    }

    // Post-processing: Combine verificationInstrumentDisplay parts (E19 + E20)
    if (
      extractedData.verificationInstrumentDisplay_part1 !== undefined ||
      extractedData.verificationInstrumentDisplay_part2 !== undefined
    ) {
      const part1 =
        extractedData.verificationInstrumentDisplay_part1 != null
          ? String(extractedData.verificationInstrumentDisplay_part1).trim()
          : "";
      const part2 =
        extractedData.verificationInstrumentDisplay_part2 != null
          ? String(extractedData.verificationInstrumentDisplay_part2).trim()
          : "";

      let combined = "";
      if (part1 && part2) {
        combined = `${part1} ${part2}`.trim();
      } else {
        combined = part1 || part2;
      }

      if (combined) {
        extractedData.verificationInstrumentDisplay = combined;
      }
      delete extractedData.verificationInstrumentDisplay_part1;
      delete extractedData.verificationInstrumentDisplay_part2;
    }

    // Fallback search for siteName if not found
    if (!extractedData.siteName || extractedData.siteName === 0) {
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        const rows = worksheet.__rows || [];

        rows.forEach((rowArr, rowIdx) => {
          rowArr.forEach((value, colIdx) => {
            if (value) {
              const cellValue = String(value);

              if (
                cellValue.includes("Tallygawley") ||
                cellValue.includes("Ballygawley") ||
                cellValue.includes("Monea")
              ) {
                extractedData.siteName = cellValue;
                return;
              }

              if (cellValue.includes("WwTW") || cellValue.includes("WWTW")) {
                if (!extractedData.siteName || extractedData.siteName === 0) {
                  extractedData.siteName = cellValue;
                }
              }
            }
          });
        });
      });
    }

    if (Object.keys(extractedData).length === 0) {
      workbook.SheetNames.forEach((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];

        const patterns = {
          consent: ["consent", "permit", "license"],
          flowmeter: ["flowmeter", "flow meter", "meter"],
          site: ["site", "location", "address"],
          uncertainty: ["uncertainty", "error", "tolerance"],
        };

        Object.entries(patterns).forEach(([key, searchTerms]) => {
          searchTerms.forEach((term) => {
            const found = searchValueInWorksheet(worksheet, term);
            if (found && !extractedData[key]) {
              extractedData[key] = found;
            }
          });
        });
      });
    }

    extractedData._metadata = {
      fileName: file.name,
      processedSheets,
      processedAt: new Date().toISOString(),
      totalSheets: workbook.SheetNames.length,
    };

    // Log summary of all extracted data
    console.log("\n=== SUMMARY: All Extracted Data ===");
    const allDataKeys = Object.keys(extractedData).filter(
      (k) => !k.startsWith("_")
    );
    if (allDataKeys.length > 0) {
      allDataKeys.forEach((key) => {
        console.log(`  ${key}: "${extractedData[key]}"`);
      });
    } else {
      console.log(`  (No data extracted)`);
    }
    console.log("=== End Summary ===\n");

    return extractedData;
  } catch (error) {
    if (error && error.originalError) {
      throw new Error(error.message);
    }
    throw new Error(`Failed to process Excel file: ${error.message}`);
  }
}

/**
 * Validates if the uploaded file is a valid Excel file
 * @param {File} file - File to validate
 * @returns {boolean} - True if valid Excel file
 */
export function validateExcelFile(file) {
  const validTypes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // .xls
    "text/csv", // .csv
  ];

  const validExtensions = [".xlsx", ".xls", ".csv"];
  const fileExtension = file.name
    .toLowerCase()
    .substring(file.name.lastIndexOf("."));

  return (
    validTypes.includes(file.type) || validExtensions.includes(fileExtension)
  );
}

/**
 * Gets a preview of the Excel file structure
 * @param {File} file - Excel file to preview
 * @returns {Promise<Object>} - Preview data
 */
export async function getExcelPreview(file) {
  try {
    const workbook = await loadWorkbookFromFile(file);

    const preview = {
      fileName: file.name,
      sheetNames: workbook.SheetNames,
      sheets: {},
    };

    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const rows = worksheet.__rows || [];
      const maxRows = Math.min(10, rows.length);
      const maxCols = rows.reduce(
        (max, rowArr) =>
          Math.max(max, Array.isArray(rowArr) ? rowArr.length : 0),
        0
      );

      preview.sheets[sheetName] = {
        range: worksheet["!ref"],
        maxRows,
        data: [],
      };

      for (let row = 0; row < maxRows; row++) {
        const rowArr = rows[row] || [];
        const rowData = [];
        for (let col = 0; col < maxCols; col++) {
          rowData.push(col < rowArr.length ? rowArr[col] ?? "" : "");
        }
        preview.sheets[sheetName].data.push(rowData);
      }
    });

    return preview;
  } catch (error) {
    throw new Error(`Failed to preview Excel file: ${error.message}`);
  }
}

/**
 * Extracts all data from the uncertainty sheet and logs it to console
 * @param {File} file - Excel file to process
 * @returns {Promise<Object>} - Full uncertainty sheet data
 */
export async function extractUncertaintySheetData(file) {
  try {
    const workbook = await loadWorkbookFromFile(file);

    const uncertaintySheetName = workbook.SheetNames.find((sheetName) => {
      const name = sheetName.toLowerCase().trim();
      return name.includes("uncertainty") || name.includes("fft");
    });

    console.log("=== UNCERTAINTY SHEET DETECTION ===");
    console.log("All sheet names:", workbook.SheetNames);
    console.log("Found uncertainty sheet:", uncertaintySheetName);
    console.log("=== END UNCERTAINTY SHEET DETECTION ===");

    if (!uncertaintySheetName) {
      return { error: "No uncertainty sheet found" };
    }

    const worksheet = workbook.Sheets[uncertaintySheetName];
    const range = decodeRange(worksheet["!ref"] || "A1:A1");

    const uncertaintyData = {
      sheetName: uncertaintySheetName,
      range: worksheet["!ref"],
      allCells: {},
      nonEmptyCells: {},
      numericCells: {},
      formulaCells: {},
      rowData: {},
      columnData: {},
    };

    for (let row = range.s.r; row <= range.e.r; row++) {
      const rowKey = row + 1;
      uncertaintyData.rowData[rowKey] = {};

      for (let col = range.s.c; col <= range.e.c; col++) {
        const colLetter = columnNumberToLetters(col + 1);
        if (!uncertaintyData.columnData[colLetter]) {
          uncertaintyData.columnData[colLetter] = {};
        }

        const cellAddress = encodeCell({ row, col });
        const cell = getCellObject(worksheet, row, col);

        if (cell) {
          const cellInfo = {
            address: cellAddress,
            value: cell.v,
            type: cell.t,
            formula: cell.f,
            rawValue: cell.w ?? cell.v,
          };

          uncertaintyData.allCells[cellAddress] = cellInfo;
          uncertaintyData.rowData[rowKey][colLetter] = cellInfo;
          uncertaintyData.columnData[colLetter][rowKey] = cellInfo;

          if (cell.v !== null && cell.v !== undefined && cell.v !== "") {
            uncertaintyData.nonEmptyCells[cellAddress] = cellInfo;
          }

          if (typeof cell.v === "number" && !isNaN(cell.v)) {
            uncertaintyData.numericCells[cellAddress] = cellInfo;
          }

          if (cell.f) {
            uncertaintyData.formulaCells[cellAddress] = cellInfo;
          }
        }
      }
    }

    const f104RawValue =
      uncertaintyData.columnData["F"] && uncertaintyData.columnData["F"][104]
        ? uncertaintyData.columnData["F"][104].rawValue
        : null;

    uncertaintyData.f104RawValue = f104RawValue;

    return uncertaintyData;
  } catch (error) {
    if (error && error.originalError) {
      throw new Error(error.message);
    }
    throw new Error(
      `Failed to extract uncertainty sheet data: ${error.message}`
    );
  }
}

/**
 * Maps extracted Excel data to form data structure
 * @param {Object} excelData - Data extracted from Excel
 * @returns {Object} - Mapped form data
 */
export function mapExcelDataToForm(excelData) {
  const formData = {};

  // Helper function to safely convert values to strings and handle falsy values
  const safeValue = (value) => {
    if (value === null || value === undefined) return null;
    return String(value).trim();
  };

  // Debug: Log all incoming Excel data
  console.log("=== MAP EXCEL DATA TO FORM DEBUG ===");
  console.log("Incoming excelData keys:", Object.keys(excelData));
  console.log("Incoming excelData:", excelData);

  // Map Excel data to form fields - check for existence, not truthiness
  if (
    excelData.hasOwnProperty("consentPermitNo") &&
    excelData.consentPermitNo !== null &&
    excelData.consentPermitNo !== undefined
  ) {
    formData.consentPermitNo = safeValue(excelData.consentPermitNo);
  }

  if (
    excelData.hasOwnProperty("flowmeterMakeModel") &&
    excelData.flowmeterMakeModel !== null &&
    excelData.flowmeterMakeModel !== undefined
  ) {
    formData.flowmeterMakeModel = safeValue(excelData.flowmeterMakeModel);
  }

  if (
    excelData.hasOwnProperty("flowmeterSerial") &&
    excelData.flowmeterSerial !== null &&
    excelData.flowmeterSerial !== undefined
  ) {
    formData.flowmeterSerial = safeValue(excelData.flowmeterSerial);
  }

  // Handle separate transmitter and sensor serial numbers
  if (
    excelData.hasOwnProperty("flowmeterTransmitterSerial") &&
    excelData.flowmeterTransmitterSerial !== null &&
    excelData.flowmeterTransmitterSerial !== undefined
  ) {
    formData.flowmeterTransmitterSerial = safeValue(
      excelData.flowmeterTransmitterSerial
    );
  }

  if (
    excelData.hasOwnProperty("flowmeterSensorSerial") &&
    excelData.flowmeterSensorSerial !== null &&
    excelData.flowmeterSensorSerial !== undefined
  ) {
    formData.flowmeterSensorSerial = safeValue(excelData.flowmeterSensorSerial);
  }

  // Handle secondary device type (combined from I10+I11)
  if (
    excelData.hasOwnProperty("secondaryDeviceType") &&
    excelData.secondaryDeviceType !== null &&
    excelData.secondaryDeviceType !== undefined
  ) {
    formData.secondaryDeviceType = safeValue(excelData.secondaryDeviceType);
  }

  // Also try to combine parts if they exist separately
  if (!formData.secondaryDeviceType) {
    const part1 = excelData.secondaryDeviceType_part1 || "";
    const part2 = excelData.secondaryDeviceType_part2 || "";
    if (part1 || part2) {
      const combined =
        part1 && part2 ? `${part1} ${part2}`.trim() : part1 || part2;
      formData.secondaryDeviceType = safeValue(combined);
    }
  }

  // Handle verification data - check for combined version first, then try to combine parts
  if (
    excelData.hasOwnProperty("verificationPlateMeasurement") &&
    excelData.verificationPlateMeasurement !== null &&
    excelData.verificationPlateMeasurement !== undefined
  ) {
    formData.verificationPlateMeasurement = safeValue(
      excelData.verificationPlateMeasurement
    );
  } else {
    // Try to combine parts if they exist separately
    const part1 = excelData.verificationPlateMeasurement_part1 || "";
    const part2 = excelData.verificationPlateMeasurement_part2 || "";
    if (part1 || part2) {
      const combined =
        part1 && part2 ? `${part1} ${part2}`.trim() : part1 || part2;
      formData.verificationPlateMeasurement = safeValue(combined);
    }
  }

  if (
    excelData.hasOwnProperty("verificationInstrumentDisplay") &&
    excelData.verificationInstrumentDisplay !== null &&
    excelData.verificationInstrumentDisplay !== undefined
  ) {
    formData.verificationInstrumentDisplay = safeValue(
      excelData.verificationInstrumentDisplay
    );
  } else {
    // Try to combine parts if they exist separately
    const part1 = excelData.verificationInstrumentDisplay_part1 || "";
    const part2 = excelData.verificationInstrumentDisplay_part2 || "";
    if (part1 || part2) {
      const combined =
        part1 && part2 ? `${part1} ${part2}`.trim() : part1 || part2;
      formData.verificationInstrumentDisplay = safeValue(combined);
    }
  }

  // Handle conclusion flow data date
  if (
    excelData.hasOwnProperty("conclusionFlowDataDate") &&
    excelData.conclusionFlowDataDate !== null &&
    excelData.conclusionFlowDataDate !== undefined
  ) {
    formData.conclusionFlowDataDate = safeValue(
      excelData.conclusionFlowDataDate
    );
  }

  if (
    excelData.hasOwnProperty("qmaxF") &&
    excelData.qmaxF !== null &&
    excelData.qmaxF !== undefined
  ) {
    formData.qmaxF = safeValue(excelData.qmaxF);
  }

  // Handle qmaxF_secondary from I4 (for secondary device)
  if (
    excelData.hasOwnProperty("qmaxF_secondary") &&
    excelData.qmaxF_secondary !== null &&
    excelData.qmaxF_secondary !== undefined
  ) {
    // If qmaxF is not set, use qmaxF_secondary
    if (!formData.qmaxF) {
      formData.qmaxF = safeValue(excelData.qmaxF_secondary);
    }
  }

  // Handle uncertainty value - ensure both fields get the same value
  if (
    excelData.hasOwnProperty("uncertainty") &&
    excelData.uncertainty !== null &&
    excelData.uncertainty !== undefined
  ) {
    let uncertaintyValue = safeValue(excelData.uncertainty);

    // Format uncertainty value: if it's a number, add ± and % if not already present
    if (uncertaintyValue && !isNaN(parseFloat(uncertaintyValue))) {
      const numValue = parseFloat(uncertaintyValue);
      if (!uncertaintyValue.includes("±") && !uncertaintyValue.includes("%")) {
        uncertaintyValue = `± ${numValue.toFixed(2)} %`;
      } else if (!uncertaintyValue.includes("±")) {
        uncertaintyValue = `± ${uncertaintyValue}`;
      } else if (!uncertaintyValue.includes("%")) {
        uncertaintyValue = `${uncertaintyValue} %`;
      }
    }

    formData.uncertainty = uncertaintyValue;
    // Map uncertainty from F104 to conclusion section 6.0
    if (!formData.conclusionUncertaintySheetF104) {
      formData.conclusionUncertaintySheetF104 = uncertaintyValue;
    }
  }

  // Handle conclusionWeightedUncertainty separately if it exists
  if (
    excelData.hasOwnProperty("conclusionWeightedUncertainty") &&
    excelData.conclusionWeightedUncertainty !== null &&
    excelData.conclusionWeightedUncertainty !== undefined
  ) {
    formData.conclusionWeightedUncertainty = safeValue(
      excelData.conclusionWeightedUncertainty
    );
  }

  if (
    excelData.hasOwnProperty("siteName") &&
    excelData.siteName !== null &&
    excelData.siteName !== undefined
  ) {
    formData.siteName = safeValue(excelData.siteName);
  }

  // Handle additional fields from spreadsheet
  // Priority: Use direct mappings (dryW, maxFFT) over alternative mappings (dwfM3, fftM3)
  // dryW from H5 takes priority over dwfM3
  if (
    excelData.hasOwnProperty("dryW") &&
    excelData.dryW !== null &&
    excelData.dryW !== undefined
  ) {
    formData.dryW = safeValue(excelData.dryW);
  } else if (
    excelData.hasOwnProperty("dwfM3") &&
    excelData.dwfM3 !== null &&
    excelData.dwfM3 !== undefined
  ) {
    formData.dryW = safeValue(excelData.dwfM3); // Map DWF to dryW field as fallback
  }

  // maxFFT from I5 takes priority over fftM3
  if (
    excelData.hasOwnProperty("maxFFT") &&
    excelData.maxFFT !== null &&
    excelData.maxFFT !== undefined
  ) {
    formData.maxFFT = safeValue(excelData.maxFFT);
  } else if (
    excelData.hasOwnProperty("fftM3") &&
    excelData.fftM3 !== null &&
    excelData.fftM3 !== undefined
  ) {
    formData.maxFFT = safeValue(excelData.fftM3); // Map FFT to maxFFT field as fallback
  }

  if (excelData.siteContact) {
    formData.siteContact = safeValue(excelData.siteContact);
  }

  if (excelData.siteAddress) {
    formData.siteAddress = excelData.siteAddress;
  }

  if (excelData.siteRefPostcode) {
    formData.siteRefPostcode = excelData.siteRefPostcode;
  }

  if (excelData.irishGridRef) {
    formData.irishGridRef = excelData.irishGridRef;
  }

  if (excelData.niwAssetId) {
    formData.niwAssetId = excelData.niwAssetId;
  }

  if (excelData.inspectionReportNo) {
    formData.inspectionReportNo = excelData.inspectionReportNo;
  }

  if (excelData.dateOfInspection) {
    formData.dateOfInspection = excelData.dateOfInspection;
  }

  // Map F2 date to conclusion section 6.0
  if (excelData.conclusionUncertaintySheetF2) {
    formData.conclusionUncertaintySheetF2 = safeValue(
      excelData.conclusionUncertaintySheetF2
    );
  }
  // Map F104 uncertainty to conclusion section 6.0
  if (excelData.conclusionUncertaintySheetF104) {
    formData.conclusionUncertaintySheetF104 = safeValue(
      excelData.conclusionUncertaintySheetF104
    );
  }

  // Map C5 to both consentPermitNo (already mapped) and wocNumber
  // If consentPermitNo exists from C5, also use it for wocNumber
  if (
    excelData.hasOwnProperty("consentPermitNo") &&
    excelData.consentPermitNo !== null &&
    excelData.consentPermitNo !== undefined &&
    !formData.wocNumber
  ) {
    formData.wocNumber = safeValue(excelData.consentPermitNo);
  }

  // Map dailyVolume from C6 to maxD field
  if (
    excelData.hasOwnProperty("dailyVolume") &&
    excelData.dailyVolume !== null &&
    excelData.dailyVolume !== undefined
  ) {
    formData.maxD = safeValue(excelData.dailyVolume); // Map dailyVolume to maxD field
  } else if (
    excelData.hasOwnProperty("maxD") &&
    excelData.maxD !== null &&
    excelData.maxD !== undefined
  ) {
    formData.maxD = safeValue(excelData.maxD);
  }

  // IMPORTANT: Permanent fields (field1, field2, field3) should NEVER be overwritten by Excel
  // These fields have fixed default values and should only come from form defaults or API data
  // Do NOT map these fields from Excel - they are marked as "Permanent" in the form

  // Add metadata for debugging
  formData._excelMetadata = excelData._metadata;

  // Final check: ensure conclusion uncertainty (F104) gets value if uncertainty exists
  if (formData.uncertainty && !formData.conclusionUncertaintySheetF104) {
    formData.conclusionUncertaintySheetF104 = formData.uncertainty;
  }

  // Debug: Log final mapped form data
  console.log("Mapped formData keys:", Object.keys(formData));
  console.log("Mapped formData:", formData);
  console.log("=== END MAP EXCEL DATA TO FORM DEBUG ===");

  return formData;
}

const excelProcessor = {
  processExcelFile,
  validateExcelFile,
  getExcelPreview,
  mapExcelDataToForm,
  extractUncertaintySheetData,
  CELL_MAPPINGS,
  SHEET_NAMES,
};

export default excelProcessor;
