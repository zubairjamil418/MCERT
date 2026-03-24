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
//     const response = await fetch("/templates/mclerts-template.docx");
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

// Summarize data for debugging without dumping full base64
const summarizeForLog = (data) => {
  try {
    const summary = {};
    for (const [key, value] of Object.entries(data || {})) {
      if (value === null || value === undefined) {
        summary[key] = value;
      } else if (Array.isArray(value)) {
        summary[key] = { type: "array", length: value.length };
      } else if (value instanceof Date) {
        summary[key] = { type: "date", value: value.toISOString() };
      } else if (typeof value === "object") {
        if (typeof value.dataUrl === "string") {
          const len = value.dataUrl.length;
          const preview = value.dataUrl.slice(0, 40);
          summary[key] = {
            type: "imagePayload",
            width: value.width,
            height: value.height,
            caption: value.caption,
            dataUrlPreview: `${preview}... (len=${len})`,
          };
        } else {
          summary[key] = { type: "object" };
        }
      } else if (typeof value === "string") {
        if (value.startsWith("data:")) {
          const len = value.length;
          summary[key] = `dataUrl(len=${len})`;
        } else {
          summary[key] =
            value.length > 200 ? `${value.slice(0, 200)}...` : value;
        }
      } else {
        summary[key] = value;
      }
    }
    return summary;
  } catch {
    return { error: "summary_failed" };
  }
};

// Ensure data passed into docxtemplater is safe: no undefined/null scalars and no plain objects,
// while preserving image payload objects and arrays.
const sanitizeForDocx = (data) => {
  if (!data || typeof data !== "object") return {};
  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) {
      sanitized[key] = "";
      continue;
    }
    // Preserve image payloads or direct dataURLs for tags containing "image"
    const isImageKey = key.toLowerCase().includes("image");
    const isCaptionKey = key.endsWith("Caption");
    if (isImageKey && !isCaptionKey) {
      if (
        (typeof value === "object" && typeof value.dataUrl === "string") ||
        (typeof value === "string" && value.startsWith("data:"))
      ) {
        sanitized[key] = value;
        continue;
      }
      // If image key but not a recognized payload, set empty to avoid crashes
      sanitized[key] = undefined;
      continue;
    }
    if (Array.isArray(value)) {
      sanitized[key] = value;
      continue;
    }
    if (value instanceof Date) {
      sanitized[key] = formatDateToDDMMYYYY(value);
      continue;
    }
    if (typeof value === "object") {
      // Avoid passing arbitrary objects to docxtemplater
      sanitized[key] = "";
      continue;
    }
    sanitized[key] = value;
  }
  return sanitized;
};

const stripAllImages = (data) => {
  const clone = { ...data };
  const strippedKeys = [];
  for (const key of Object.keys(clone)) {
    if (key.toLowerCase().includes("image")) {
      if (clone[key] !== undefined) {
        strippedKeys.push(key);
      }
      clone[key] = undefined;
    }
  }
  return { clone, strippedKeys };
};
// (Captions are set directly as strings in the data object below; no extra processing needed)
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

// Deprecated: previously returned object payloads with width/height.
// We now pass plain dataURL strings to the image module for simplicity.

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
      data[`${templatePrefix}${i + 1}`] = dataUrl; // string dataURL
      data[`${templatePrefix}${i + 1}Caption`] = captions[i] || "";
    }
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

// Helper function to split flowmeterSerial into two fields
const splitFlowmeterSerial = (flowmeterSerial) => {
  if (!flowmeterSerial) {
    return { flowmeterSerial: "", flowmeterSerialTransmitter: "" };
  }

  const serialString = String(flowmeterSerial).trim();

  // Check if it contains a comma
  if (serialString.includes(",")) {
    const parts = serialString.split(",").map((part) => part.trim());
    return {
      flowmeterSerial: parts[0] || "",
      flowmeterSerialTransmitter: parts[1] || "",
    };
  }

  // If no comma, assume it's just the serial (first field)
  return {
    flowmeterSerial: serialString,
    flowmeterSerialTransmitter: "",
  };
};

// --- main generator (expects {%aerialViewImage} in the .docx) ---
export const generateDocumentFromTemplate = async (
  formData,
  fileName = "generated-document.docx"
) => {
  console.log("formData", formData);
  try {
    const res = await fetch("/templates/mclerts-template.docx");
    if (!res.ok)
      throw new Error("Template not found at /templates/mclerts-template.docx");
    const zip = new PizZip(await res.arrayBuffer());

    // Image module: value is a dataURL string
    const imageModule = new ImageModule({
      getImage: (tagValue /* dataURL */, tagName) => {
        if (
          tagValue &&
          typeof tagValue === "object" &&
          typeof tagValue.dataUrl === "string"
        ) {
          return dataURLToBytes(tagValue.dataUrl);
        }
        if (typeof tagValue === "string" && tagValue.startsWith("data:")) {
          return dataURLToBytes(tagValue);
        }
        return new Uint8Array(); // no image -> remove tag
      },
      getSize: (imgBytes, tagValue, tagName) => {
        // If an object with explicit size is provided, honor it
        if (tagValue && typeof tagValue === "object") {
          const width = Number(tagValue.width);
          const height = Number(tagValue.height);
          return [
            Number.isFinite(width) ? width : DEFAULT_IMAGE_SIZE.width,
            Number.isFinite(height) ? height : DEFAULT_IMAGE_SIZE.height,
          ];
        }
        // Otherwise, size by tag name: first image of any group gets large size
        const isFirstSlot =
          typeof tagName === "string" && /Image1$/.test(tagName);
        const size = isFirstSlot ? LARGE_IMAGE_SIZE : SMALL_IMAGE_SIZE;
        return [size.width, size.height];
      },
    });

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      modules: [imageModule],
    });
    try {
      const safeData = sanitizeForDocx(formData);
      // Debug: log only caption fields to verify values
      const captionEntries = Object.entries(safeData).filter(([k]) =>
        k.endsWith("Caption")
      );
      // eslint-disable-next-line no-console
      console.log(
        "Docxtemplater caption values:",
        Object.fromEntries(captionEntries)
      );
      // eslint-disable-next-line no-console
      console.log("Docxtemplater data summary:", summarizeForLog(safeData));
      doc.render(safeData);
    } catch (renderError) {
      // Surface helpful diagnostics from docxtemplater
      // Some environments attach details on renderError.properties
      // eslint-disable-next-line no-console
      console.error("Docxtemplater render error:", {
        name: renderError?.name,
        message: renderError?.message,
        properties: renderError?.properties,
        errors: renderError?.properties?.errors,
      });
      // Fallback retry: strip all images and try again so user still gets a file
      try {
        const safeData = sanitizeForDocx(formData);
        const { clone, strippedKeys } = stripAllImages(safeData);
        // eslint-disable-next-line no-console
        console.warn(
          "Retrying render without images. Stripped image keys:",
          strippedKeys
        );
        const retryDoc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          modules: [imageModule],
        });
        retryDoc.render(clone);
        const out = retryDoc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        saveAs(out, fileName);
        return {
          success: true,
          message: "Rendered without images due to template issue",
        };
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
  // Split flowmeterSerial into two fields
  const { flowmeterSerial: serial, flowmeterSerialTransmitter: transmitter } =
    splitFlowmeterSerial(formData.flowmeterSerial);

  // Build data for all text tags
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
    flowmeterType: formData.flowmeterType || "",
    flowmeterSerial: serial,
    flowmeterSerialTransmitter: transmitter,
    niwAssetId: formData.niwAssetId || "",
    statementOfCompliance: formData.statementOfCompliance || "",
    uncertainty: formData.uncertainty || "",
    inspectionReportNo: formData.inspectionReportNo || "",
    dateOfInspection: formatDateToDDMMYYYY(formData.dateOfInspection),
    siteDescription: formData.siteDescription || "",
    flowmeterLocation: formData.flowmeterLocation || "",

    // References & Definitions 1.0 section - dynamic array
    referencesSection: "References & Definitions 1.0",
    references: formData.references || [
      "Minimum requirements for the self-monitoring of flow",
      "BS EN ISO 20456: 2019 Measurement of fluid flow in closed conduits",
      "SIRIS Excel site data spreadsheet – relevant flow meter",
    ],

    // Ensure caption arrays exist to prevent template index errors like [0]
    aerialViewCaptions: Array.isArray(formData.aerialViewCaptions)
      ? formData.aerialViewCaptions
      : [],
    siteProcessCaptions: Array.isArray(formData.siteProcessCaptions)
      ? formData.siteProcessCaptions
      : [],
    inspectionFlowCaptions: Array.isArray(formData.inspectionFlowCaptions)
      ? formData.inspectionFlowCaptions
      : [],
    flowMeasurementCaptions: Array.isArray(formData.flowMeasurementCaptions)
      ? formData.flowMeasurementCaptions
      : [],
    surveyEquipmentCaptions: Array.isArray(formData.surveyEquipmentCaptions)
      ? formData.surveyEquipmentCaptions
      : [],
    appendixACaptions: Array.isArray(formData.appendixACaptions)
      ? formData.appendixACaptions
      : [],
    appendixBCaptions: Array.isArray(formData.appendixBCaptions)
      ? formData.appendixBCaptions
      : [],
    appendixCCaptions: Array.isArray(formData.appendixCCaptions)
      ? formData.appendixCCaptions
      : [],

    // New sections
    aerialViewDescription: formData.aerialViewDescription || "",
    siteProcessDescription: formData.siteProcessDescription || "",
    inspectionFlowDescription: formData.inspectionFlowDescription || "",
    flowMeasurementDescription: formData.flowMeasurementDescription || "",
    surveyEquipmentDescription: formData.surveyEquipmentDescription || "",

    // Permit limits
    wocNumber: formData.wocNumber || "",
    dryW: formData.dryW || "",
    maxD: formData.maxD || "",
    maxFFT: formData.maxFFT || "",
    qmaxF: formData.qmaxF || "",
    field1: formData.field1 || "",
    field2: formData.field2 || "",
    field3: formData.field3 || "",

    // Conclusion fields
    conclusionUnCert: formData.conclusionUnCert || "",
    conclusionDate: formatDateToDDMMYYYY(formData.conclusionDate),

    // Appendix fields
    appendixField1: formData.appendixField1 || "",
    appendixField2: formData.appendixField2 || "",
    appendixField3: formData.appendixField3 || "",

    currentDate: formatDateToDDMMYYYY(new Date()),
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
    // Pre-define caption placeholders so template tags like {{...Caption}} never crash
    aerialViewImage1Caption: formData.aerialViewImage1Caption || "",
    aerialViewImage2Caption: formData.aerialViewImage2Caption || "",
    aerialViewImage3Caption: formData.aerialViewImage3Caption || "",
    aerialViewImage4Caption: formData.aerialViewImage4Caption || "",
    aerialViewImage5Caption: formData.aerialViewImage5Caption || "",
    siteProcessImage1Caption: formData.siteProcessCaptions[0] || "",
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
  };
  console.log("data", data);
  const singleAerialSource =
    formData.aerialViewFile || formData.aerialViewImage || null;
  const singleAerialDataUrl = await getDataURLFromValue(singleAerialSource);
  if (singleAerialDataUrl) {
    data.aerialViewImage = singleAerialDataUrl;
    data.aerialViewImageCaption = formData.aerialViewImageCaption || "";
  }

  // Handle signature text - only include if signatureIncluded is true
  if (formData.signatureIncluded) {
    data.signatureName = formData.signatureName || "";
    data.signatureCompany = formData.signatureCompany || "";
  } else {
    // If signature is not included, set empty values
    data.signatureName = "";
    data.signatureCompany = "";
  }

  await assignImageArray(data, formData, {
    filesKey: "aerialViewImages",
    captionsKey: "aerialViewCaptions",
    templatePrefix: "aerialViewImage",
  });

  await assignImageArray(data, formData, {
    filesKey: "siteProcessImages",
    captionsKey: "siteProcessCaptions",
    templatePrefix: "siteProcessImage",
  });

  await assignImageArray(data, formData, {
    filesKey: "inspectionFlowImages",
    captionsKey: "inspectionFlowCaptions",
    templatePrefix: "inspectionFlowImage",
  });

  await assignImageArray(data, formData, {
    filesKey: "flowMeasurementImages",
    captionsKey: "flowMeasurementCaptions",
    templatePrefix: "flowMeasurementImage",
  });

  await assignImageArray(data, formData, {
    filesKey: "surveyEquipmentImages",
    captionsKey: "surveyEquipmentCaptions",
    templatePrefix: "surveyEquipmentImage",
  });

  await assignImageArray(data, formData, {
    filesKey: "appendixAFiles",
    captionsKey: "appendixACaptions",
    templatePrefix: "appendixAImage",
  });

  await assignImageArray(data, formData, {
    filesKey: "appendixBFiles",
    captionsKey: "appendixBCaptions",
    templatePrefix: "appendixBImage",
  });

  await assignImageArray(data, formData, {
    filesKey: "appendixCFiles",
    captionsKey: "appendixCCaptions",
    templatePrefix: "appendixCImage",
  });

  const fileName = `MCERTS_Report_${data.siteName || "Site"}_${
    data.dateOfInspection || new Date().toISOString().split("T")[0]
  }.docx`;

  return await generateDocumentFromTemplate(data, fileName);
};
