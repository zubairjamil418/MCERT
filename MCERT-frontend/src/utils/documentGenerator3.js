// import PizZip from "pizzip";
// import Docxtemplater from "docxtemplater";
// import { saveAs } from "file-saver";

// /**
//  * Generate and download a document using a template file and form data
//  * @param {Object} formData - The form data to map to placeholders
//  * @param {string} fileName - The name for the downloaded file
//  */
// export const generateDocumentFromTemplate = async (
//   formData,
//   fileName = "generated-document.docx"
// ) => {
//   try {
//     // Fetch the template from public folder
//     const response = await fetch("/templates/mclerts-template-3.docx");
//     if (!response.ok) {
//       throw new Error(
//         "Template file not found. Please ensure the template is placed in the public/templates folder."
//       );
//     }

//     const arrayBuffer = await response.arrayBuffer();

//     // Load the document
//     const zip = new PizZip(arrayBuffer);
//     const doc = new Docxtemplater(zip, {
//       paragraphLoop: true,
//       linebreaks: true,
//     });

//     // Set the template variables (placeholders)
//     doc.setData(formData);

//     // Render the document
//     doc.render();

//     // Generate the output document
//     const output = doc.getZip().generate({
//       type: "blob",
//       mimeType:
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//     });

//     // Download the file
//     saveAs(output, fileName);

//     return {
//       success: true,
//       message: "Document generated and downloaded successfully!",
//     };
//   } catch (error) {
//     console.error("Error generating document:", error);
//     return {
//       success: false,
//       message:
//         "Error generating document. Please check your template file and try again.",
//       error: error.message,
//     };
//   }
// };

// /**
//  * Generate and download MCLERTS Site Inspection Report
//  * @param {Object} formData - The form data from the inspection form
//  */
// export const generateMCLERTSReport = async (formData) => {
//   // Format the data for the template
//   const templateData = {
//     reportPreparedBy: formData.reportPreparedBy || "",
//     inspector: formData.inspector || "",
//     consentPermitHolder: formData.consentPermitHolder || "",
//     consentPermitNo: formData.consentPermitNo || "",
//     siteName: formData.siteName || "",
//     siteContact: formData.siteContact || "",
//     siteAddress: formData.siteAddress || "",
//     siteRefPostcode: formData.siteRefPostcode || "",
//     irishGridRef: formData.irishGridRef || "",
//     flowmeterMakeModel: formData.flowmeterMakeModel || "",
//     flowmeterType: formData.flowmeterType || "",
//     flowmeterSerial: formData.flowmeterSerial || "",
//     niwAssetId: formData.niwAssetId || "",
//     statementOfCompliance: formData.statementOfCompliance || "",
//     uncertainty: formData.uncertainty || "",
//     inspectionReportNo: formData.inspectionReportNo || "",
//     dateOfInspection: formData.dateOfInspection || "",
//     siteDescription: formData.siteDescription || "",
//     flowmeterLocation: formData.flowmeterLocation || "",
//     // Add current date for the report
//     currentDate: new Date().toLocaleDateString(),
//     // Add timestamp for unique identification
//     timestamp: new Date().toISOString().replace(/[:.]/g, "-"),
//   };

//   // Handle aerial view image if present
//   if (formData.aerialViewFile) {
//     try {
//       // For now, we'll add a note about the image instead of embedding it
//       // This avoids the base64 text issue in the document
//       templateData.aerialViewImage = `[Aerial view image: ${formData.aerialViewFile.name}]`;
//     } catch (error) {
//       console.error("Error processing image:", error);
//       templateData.aerialViewImage = "[Aerial view image not available]";
//     }
//   } else {
//     templateData.aerialViewImage = "[No aerial view image provided]";
//   }

//   // Generate filename with site name and date
//   const fileName = `MCLERTS_Report_${formData.siteName || "Site"}_${
//     formData.dateOfInspection || new Date().toISOString().split("T")[0]
//   }.docx`;

//   return await generateDocumentFromTemplate(templateData, fileName);
// };

// /**
//  * Validate template file
//  * @param {File} file - The file to validate
//  * @returns {Object} Validation result
//  */
// export const validateTemplateFile = (file) => {
//   if (!file) {
//     return { valid: false, message: "No file selected" };
//   }

//   if (!file.name.endsWith(".docx")) {
//     return { valid: false, message: "Please select a .docx file" };
//   }

//   if (file.size > 10 * 1024 * 1024) {
//     // 10MB limit
//     return { valid: false, message: "File size should be less than 10MB" };
//   }

//   return { valid: true, message: "File is valid" };
// };

// docxGenerator.js
// npm i pizzip docxtemplater file-saver docxtemplater-image-module-free

import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import ImageModule from "docxtemplater-image-module-free";

// --- helpers ---

// Normalize PizZip entry paths from backslash (Windows) to forward-slash.
const normalizeZipPaths = (zip) => {
  const entries = Object.keys(zip.files);
  for (const entry of entries) {
    if (entry.includes("\\")) {
      const fwdEntry = entry.split("\\").join("/");
      const zipEntry = zip.files[entry];
      if (zipEntry && typeof zipEntry === "object") {
        zipEntry.name = fwdEntry;
      }
      if (!zip.files[fwdEntry]) {
        zip.files[fwdEntry] = zipEntry;
      }
      delete zip.files[entry];
    }
  }
  return zip;
};

const fileToDataURL = (file) =>
  new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result); // "data:image/...;base64,XXXX"
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });

const dataURLToBytes = (dataURL) => {
  const base64 = dataURL.split(",")[1];
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
};

const DEFAULT_IMAGE_SIZE = { width: 530, height: 220 };
const LARGE_IMAGE_SIZE = { width: 530, height: 220 };
const SMALL_IMAGE_SIZE = { width: 230, height: 200 };

// Convert input into dataURL if possible
const getDataURLFromValue = async (value) => {
  if (!value) return undefined;
  if (value instanceof File) {
    return await fileToDataURL(value);
  }
  if (typeof value === "string" && value.startsWith("data:")) {
    return value;
  }
  if (typeof value === "object") {
    if (typeof value.dataUrl === "string") {
      return value.dataUrl;
    }
    if (typeof value.data === "string" && value.data.startsWith("data:")) {
      return value.data;
    }
  }
  return undefined;
};

// Assign images as dataURL strings and set matching caption keys
const assignImageArray = async (
  data,
  formData,
  { filesKey, captionsKey, templatePrefix, maxCount = 5 }
) => {
  const files = formData?.[filesKey];
  if (!Array.isArray(files) || files.length === 0) return;
  const captions = Array.isArray(formData?.[captionsKey])
    ? formData[captionsKey]
    : [];

  for (let i = 0; i < Math.min(files.length, maxCount); i++) {
    const dataUrl = await getDataURLFromValue(files[i]);
    if (dataUrl) {
      data[`${templatePrefix}${i + 1}`] = dataUrl;
      data[`${templatePrefix}${i + 1}Caption`] = captions[i] || "";
    }
  }
};

// Predefine empty captions to avoid undefined template tags
const ensureCaptionPlaceholders = (data, prefix, count = 5) => {
  for (let i = 1; i <= count; i++) {
    const key = `${prefix}${i}Caption`;
    if (data[key] === undefined) data[key] = "";
  }
};

// Helper function to format date to dd/mm/yyyy
const formatDateToDDMMYYYY = (dateValue) => {
  if (!dateValue) return "";

  // If it's already a Date object
  if (dateValue instanceof Date) {
    const day = String(dateValue.getDate()).padStart(2, "0");
    const month = String(dateValue.getMonth() + 1).padStart(2, "0");
    const year = dateValue.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // If it's a string, try to parse it
  if (typeof dateValue === "string") {
    // Handle YYYY-MM-DD format
    if (dateValue.match(/^\d{4}-\d{2}-\d{2}/)) {
      const [year, month, day] = dateValue.split("-");
      return `${day}/${month}/${year}`;
    }

    // Handle other date formats - try to parse
    const date = new Date(dateValue);
    if (!isNaN(date.getTime())) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  }

  return dateValue; // Return as-is if we can't parse it
};

// Helper function to format date with ordinal suffix (e.g., "12th September 2025")
const formatDateWithOrdinal = (dateValue) => {
  if (!dateValue) return "";

  let date;

  // If it's already a Date object
  if (dateValue instanceof Date) {
    date = dateValue;
  } else if (typeof dateValue === "string") {
    // Handle YYYY-MM-DD format
    if (dateValue.match(/^\d{4}-\d{2}-\d{2}/)) {
      const [year, month, day] = dateValue.split("-");
      date = new Date(year, month - 1, day);
    } else {
      // Try to parse other formats
      date = new Date(dateValue);
    }
  } else {
    return "";
  }

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "";
  }

  const day = date.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  // Add ordinal suffix
  const getOrdinalSuffix = (n) => {
    const j = n % 10;
    const k = n % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
  };

  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
};

// Helper function to split space-separated values
// Returns an object with firstPart and secondPart
const splitSpaceSeparatedValue = (value) => {
  if (!value || typeof value !== "string") {
    return { firstPart: "", secondPart: "" };
  }

  const parts = value.trim().split(/\s+/);
  return {
    firstPart: parts[0] || "",
    secondPart: parts[1] || "",
  };
};

// --- main generator (expects {%aerialViewImage} in the .docx) ---
export const generateDocumentFromTemplate = async (
  formData,
  fileName = "generated-document.docx"
) => {
  try {
    const res = await fetch("/templates/mclerts-template-3.docx");
    if (!res.ok)
      throw new Error("Template not found at /templates/mclerts-template-3.docx");
    const zip = normalizeZipPaths(new PizZip(await res.arrayBuffer()));

    // Image module: value is a dataURL string
    const imageModule = new ImageModule({
      getImage: (tagValue /* dataURL */, tagName) => {
        if (typeof tagValue === "string" && tagValue.startsWith("data:")) {
          return dataURLToBytes(tagValue);
        }
        return new Uint8Array(); // no image -> remove tag
      },
      getSize: (imgBytes, tagValue, tagName) => {
        // First image slot of any group larger, others smaller
        const isFirst = typeof tagName === "string" && /Image1$/.test(tagName);
        const size = isFirst ? LARGE_IMAGE_SIZE : SMALL_IMAGE_SIZE;
        return [size.width, size.height];
      },
    });

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      modules: [imageModule],
    });

    try {
      doc.setData(formData);
      doc.render();
    } catch (renderError) {
      console.error("Docxtemplater render error:", {
        name: renderError?.name,
        message: renderError?.message,
        properties: renderError?.properties,
      });
      // Fallback: fetch a FRESH template and retry without image data
      try {
        const retryRes = await fetch("/templates/mclerts-template-3.docx");
        if (!retryRes.ok) throw renderError;
        const freshZip = normalizeZipPaths(new PizZip(await retryRes.arrayBuffer()));
        const retryDoc = new Docxtemplater(freshZip, {
          paragraphLoop: true,
          linebreaks: true,
          modules: [imageModule],
        });
        const clone = Object.fromEntries(
          Object.entries(formData).map(([k, v]) => [
            k,
            k.toLowerCase().includes("image") && !k.endsWith("Caption") ? undefined : v,
          ])
        );
        retryDoc.setData(clone);
        retryDoc.render();
        const retryOut = retryDoc.getZip().generate({
          type: "blob",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        saveAs(retryOut, fileName);
        return { success: true, message: "Rendered without images due to template issue" };
      } catch (retryError) {
        throw renderError;
      }
    }

    const out = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    saveAs(out, fileName);
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, message: e.message };
  }
};

// --- MCLERTS wrapper ---
export const generateMCLERTSReport = async (formData) => {
  const data = {
    reportPreparedBy: formData.reportPreparedBy || "",
    inspector: formData.inspector || "",
    consentPermitHolder: formData.consentPermitHolder || "",
    consentPermitNo: formData.consentPermitNo || "",
    siteName: formData.siteName || "",
    siteContact: formData.siteContact || "",
    siteAddress: formData.siteAddress || "",
    siteRefPostcode: formData.siteRefPostcode || "",
    irishGridRef: formData.irishGridRef || "",
    flowmeterMakeModel: formData.flowmeterMakeModel || "",
    flowmeterType: formData.flowmeterType || formData.secondaryDeviceType || "",
    flowmeterSerial: formData.flowmeterSerial || "",

    flowmeterSensorSerial: formData.flowmeterSensorSerial || "",
    flowmeterTransmitterSerial: formData.flowmeterTransmitterSerial || "",
    niwAssetId: formData.niwAssetId || "",
    // MCERTS Certification
    mcertProductCertified: formData.mcertProductCertified || "",
    mcertCertificateNo: formData.mcertCertificateNo || "",
    mcertCertificationDate: formatDateToDDMMYYYY(
      formData.mcertCertificationDate
    ),
    // Primary Device Details (Section 3.1)
    primaryDeviceDescription: formData.primaryDeviceDescription || "",
    scummark: formData.visibleScumMark || "",
    variableflow: formData.variableflow || "",
    // Secondary Device Details (Section 3.2)
    secondaryDeviceDescription: formData.secondaryDeviceDescription || "",
    // Flow Meter Verification (Section 3.3) — split measurement values like Form 2
    verificationCalibrationReference:
      formData.verificationCalibrationReference || "",
    verificationPlateMeasurement: (() => {
      const split = splitSpaceSeparatedValue(
        formData.verificationPlateMeasurement || ""
      );
      return split.firstPart;
    })(),
    verificationPlateMeasurement2: (() => {
      const split = splitSpaceSeparatedValue(
        formData.verificationPlateMeasurement || ""
      );
      return split.secondPart;
    })(),
    verificationInstrumentDisplay: (() => {
      const split = splitSpaceSeparatedValue(
        formData.verificationInstrumentDisplay || ""
      );
      return split.firstPart;
    })(),
    verificationInstrumentDisplay2: (() => {
      const split = splitSpaceSeparatedValue(
        formData.verificationInstrumentDisplay || ""
      );
      return split.secondPart;
    })(),
    verificationHeadError: formData.verificationHeadError || "",
    verificationRepeatabilityError:
      formData.verificationRepeatabilityError || "",
    // Flow Measurement NIEA Viewpoint (Section 3.4)
    nieaDescription:
      formData.nieaDescription || formData.nieaViewpointDescription || "",
    nieaViewpointDescription: formData.nieaViewpointDescription || "",
    // Conclusion section 6.0
    conclusionUncertaintySheetF2: formData.conclusionUncertaintySheetF2
      ? formatDateToDDMMYYYY(formData.conclusionUncertaintySheetF2)
      : "",
    conclusionUncertaintySheetF2Formatted: formData.conclusionUncertaintySheetF2
      ? formatDateWithOrdinal(formData.conclusionUncertaintySheetF2)
      : "",
    conclusionUncertaintySheetF104:
      formData.conclusionUncertaintySheetF104 || "",
    statementOfCompliance: formData.statementOfCompliance || "",
    uncertainty: formData.uncertainty || "",
    inspectionReportNo: formData.inspectionReportNo || "",
    dateOfInspection: formatDateToDDMMYYYY(formData.dateOfInspection),
    siteDescription: formData.siteDescription || "",
    flowmeterLocation: formData.flowmeterLocation || "",

    // References & Definitions 1.0 section - dynamic array
    referencesSection: "References & Definitions 1.0",
    references: formData.references || [
      "Minimum Requirements for the Self-Monitoring of Effluent Flow",
      "BS ISO 4359 Liquid flow measurement in open channels (Flumes)",
      "Siris Software Rectangular flume",
    ],

    // New sections
    aerialViewDescription: formData.aerialViewDescription || "",
    siteProcessDescription: formData.siteProcessDescription || "",
    inspectionFlowDescription: formData.inspectionFlowDescription || "",
    flowMeasurementDescription: formData.flowMeasurementDescription || "",
    surveyEquipmentDescription: formData.surveyEquipmentDescription || "",

    // Maintenance & Calibration 4.0
    routineMaintenanceDescription: formData.routineMaintenanceDescription || "",
    routineVerificationDescription:
      formData.routineVerificationDescription || "",
    nextFlowValidationDate: (() => {
      if (formData.dateOfInspection) {
        const d = new Date(formData.dateOfInspection);
        if (!isNaN(d.getTime())) {
          d.setFullYear(d.getFullYear() + 1);
          const day = d.getDate();
          const suffix =
            day % 10 === 1 && day !== 11
              ? "st"
              : day % 10 === 2 && day !== 12
              ? "nd"
              : day % 10 === 3 && day !== 13
              ? "rd"
              : "th";
          const months = [
            "January","February","March","April","May","June",
            "July","August","September","October","November","December",
          ];
          return `${day}${suffix} ${months[d.getMonth()]} ${d.getFullYear()}`;
        }
      }
      return "";
    })(),

    // Permit limits
    wocNumber: formData.wocNumber || "",
    dryW: formData.dryW || "",
    maxD: formData.maxD || "",
    maxFFT: formData.maxFFT || "",
    qmaxF: formData.qmaxF || "",
    field1: formData.field1 || "",
    field2: formData.field2 || "",
    field3: formData.field3 || "",

    // Appendix fields
    appendixField1: formData.appendixField1 || "",
    appendixField2: formData.appendixField2 || "",
    appendixField3: formData.appendixField3 || "",

    currentDate: new Date().toLocaleDateString(),
    timestamp: new Date().toISOString().replace(/[:.]/g, "-"),

    // IMPORTANT: these tags in the template must be {%imageName}
    aerialViewImage: undefined, // data URL string (set below)
    aerialViewImageCaption: "",

    // Signature text fields
    signatureName: formData.signatureName || "",
    signatureCompany: formData.signatureCompany || "",

    // Multiple images for new sections - will be set below
    aerialViewImage1: undefined,
    aerialViewImage2: undefined,
    aerialViewImage3: undefined,
    aerialViewImage4: undefined,
    aerialViewImage5: undefined,
    siteProcessImage1: undefined,
    siteProcessImage2: undefined,
    siteProcessImage3: undefined,
    siteProcessImage4: undefined,
    siteProcessImage5: undefined,
    inspectionFlowImage1: undefined,
    inspectionFlowImage2: undefined,
    inspectionFlowImage3: undefined,
    inspectionFlowImage4: undefined,
    inspectionFlowImage5: undefined,
    flowMeasurementImage1: undefined,
    flowMeasurementImage2: undefined,
    flowMeasurementImage3: undefined,
    flowMeasurementImage4: undefined,
    flowMeasurementImage5: undefined,
    surveyEquipmentImage1: undefined,
    surveyEquipmentImage2: undefined,
    surveyEquipmentImage3: undefined,
    surveyEquipmentImage4: undefined,
    surveyEquipmentImage5: undefined,
    routineMaintenanceImage1: undefined,
    routineMaintenanceImage2: undefined,
    routineMaintenanceImage3: undefined,
    routineMaintenanceImage4: undefined,
    routineMaintenanceImage5: undefined,
    routineVerificationImage1: undefined,
    routineVerificationImage2: undefined,
    routineVerificationImage3: undefined,
    routineVerificationImage4: undefined,
    routineVerificationImage5: undefined,
    appendixAImage1: undefined,
    appendixAImage2: undefined,
    appendixAImage3: undefined,
    appendixAImage4: undefined,
    appendixAImage5: undefined,
    appendixBImage1: undefined,
    appendixBImage2: undefined,
    appendixBImage3: undefined,
    appendixBImage4: undefined,
    appendixBImage5: undefined,
    appendixCImage1: undefined,
    appendixCImage2: undefined,
    appendixCImage3: undefined,
    appendixCImage4: undefined,
    appendixCImage5: undefined,
    // Form2 specific image sections
    primaryDeviceImage1: undefined,
    primaryDeviceImage2: undefined,
    primaryDeviceImage3: undefined,
    primaryDeviceImage4: undefined,
    primaryDeviceImage5: undefined,
    secondaryDeviceImage1: undefined,
    secondaryDeviceImage2: undefined,
    secondaryDeviceImage3: undefined,
    secondaryDeviceImage4: undefined,
    secondaryDeviceImage5: undefined,
    verificationImage1: undefined,
    verificationImage2: undefined,
    verificationImage3: undefined,
    verificationImage4: undefined,
    verificationImage5: undefined,
    nieaImage1: undefined,
    nieaImage2: undefined,
    nieaImage3: undefined,
    nieaImage4: undefined,
    nieaImage5: undefined,
    // Critical Data Sticker Images
    criticalDataStickerImage1: undefined,
    criticalDataStickerImage2: undefined,
    criticalDataStickerImage3: undefined,
    criticalDataStickerImage4: undefined,
    criticalDataStickerImage5: undefined,
    // Survey Equipment Table (as array for template rendering)
    surveyEquipmentTable: formData.surveyEquipmentTable || [],
    // Caption fields (direct string mapping like documentGenerator.js)
    aerialViewImage1Caption: formData.aerialViewImage1Caption || "",
    aerialViewImage2Caption: formData.aerialViewImage2Caption || "",
    aerialViewImage3Caption: formData.aerialViewImage3Caption || "",
    aerialViewImage4Caption: formData.aerialViewImage4Caption || "",
    aerialViewImage5Caption: formData.aerialViewImage5Caption || "",
    siteProcessImage1Caption: formData.siteProcessImage1Caption || "",
    siteProcessImage2Caption: formData.siteProcessImage2Caption || "",
    siteProcessImage3Caption: formData.siteProcessImage3Caption || "",
    siteProcessImage4Caption: formData.siteProcessImage4Caption || "",
    siteProcessImage5Caption: formData.siteProcessImage5Caption || "",
    inspectionFlowImage1Caption: formData.inspectionFlowImage1Caption || "",
    inspectionFlowImage2Caption: formData.inspectionFlowImage2Caption || "",
    inspectionFlowImage3Caption: formData.inspectionFlowImage3Caption || "",
    inspectionFlowImage4Caption: formData.inspectionFlowImage4Caption || "",
    inspectionFlowImage5Caption: formData.inspectionFlowImage5Caption || "",
    flowMeasurementImage1Caption: formData.flowMeasurementImage1Caption || "",
    flowMeasurementImage2Caption: formData.flowMeasurementImage2Caption || "",
    flowMeasurementImage3Caption: formData.flowMeasurementImage3Caption || "",
    flowMeasurementImage4Caption: formData.flowMeasurementImage4Caption || "",
    flowMeasurementImage5Caption: formData.flowMeasurementImage5Caption || "",
    surveyEquipmentImage1Caption: formData.surveyEquipmentImage1Caption || "",
    surveyEquipmentImage2Caption: formData.surveyEquipmentImage2Caption || "",
    surveyEquipmentImage3Caption: formData.surveyEquipmentImage3Caption || "",
    surveyEquipmentImage4Caption: formData.surveyEquipmentImage4Caption || "",
    surveyEquipmentImage5Caption: formData.surveyEquipmentImage5Caption || "",
    routineMaintenanceImage1Caption:
      formData.routineMaintenanceImage1Caption || "",
    routineMaintenanceImage2Caption:
      formData.routineMaintenanceImage2Caption || "",
    routineMaintenanceImage3Caption:
      formData.routineMaintenanceImage3Caption || "",
    routineMaintenanceImage4Caption:
      formData.routineMaintenanceImage4Caption || "",
    routineMaintenanceImage5Caption:
      formData.routineMaintenanceImage5Caption || "",
    routineVerificationImage1Caption:
      formData.routineVerificationImage1Caption || "",
    routineVerificationImage2Caption:
      formData.routineVerificationImage2Caption || "",
    routineVerificationImage3Caption:
      formData.routineVerificationImage3Caption || "",
    routineVerificationImage4Caption:
      formData.routineVerificationImage4Caption || "",
    routineVerificationImage5Caption:
      formData.routineVerificationImage5Caption || "",
    appendixAImage1Caption: formData.appendixAImage1Caption || "",
    appendixAImage2Caption: formData.appendixAImage2Caption || "",
    appendixAImage3Caption: formData.appendixAImage3Caption || "",
    appendixAImage4Caption: formData.appendixAImage4Caption || "",
    appendixAImage5Caption: formData.appendixAImage5Caption || "",
    appendixBImage1Caption: formData.appendixBImage1Caption || "",
    appendixBImage2Caption: formData.appendixBImage2Caption || "",
    appendixBImage3Caption: formData.appendixBImage3Caption || "",
    appendixBImage4Caption: formData.appendixBImage4Caption || "",
    appendixBImage5Caption: formData.appendixBImage5Caption || "",
    appendixCImage1Caption: formData.appendixCImage1Caption || "",
    appendixCImage2Caption: formData.appendixCImage2Caption || "",
    appendixCImage3Caption: formData.appendixCImage3Caption || "",
    appendixCImage4Caption: formData.appendixCImage4Caption || "",
    appendixCImage5Caption: formData.appendixCImage5Caption || "",
    primaryDeviceImage1Caption: formData.primaryDeviceImage1Caption || "",
    primaryDeviceImage2Caption: formData.primaryDeviceImage2Caption || "",
    primaryDeviceImage3Caption: formData.primaryDeviceImage3Caption || "",
    primaryDeviceImage4Caption: formData.primaryDeviceImage4Caption || "",
    primaryDeviceImage5Caption: formData.primaryDeviceImage5Caption || "",
    secondaryDeviceImage1Caption: formData.secondaryDeviceImage1Caption || "",
    secondaryDeviceImage2Caption: formData.secondaryDeviceImage2Caption || "",
    secondaryDeviceImage3Caption: formData.secondaryDeviceImage3Caption || "",
    secondaryDeviceImage4Caption: formData.secondaryDeviceImage4Caption || "",
    secondaryDeviceImage5Caption: formData.secondaryDeviceImage5Caption || "",
    verificationImage1Caption: formData.verificationImage1Caption || "",
    verificationImage2Caption: formData.verificationImage2Caption || "",
    verificationImage3Caption: formData.verificationImage3Caption || "",
    verificationImage4Caption: formData.verificationImage4Caption || "",
    verificationImage5Caption: formData.verificationImage5Caption || "",
    nieaImage1Caption: formData.nieaImage1Caption || "",
    nieaImage2Caption: formData.nieaImage2Caption || "",
    nieaImage3Caption: formData.nieaImage3Caption || "",
    nieaImage4Caption: formData.nieaImage4Caption || "",
    nieaImage5Caption: formData.nieaImage5Caption || "",
    criticalDataStickerImage1Caption:
      formData.criticalDataStickerImage1Caption || "",
    criticalDataStickerImage2Caption:
      formData.criticalDataStickerImage2Caption || "",
    criticalDataStickerImage3Caption:
      formData.criticalDataStickerImage3Caption || "",
    criticalDataStickerImage4Caption:
      formData.criticalDataStickerImage4Caption || "",
    criticalDataStickerImage5Caption:
      formData.criticalDataStickerImage5Caption || "",
  };

  const singleAerialSource =
    formData.aerialViewFile || formData.aerialViewImage || null;
  const singleAerialDataUrl = await getDataURLFromValue(singleAerialSource);
  if (singleAerialDataUrl) {
    data.aerialViewImage = singleAerialDataUrl;
    data.aerialViewImageCaption = formData.aerialViewImageCaption || "";
  }

  if (formData.signatureIncluded) {
    data.signatureName = formData.signatureName || "";
    data.signatureCompany = formData.signatureCompany || "";
  } else {
    data.signatureName = "";
    data.signatureCompany = "";
  }

  await assignImageArray(data, formData, {
    filesKey: "aerialViewImages",
    captionsKey: "aerialViewCaptions",
    templatePrefix: "aerialViewImage",
  });
  ensureCaptionPlaceholders(data, "aerialViewImage");

  await assignImageArray(data, formData, {
    filesKey: "siteProcessImages",
    captionsKey: "siteProcessCaptions",
    templatePrefix: "siteProcessImage",
  });
  ensureCaptionPlaceholders(data, "siteProcessImage");

  await assignImageArray(data, formData, {
    filesKey: "inspectionFlowImages",
    captionsKey: "inspectionFlowCaptions",
    templatePrefix: "inspectionFlowImage",
  });
  ensureCaptionPlaceholders(data, "inspectionFlowImage");

  await assignImageArray(data, formData, {
    filesKey: "flowMeasurementImages",
    captionsKey: "flowMeasurementCaptions",
    templatePrefix: "flowMeasurementImage",
  });
  ensureCaptionPlaceholders(data, "flowMeasurementImage");

  await assignImageArray(data, formData, {
    filesKey: "surveyEquipmentImages",
    captionsKey: "surveyEquipmentCaptions",
    templatePrefix: "surveyEquipmentImage",
  });
  ensureCaptionPlaceholders(data, "surveyEquipmentImage");

  await assignImageArray(data, formData, {
    filesKey: "routineMaintenanceImages",
    captionsKey: "routineMaintenanceCaptions",
    templatePrefix: "routineMaintenanceImage",
  });
  ensureCaptionPlaceholders(data, "routineMaintenanceImage");

  await assignImageArray(data, formData, {
    filesKey: "routineVerificationImages",
    captionsKey: "routineVerificationCaptions",
    templatePrefix: "routineVerificationImage",
  });
  ensureCaptionPlaceholders(data, "routineVerificationImage");

  await assignImageArray(data, formData, {
    filesKey: "appendixAFiles",
    captionsKey: "appendixACaptions",
    templatePrefix: "appendixAImage",
  });
  ensureCaptionPlaceholders(data, "appendixAImage");

  await assignImageArray(data, formData, {
    filesKey: "appendixBFiles",
    captionsKey: "appendixBCaptions",
    templatePrefix: "appendixBImage",
  });
  ensureCaptionPlaceholders(data, "appendixBImage");

  await assignImageArray(data, formData, {
    filesKey: "appendixCFiles",
    captionsKey: "appendixCCaptions",
    templatePrefix: "appendixCImage",
  });
  ensureCaptionPlaceholders(data, "appendixCImage");

  await assignImageArray(data, formData, {
    filesKey: "primaryDeviceImages",
    captionsKey: "primaryDeviceCaptions",
    templatePrefix: "primaryDeviceImage",
  });
  ensureCaptionPlaceholders(data, "primaryDeviceImage");

  await assignImageArray(data, formData, {
    filesKey: "secondaryDeviceImages",
    captionsKey: "secondaryDeviceCaptions",
    templatePrefix: "secondaryDeviceImage",
  });
  ensureCaptionPlaceholders(data, "secondaryDeviceImage");

  await assignImageArray(data, formData, {
    filesKey: "verificationImages",
    captionsKey: "verificationCaptions",
    templatePrefix: "verificationImage",
  });
  ensureCaptionPlaceholders(data, "verificationImage");

  await assignImageArray(data, formData, {
    filesKey: "nieaImages",
    captionsKey: "nieaCaptions",
    templatePrefix: "nieaImage",
  });
  ensureCaptionPlaceholders(data, "nieaImage");

  await assignImageArray(data, formData, {
    filesKey: "criticalDataStickerImages",
    captionsKey: "criticalDataStickerCaptions",
    templatePrefix: "criticalDataStickerImage",
  });
  ensureCaptionPlaceholders(data, "criticalDataStickerImage");

  const fileName = `MCERTS_Report_${data.siteName || "Site"}_${
    data.dateOfInspection || new Date().toISOString().split("T")[0]
  }.docx`;

  return await generateDocumentFromTemplate(data, fileName);
};
