import * as XLSX from "xlsx";

/**
 * Excel Data Processor for Flow Inspection Forms
 *
 * This utility extracts data from Excel files based on specific cell references
 * mentioned in the form documentation. It maps Excel cells to form fields.
 */

// Cell mapping configuration with sheet-specific mappings
const SHEET_CELL_MAPPINGS = {
  // Main data sheet - "Emag data" sheet
  main: {
    E4: "siteName", // Site Name - "Tallygawley" (from image)
    E5: "dwfM3", // DWF (m3) - "400.00"
    E6: "fftM3", // FFT (m3) - "1200.00"
    E7: "flowmeterMakeModel", // Flow meter make/model - "Siemens Mag 5100W"
    H4: "flowmeterTypeH4", // Type of Flowmeter (part 1) - from H4
    H5: "flowmeterTypeH5", // Type of Flowmeter (part 2) - from H5
    E8: "flowmeterSerial1", // Sensor serial number - "264203H083"
    E9: "flowmeterSerial2", // Transmitter serial number - "N1S1245043"
    E10: "boreSize", // Bore size (mm) - "200.00"
    E11: "calibrationFactors", // Calibration factors - "24.78"
    E12: "upstreamApproach", // Upstream approach (mm) - "1300.20"
    E13: "downstreamApproach", // Downstream approach (mm) - "2000.20"
    E14: "qmaxF", // Qmax - "100.00"
    E15: "earthBonding", // Earth bonding - "Built In"
    E16: "runningFull", // Running full - "Yes"
    E17: "stableReadings", // Stable readings - "Yes"
    E18: "entrainedAir", // Entrained air - "No"
    E19: "vibration", // Vibration - "No"
    E20: "factoryCalibrationDate", // Factory calibration certificate date - "N/a"
    E21: "verificationDate", // Verification date - "N/a"
    E22: "maintenanceMethod", // Method for maintenance - "Removal, Valves Either side"
  },

  // Uncertainty sheet - get value directly from F104 and date from F2
  uncertainty: {
    F104: "uncertainty", // Get uncertainty value directly from F104 cell (raw value: "5.29")
    F2: "conclusionDate", // Get date from F2 cell
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
  const name = sheetName.toLowerCase();

  if (name.includes("uncertainty")) {
    return "uncertainty";
  }

  if (name === "curves") {
    return "curves";
  }

  if (
    name.includes("emag") ||
    name.includes("data") ||
    name.includes("main") ||
    name === "sheet1" ||
    name.includes("flow")
  ) {
    return "main";
  }

  return "additional";
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

    console.log(
      `Calculating sum for range ${range} (${startCell} to ${endCell})`
    );

    let sum = 0;
    let validCells = 0;

    for (let r = startPos.row; r <= endPos.row; r++) {
      for (let c = startPos.col; c <= endPos.col; c++) {
        const cellAddress = XLSX.utils.encode_cell({ r, c });
        const cell = worksheet[cellAddress];

        if (cell && cell.v !== null && cell.v !== undefined) {
          const value = cell.v;
          const numericValue = parseFloat(value);

          if (!isNaN(numericValue) && isFinite(numericValue)) {
            sum += numericValue;
            validCells++;
            console.log(
              `  ${cellAddress}: ${value} → ${numericValue} (added to sum, running total: ${sum})`
            );
          } else {
            console.log(`  ${cellAddress}: "${value}" (non-numeric, skipped)`);
          }
        } else {
          // Also log empty cells for debugging
          console.log(`  ${cellAddress}: [empty]`);
        }
      }
    }

    console.log(`Range ${range} sum: ${sum} (from ${validCells} valid cells)`);

    // Round to reasonable precision for uncertainty values
    const roundedSum = Math.round(sum * 100) / 100; // Round to 2 decimal places
    console.log(`Rounded sum: ${roundedSum}`);

    return validCells > 0 ? roundedSum : null;
  } catch (error) {
    console.warn(`Error calculating range sum for ${range}:`, error.message);
    return null;
  }
}

/**
 * Gets the value from a specific cell in a worksheet
 * @param {Object} worksheet - XLSX worksheet object
 * @param {string} cellRef - Excel cell reference (e.g., 'E4') or range (e.g., 'F7:F102')
 * @returns {string|number|null} - Cell value, range sum, or null if not found
 */
function getCellValue(worksheet, cellRef) {
  try {
    // Check if this is a range (contains ':')
    if (cellRef.includes(":")) {
      console.log(`Processing range: ${cellRef}`);
      return calculateRangeSum(worksheet, cellRef);
    }

    const { row, col } = parseCellReference(cellRef);
    const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
    console.log(
      `Reading cell ${cellRef} -> address ${cellAddress} (row: ${row}, col: ${col})`
    );

    // Try multiple approaches to read the cell
    const cell = worksheet[cellAddress];
    let value = cell ? cell.v : null;

    console.log(`Cell ${cellRef} raw object:`, cell);
    console.log(`Cell ${cellRef} contains:`, value, typeof value);

    // Handle merged cells - check if this cell is part of a merged range
    if (
      (value === null || value === undefined || value === 0) &&
      worksheet["!merges"]
    ) {
      console.log(`Checking merged cells for ${cellRef}...`);

      for (const merge of worksheet["!merges"]) {
        // Check if our target cell is within this merged range
        if (
          row >= merge.s.r &&
          row <= merge.e.r &&
          col >= merge.s.c &&
          col <= merge.e.c
        ) {
          console.log(`Cell ${cellRef} is in merged range:`, merge);

          // Get the top-left cell of the merged range (where the value is stored)
          const mergeTopLeft = XLSX.utils.encode_cell({
            r: merge.s.r,
            c: merge.s.c,
          });
          const mergeCell = worksheet[mergeTopLeft];

          if (mergeCell && mergeCell.v) {
            console.log(
              `Found merged cell value at ${mergeTopLeft}:`,
              mergeCell.v
            );
            value = mergeCell.v;
            break;
          }
        }
      }
    }

    // Special handling for F104 to ensure we get the raw value "5.29"
    if (cellRef === "F104") {
      console.log("=== SPECIAL F104 HANDLING ===");
      console.log("F104 cell object:", cell);

      if (cell) {
        // Try to get the raw value first
        if (cell.v !== null && cell.v !== undefined) {
          console.log("F104 raw value (cell.v):", cell.v);
          value = cell.v;
        }

        // Also log the formatted value for debugging
        if (cell.w) {
          console.log("F104 formatted value (cell.w):", cell.w);
        }

        // Log cell type
        if (cell.t) {
          console.log("F104 cell type:", cell.t);
        }
      }
      console.log("=== END F104 HANDLING ===");
    }

    // Special handling for F2 to ensure we get the date value
    if (cellRef === "F2") {
      console.log("=== SPECIAL F2 DATE HANDLING ===");
      console.log("F2 cell object:", cell);

      if (cell) {
        // Try to get the raw value first
        if (cell.v !== null && cell.v !== undefined) {
          console.log("F2 raw value (cell.v):", cell.v);
          value = cell.v;
        }

        // Also log the formatted value for debugging
        if (cell.w) {
          console.log("F2 formatted value (cell.w):", cell.w);
        }

        // Log cell type
        if (cell.t) {
          console.log("F2 cell type:", cell.t);
        }

        // Handle Excel date serial numbers
        if (typeof cell.v === "number" && cell.t === "n") {
          console.log("F2 appears to be an Excel date serial number:", cell.v);
          // Convert Excel date serial number to JavaScript Date
          const excelDate = new Date((cell.v - 25569) * 86400 * 1000);
          const formattedDate = excelDate.toISOString().split("T")[0]; // YYYY-MM-DD format
          console.log("Converted Excel date to:", formattedDate);
          value = formattedDate;
        }
      }
      console.log("=== END F2 DATE HANDLING ===");
    }

    // If we got 0 but expected text, try alternative approaches
    if (value === 0 && cellRef === "E4") {
      console.log("=== TRYING ALTERNATIVE E4 READING METHODS ===");

      // Try reading as text
      if (cell && cell.w) {
        console.log("Cell.w (formatted text):", cell.w);
        value = cell.w;
      }

      // Try reading raw value with different types
      if (cell && cell.t) {
        console.log("Cell type (t):", cell.t);
        if (cell.t === "s" || cell.t === "str") {
          console.log("Cell is string type, using raw value");
          value = cell.v;
        }
      }

      // Try direct cell address lookup
      const directCell = worksheet["E4"];
      console.log("Direct E4 lookup:", directCell);
      if (directCell && directCell.v !== 0) {
        value = directCell.v;
      }

      console.log("Final E4 value after alternatives:", value);
      console.log("=== END ALTERNATIVE METHODS ===");
    }

    return value;
  } catch (error) {
    console.warn(`Error reading cell ${cellRef}:`, error.message);
    return null;
  }
}

/**
 * Searches for a value in a worksheet by looking through all cells
 * @param {Object} worksheet - XLSX worksheet object
 * @param {string} searchValue - Value to search for
 * @returns {string|null} - Found value or null
 */
function searchValueInWorksheet(worksheet, searchValue) {
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");

  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = worksheet[cellAddress];
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
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const extractedData = {};
        const processedSheets = [];

        console.log("Available sheets:", workbook.SheetNames);

        // Categorize sheets first
        const sheetCategories = {};
        workbook.SheetNames.forEach((sheetName) => {
          const category = getSheetCategory(sheetName);
          sheetCategories[category] = sheetName;
          console.log(`Sheet "${sheetName}" categorized as: ${category}`);
        });

        // Process each sheet with appropriate mappings
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          processedSheets.push(sheetName);
          console.log(`\n--- Processing sheet: ${sheetName} ---`);
          console.log("Worksheet range:", worksheet["!ref"]);

          const sheetCategory = getSheetCategory(sheetName);
          console.log(`Sheet category: ${sheetCategory}`);

          // Check for merged cells
          if (worksheet["!merges"]) {
            console.log("Merged cells found:", worksheet["!merges"]);

            // Show what's in each merged cell
            worksheet["!merges"].forEach((merge, index) => {
              const mergeTopLeft = XLSX.utils.encode_cell({
                r: merge.s.r,
                c: merge.s.c,
              });
              const mergeCell = worksheet[mergeTopLeft];
              const mergeValue = mergeCell ? mergeCell.v : null;
              console.log(`Merge ${index} (${mergeTopLeft}): "${mergeValue}"`);
            });
          }

          // Show some sample cells to understand the structure
          console.log("Sample cells:");
          ["E3", "E4", "E5", "E6", "E7"].forEach((cellRef) => {
            const testValue = getCellValue(worksheet, cellRef);
            console.log(`  ${cellRef}: "${testValue}" (${typeof testValue})`);

            // Also check the raw cell data
            const { row, col } = parseCellReference(cellRef);
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            const rawCell = worksheet[cellAddress];
            console.log(`    Raw cell ${cellRef}:`, rawCell);
          });

          // COMPREHENSIVE CELL DUMP - Look at a wider range around E4
          console.log("\n=== COMPREHENSIVE CELL DUMP AROUND E4 ===");
          for (let r = 2; r <= 6; r++) {
            // rows 3-7 (0-based: 2-6)
            for (let c = 3; c <= 7; c++) {
              // columns D-H (0-based: 3-7)
              const cellAddr = XLSX.utils.encode_cell({ r, c });
              const cell = worksheet[cellAddr];
              if (
                cell &&
                cell.v !== undefined &&
                cell.v !== null &&
                cell.v !== ""
              ) {
                console.log(
                  `Cell ${cellAddr} (row ${r + 1}, col ${String.fromCharCode(
                    65 + c
                  )}): "${cell.v}" (type: ${typeof cell.v}, cellType: ${
                    cell.t
                  })`
                );
              }
            }
          }
          console.log("=== END COMPREHENSIVE DUMP ===\n");

          // Special dump for uncertainty sheet
          if (sheetCategory === "uncertainty") {
            console.log("\n=== UNCERTAINTY SHEET CELL DUMP ===");
            console.log("Looking for cells around F104...");

            // Check a wide range around F104 (row 104, column F=5)
            for (let r = 100; r <= 108; r++) {
              for (let c = 3; c <= 8; c++) {
                // columns D-I
                const cellAddr = XLSX.utils.encode_cell({ r, c });
                const cell = worksheet[cellAddr];
                if (
                  cell &&
                  cell.v !== undefined &&
                  cell.v !== null &&
                  cell.v !== ""
                ) {
                  console.log(
                    `Uncertainty sheet ${cellAddr} (row ${
                      r + 1
                    }, col ${String.fromCharCode(65 + c)}): "${
                      cell.v
                    }" (type: ${typeof cell.v}, cellType: ${cell.t})`
                  );
                }
              }
            }
            console.log("=== END UNCERTAINTY DUMP ===\n");
          }

          // Get the appropriate mappings for this sheet category
          const mappingsForSheet = SHEET_CELL_MAPPINGS[sheetCategory] || {};
          console.log(
            `Using mappings for ${sheetCategory}:`,
            Object.keys(mappingsForSheet)
          );

          // Process each cell mapping for this sheet category
          Object.entries(mappingsForSheet).forEach(([cellRef, fieldName]) => {
            const value = getCellValue(worksheet, cellRef);
            console.log(
              `Processing cell ${cellRef} -> ${fieldName}: "${value}" (sheet: ${sheetName}, category: ${sheetCategory})`
            );

            // Special debugging for E4/siteName
            if (cellRef === "E4") {
              console.log("=== E4 DEBUGGING ===");
              console.log("Raw value from E4:", value);
              console.log("Value type:", typeof value);
              console.log("Is value truthy?", !!value);
              console.log("Is value exactly 0?", value === 0);
              console.log("String conversion:", String(value));
              console.log("=== END E4 DEBUG ===");
            }

            // Special debugging for uncertainty fields
            if (fieldName === "uncertainty") {
              console.log("=== UNCERTAINTY DEBUGGING ===");
              console.log(
                `Processing ${cellRef} in sheet ${sheetName} (category: ${sheetCategory})`
              );
              console.log("Raw value:", value);
              console.log("Value type:", typeof value);
              console.log(
                "Is value null/undefined?",
                value === null || value === undefined
              );

              if (cellRef.includes(":")) {
                console.log("This is a range calculation (F5:F102 sum)");
                console.log("Calculated sum:", value);
              } else {
                console.log("String conversion:", String(value));

                // Check if this looks like a header instead of the actual value
                const valueStr = String(value);
                const isHeader =
                  valueStr.includes("UQ") ||
                  valueStr.includes("±%") ||
                  valueStr.includes("(±%)");
                console.log("Is this a header?", isHeader);

                // Special handling for F104 - it should contain the SUM formula result
                if (cellRef === "F104" && !isHeader) {
                  console.log(`F104 contains SUM formula result: ${value}`);
                  // Don't reset F104 value if it's numeric
                } else if (isHeader) {
                  console.log(
                    "Skipping header value, looking for actual numeric uncertainty"
                  );
                  value = null; // Reset value so it doesn't get used
                }
              }

              console.log("=== END UNCERTAINTY DEBUG ===");
            }

            // Accept any value that's not null, undefined, or empty string (including 0)
            if (value !== null && value !== undefined && value !== "") {
              console.log(`Value "${value}" passes the condition check`);
            } else if (value === 0) {
              console.log(`Value is 0 - treating as valid data`);
            } else {
              console.log(`Value "${value}" failed condition check`);
            }

            if (
              value !== null &&
              value !== undefined &&
              (value !== "" || value === 0)
            ) {
              // Handle special cases
              if (
                fieldName === "flowmeterSerial1" ||
                fieldName === "flowmeterSerial2"
              ) {
                // Combine serial numbers
                if (!extractedData.flowmeterSerial) {
                  extractedData.flowmeterSerial = value;
                } else {
                  extractedData.flowmeterSerial += `, ${value}`;
                }
                console.log(
                  `Combined serial numbers: ${extractedData.flowmeterSerial}`
                );
              } else {
                // Special tracking for uncertainty overwrites
                if (fieldName === "uncertainty") {
                  if (extractedData[fieldName]) {
                    console.log(
                      `*** WARNING: Overwriting existing uncertainty "${extractedData[fieldName]}" with "${value}" from ${cellRef} ***`
                    );
                  } else {
                    console.log(
                      `*** Setting uncertainty = "${value}" from ${cellRef} ***`
                    );
                  }
                }
                extractedData[fieldName] = value;
                console.log(`Set ${fieldName} = "${value}"`);
              }
            } else {
              console.log(
                `Cell ${cellRef} is empty or null in sheet ${sheetName}`
              );
            }
          });
        });

        // Special fallback for site name if E4 returned 0
        if (!extractedData.siteName || extractedData.siteName === 0) {
          console.log("=== FALLBACK SEARCH FOR SITE NAME ===");

          // First, try to find site name in merged cells around E4
          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];

            if (worksheet["!merges"]) {
              console.log(`Checking merged cells in sheet ${sheetName}:`);

              worksheet["!merges"].forEach((merge, index) => {
                console.log(`Merge ${index}:`, merge);

                // Check if this merge is near row 4 (where site name should be)
                if (merge.s.r <= 4 && merge.e.r >= 3) {
                  const mergeTopLeft = XLSX.utils.encode_cell({
                    r: merge.s.r,
                    c: merge.s.c,
                  });
                  const mergeCell = worksheet[mergeTopLeft];

                  if (mergeCell && mergeCell.v) {
                    const mergeValue = String(mergeCell.v);
                    console.log(
                      `Merged cell ${mergeTopLeft} contains: "${mergeValue}"`
                    );

                    // Check if this looks like a site name
                    if (
                      mergeValue.includes("WwTW") ||
                      mergeValue.includes("WWTW") ||
                      mergeValue.includes("Tallygawley") ||
                      mergeValue.includes("Ballygawley") ||
                      mergeValue.toLowerCase().includes("site")
                    ) {
                      console.log(
                        `Found site name in merged cell: "${mergeValue}"`
                      );
                      extractedData.siteName = mergeValue;
                      return;
                    }
                  }
                }
              });
            }
          });

          // If still not found, do a BRUTE FORCE search for site name in ALL cells
          console.log("=== BRUTE FORCE SEARCH FOR SITE NAME ===");

          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            console.log(`Brute force searching in sheet: ${sheetName}`);

            // Search every single cell in the worksheet
            Object.keys(worksheet).forEach((cellAddr) => {
              // Skip metadata keys
              if (cellAddr.startsWith("!")) return;

              const cell = worksheet[cellAddr];
              if (cell && cell.v) {
                const cellValue = String(cell.v);

                // Check for various site name patterns
                if (
                  cellValue.includes("Tallygawley") ||
                  cellValue.includes("Ballygawley")
                ) {
                  console.log(
                    `*** FOUND SITE NAME at ${cellAddr}: "${cellValue}" ***`
                  );
                  extractedData.siteName = cellValue;
                  return;
                }

                // Also check for any WwTW pattern
                if (cellValue.includes("WwTW") || cellValue.includes("WWTW")) {
                  console.log(
                    `*** FOUND WwTW pattern at ${cellAddr}: "${cellValue}" ***`
                  );
                  if (!extractedData.siteName || extractedData.siteName === 0) {
                    extractedData.siteName = cellValue;
                  }
                }
              }
            });
          });

          console.log("=== END BRUTE FORCE SEARCH ===");

          // If still not found, try the original pattern search
          if (!extractedData.siteName || extractedData.siteName === 0) {
            const siteNamePatterns = ["Ballygawley", "WwTW", "WWTW", "Site"];

            workbook.SheetNames.forEach((sheetName) => {
              const worksheet = workbook.Sheets[sheetName];
              const range = XLSX.utils.decode_range(
                worksheet["!ref"] || "A1:A1"
              );

              console.log(
                `Pattern searching for site name in sheet: ${sheetName}`
              );

              for (let row = range.s.r; row <= Math.min(range.e.r, 20); row++) {
                for (
                  let col = range.s.c;
                  col <= Math.min(range.e.c, 10);
                  col++
                ) {
                  const cellAddress = XLSX.utils.encode_cell({
                    r: row,
                    c: col,
                  });
                  const cell = worksheet[cellAddress];

                  if (cell && cell.v) {
                    const cellValue = String(cell.v);

                    // Check if this cell contains site name patterns
                    for (const pattern of siteNamePatterns) {
                      if (cellValue.includes(pattern)) {
                        console.log(
                          `Found potential site name at ${cellAddress}: "${cellValue}"`
                        );

                        // If this looks like a complete site name, use it
                        if (
                          cellValue.length > 5 &&
                          (cellValue.includes("WwTW") ||
                            cellValue.includes("WWTW"))
                        ) {
                          extractedData.siteName = cellValue;
                          console.log(
                            `Using fallback site name: "${cellValue}"`
                          );
                          break;
                        }
                      }
                    }

                    if (extractedData.siteName && extractedData.siteName !== 0)
                      break;
                  }
                }
                if (extractedData.siteName && extractedData.siteName !== 0)
                  break;
              }
            });
          }

          console.log("=== END FALLBACK SEARCH ===");
        }

        // If we didn't find data in mapped cells, try searching for common patterns
        if (Object.keys(extractedData).length === 0) {
          console.log(
            "No data found in mapped cells, attempting pattern search..."
          );

          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];

            // Search for common patterns
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

        // Add metadata
        extractedData._metadata = {
          fileName: file.name,
          processedSheets,
          processedAt: new Date().toISOString(),
          totalSheets: workbook.SheetNames.length,
        };

        // Final debugging summary
        console.log("\n=== FINAL EXTRACTION SUMMARY ===");
        console.log("Sheet categories:", sheetCategories);
        console.log(
          "Total extracted fields:",
          Object.keys(extractedData).filter((k) => !k.startsWith("_")).length
        );

        // Special focus on uncertainty
        if (extractedData.uncertainty !== undefined) {
          console.log(
            `*** UNCERTAINTY VALUE: "${
              extractedData.uncertainty
            }" (type: ${typeof extractedData.uncertainty}) ***`
          );
          console.log(
            `*** UNCERTAINTY AS NUMBER: ${parseFloat(
              extractedData.uncertainty
            )} ***`
          );
        } else {
          console.log("*** NO UNCERTAINTY VALUE FOUND ***");
        }

        // Show all extracted fields
        Object.keys(extractedData).forEach((field) => {
          if (!field.startsWith("_")) {
            console.log(
              `${field}: "${extractedData[field]}" (${typeof extractedData[
                field
              ]})`
            );
          }
        });
        console.log("=== END FINAL SUMMARY ===\n");

        resolve(extractedData);
      } catch (error) {
        reject(new Error(`Failed to process Excel file: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read Excel file"));
    };

    reader.readAsArrayBuffer(file);
  });
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
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const preview = {
          fileName: file.name,
          sheetNames: workbook.SheetNames,
          sheets: {},
        };

        // Get preview of each sheet (first 10 rows)
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");
          const maxRows = Math.min(10, range.e.r + 1);

          preview.sheets[sheetName] = {
            range: worksheet["!ref"],
            maxRows,
            data: [],
          };

          for (let row = 0; row < maxRows; row++) {
            const rowData = [];
            for (let col = range.s.c; col <= range.e.c; col++) {
              const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
              const cell = worksheet[cellAddress];
              rowData.push(cell ? cell.v : "");
            }
            preview.sheets[sheetName].data.push(rowData);
          }
        });

        resolve(preview);
      } catch (error) {
        reject(new Error(`Failed to preview Excel file: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read Excel file for preview"));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Extracts all data from the uncertainty sheet and logs it to console
 * @param {File} file - Excel file to process
 * @returns {Promise<Object>} - Full uncertainty sheet data
 */
export async function extractUncertaintySheetData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        console.log("=== EXTRACTING FULL UNCERTAINTY SHEET DATA ===");
        console.log("Available sheets:", workbook.SheetNames);

        // Find the uncertainty sheet
        const uncertaintySheetName = workbook.SheetNames.find((sheetName) => {
          const name = sheetName.toLowerCase();
          return name.includes("uncertainty") || name.includes("fft");
        });

        if (!uncertaintySheetName) {
          console.log("No uncertainty sheet found");
          resolve({ error: "No uncertainty sheet found" });
          return;
        }

        console.log(`Found uncertainty sheet: "${uncertaintySheetName}"`);
        const worksheet = workbook.Sheets[uncertaintySheetName];
        const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");

        console.log(`Sheet range: ${worksheet["!ref"]}`);
        console.log(`Rows: ${range.s.r + 1} to ${range.e.r + 1}`);
        console.log(
          `Columns: ${String.fromCharCode(
            65 + range.s.c
          )} to ${String.fromCharCode(65 + range.e.c)}`
        );

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

        // Extract all cell data
        for (let row = range.s.r; row <= range.e.r; row++) {
          uncertaintyData.rowData[row + 1] = {};

          for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            const cell = worksheet[cellAddress];
            const colLetter = String.fromCharCode(65 + col);

            // Initialize column data if not exists
            if (!uncertaintyData.columnData[colLetter]) {
              uncertaintyData.columnData[colLetter] = {};
            }

            if (cell) {
              const cellInfo = {
                address: cellAddress,
                value: cell.v,
                type: cell.t,
                formula: cell.f,
                rawValue: cell.w || cell.v,
              };

              uncertaintyData.allCells[cellAddress] = cellInfo;
              uncertaintyData.rowData[row + 1][colLetter] = cellInfo;
              uncertaintyData.columnData[colLetter][row + 1] = cellInfo;

              // Track non-empty cells
              if (cell.v !== null && cell.v !== undefined && cell.v !== "") {
                uncertaintyData.nonEmptyCells[cellAddress] = cellInfo;
              }

              // Track numeric cells
              if (typeof cell.v === "number" && !isNaN(cell.v)) {
                uncertaintyData.numericCells[cellAddress] = cellInfo;
              }

              // Track formula cells
              if (cell.f) {
                uncertaintyData.formulaCells[cellAddress] = cellInfo;
              }
            }
          }
        }

        // Log summary statistics
        console.log(
          `Total cells processed: ${
            Object.keys(uncertaintyData.allCells).length
          }`
        );
        console.log(
          `Non-empty cells: ${
            Object.keys(uncertaintyData.nonEmptyCells).length
          }`
        );
        console.log(
          `Numeric cells: ${Object.keys(uncertaintyData.numericCells).length}`
        );
        console.log(
          `Formula cells: ${Object.keys(uncertaintyData.formulaCells).length}`
        );

        // Log all non-empty cells
        console.log("\n=== ALL NON-EMPTY CELLS ===");
        Object.entries(uncertaintyData.nonEmptyCells).forEach(
          ([address, cellInfo]) => {
            console.log(
              `${address}: "${cellInfo.value}" (type: ${cellInfo.type}${
                cellInfo.formula ? ", formula: " + cellInfo.formula : ""
              })`
            );
          }
        );

        // Log specific rows and columns of interest
        console.log("\n=== COLUMN F DATA (Uncertainty Column) ===");
        if (uncertaintyData.columnData["F"]) {
          Object.entries(uncertaintyData.columnData["F"]).forEach(
            ([row, cellInfo]) => {
              if (
                cellInfo.value !== null &&
                cellInfo.value !== undefined &&
                cellInfo.value !== ""
              ) {
                console.log(
                  `F${row}: "${cellInfo.value}" (type: ${cellInfo.type}${
                    cellInfo.formula ? ", formula: " + cellInfo.formula : ""
                  })`
                );
              }
            }
          );
        }

        // Log rows around 104 (the target row)
        console.log("\n=== ROWS 100-108 DATA ===");
        for (let row = 100; row <= 108; row++) {
          if (uncertaintyData.rowData[row]) {
            const rowCells = Object.entries(uncertaintyData.rowData[row])
              .filter(
                ([col, cellInfo]) =>
                  cellInfo.value !== null &&
                  cellInfo.value !== undefined &&
                  cellInfo.value !== ""
              )
              .map(
                ([col, cellInfo]) =>
                  `${col}${row}: "${cellInfo.value}"${
                    cellInfo.formula
                      ? " (formula: " + cellInfo.formula + ")"
                      : ""
                  }`
              )
              .join(", ");

            if (rowCells) {
              console.log(`Row ${row}: ${rowCells}`);
            }
          }
        }

        // Special focus on F104
        console.log("\n=== F104 DETAILED ANALYSIS ===");
        const f104Cell = uncertaintyData.allCells["F104"];
        if (f104Cell) {
          console.log("F104 found:");
          console.log(`  Value: "${f104Cell.value}"`);
          console.log(`  Type: ${f104Cell.type}`);
          console.log(`  Formula: ${f104Cell.formula || "None"}`);
          console.log(`  Raw/Formatted: "${f104Cell.rawValue}"`);
        } else {
          console.log("F104 cell is empty or not found");
        }

        console.log("=== END UNCERTAINTY SHEET EXTRACTION ===");

        // Extract the specific F104 rawValue for form usage
        const f104RawValue =
          uncertaintyData.columnData["F"] &&
          uncertaintyData.columnData["F"][104]
            ? uncertaintyData.columnData["F"][104].rawValue
            : null;

        console.log(`\n=== F104 RAW VALUE FOR FORM ===`);
        console.log(`F104 rawValue: "${f104RawValue}"`);
        console.log(`=== END F104 RAW VALUE ===`);

        // Add the specific value to the returned data
        uncertaintyData.f104RawValue = f104RawValue;

        resolve(uncertaintyData);
      } catch (error) {
        console.error("Error extracting uncertainty sheet data:", error);
        reject(
          new Error(
            `Failed to extract uncertainty sheet data: ${error.message}`
          )
        );
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read Excel file"));
    };

    reader.readAsArrayBuffer(file);
  });
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

  // Combine H4 and H5 into flowmeterType
  const h4 = excelData.hasOwnProperty("flowmeterTypeH4") && excelData.flowmeterTypeH4 != null ? safeValue(excelData.flowmeterTypeH4) : null;
  const h5 = excelData.hasOwnProperty("flowmeterTypeH5") && excelData.flowmeterTypeH5 != null ? safeValue(excelData.flowmeterTypeH5) : null;
  if (h4 || h5) {
    formData.flowmeterType = [h4, h5].filter(Boolean).join(" ");
  }

  if (
    excelData.hasOwnProperty("flowmeterSerial") &&
    excelData.flowmeterSerial !== null &&
    excelData.flowmeterSerial !== undefined
  ) {
    formData.flowmeterSerial = safeValue(excelData.flowmeterSerial);
  }

  if (
    excelData.hasOwnProperty("qmaxF") &&
    excelData.qmaxF !== null &&
    excelData.qmaxF !== undefined
  ) {
    formData.qmaxF = safeValue(excelData.qmaxF);
  }

  // Handle uncertainty value - ensure both fields get the same value
  if (
    excelData.hasOwnProperty("uncertainty") &&
    excelData.uncertainty !== null &&
    excelData.uncertainty !== undefined
  ) {
    const uncertaintyValue = safeValue(excelData.uncertainty);
    console.log(
      `Setting uncertainty value: "${uncertaintyValue}" for both fields`
    );
    formData.uncertainty = uncertaintyValue;
    formData.conclusionUnCert = uncertaintyValue; // Use the same uncertainty value for conclusion
    console.log(`Uncertainty field set to: "${formData.uncertainty}"`);
    console.log(
      `Conclusion uncertainty field set to: "${formData.conclusionUnCert}"`
    );
  } else {
    console.log("No uncertainty value found in Excel data");
  }

  if (
    excelData.hasOwnProperty("siteName") &&
    excelData.siteName !== null &&
    excelData.siteName !== undefined
  ) {
    formData.siteName = safeValue(excelData.siteName);
    console.log(
      `Mapping siteName: "${excelData.siteName}" -> "${formData.siteName}"`
    );
  }

  // Handle additional fields from spreadsheet
  if (
    excelData.hasOwnProperty("dwfM3") &&
    excelData.dwfM3 !== null &&
    excelData.dwfM3 !== undefined
  ) {
    formData.dryW = safeValue(excelData.dwfM3); // Map DWF to dryW field
  }

  if (
    excelData.hasOwnProperty("fftM3") &&
    excelData.fftM3 !== null &&
    excelData.fftM3 !== undefined
  ) {
    formData.maxFFT = safeValue(excelData.fftM3); // Map FFT to maxFFT field
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

  if (excelData.conclusionDate) {
    formData.conclusionDate = safeValue(excelData.conclusionDate);
  }

  if (excelData.wocNumber) {
    formData.wocNumber = excelData.wocNumber;
  }

  if (excelData.dryW) {
    formData.dryW = excelData.dryW;
  }

  if (excelData.maxD) {
    formData.maxD = excelData.maxD;
  }

  if (excelData.maxFFT) {
    formData.maxFFT = excelData.maxFFT;
  }

  // Add metadata for debugging
  formData._excelMetadata = excelData._metadata;

  // Final check: ensure both uncertainty fields have the same value
  if (formData.uncertainty && !formData.conclusionUnCert) {
    console.log(
      "Fallback: Setting conclusionUnCert to match uncertainty value"
    );
    formData.conclusionUnCert = formData.uncertainty;
  }
  if (formData.conclusionUnCert && !formData.uncertainty) {
    console.log(
      "Fallback: Setting uncertainty to match conclusionUnCert value"
    );
    formData.uncertainty = formData.conclusionUnCert;
  }

  console.log("Final form data uncertainty values:");
  console.log(`uncertainty: "${formData.uncertainty}"`);
  console.log(`conclusionUnCert: "${formData.conclusionUnCert}"`);

  return formData;
}

export default {
  processExcelFile,
  validateExcelFile,
  getExcelPreview,
  mapExcelDataToForm,
  extractUncertaintySheetData,
  CELL_MAPPINGS,
  SHEET_NAMES,
};
