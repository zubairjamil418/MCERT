/**
 * Form Model for MCERTS Flow Inspection Forms
 * Contains form data structure, validation, and utility functions
 */

import { compressImages } from "../utils/imageCompression";

// Default form data structure
export const getDefaultFormData = () => ({
  // Report Preparation Details
  reportPreparedBy: "Siris Flow Inspections Ltd",
  inspector: "",

  // Consent/Permit Holder & Company Registration
  consentPermitHolder: "",
  consentPermitNo: "",

  // Site Information
  siteName: "",
  siteContact: "",
  siteAddress: "",
  siteRefPostcode: "",
  irishGridRef: "",
  aerialViewFile: null,

  // References & Definitions section
  references: [
    "Minimum requirements for the self-monitoring of flow",
    "BS EN ISO 20456: 2019 Measurement of fluid flow in closed conduits",
    "SIRIS Excel site data spreadsheet – relevant flow meter",
  ],

  // Aerial view & general arrangement section
  aerialViewDescription:
    "Below is an aerial view of the site which provides the approximate location of the flow measurement system(s). In addition, a photograph showing the general arrangement and NIEA viewpoint is provided.",
  aerialViewImages: [],
  aerialViewCaptions: [],

  // Flowmeter Information
  flowmeterMakeModel: "",
  flowmeterType: "",
  flowmeterSerial: "",
  niwAssetId: "",

  // Compliance and Inspection Details
  statementOfCompliance:
    "Minimum requirements for self-monitoring of flow: MCERTS performance standard 28th August 2024",
  uncertainty: "",
  inspectionReportNo: "",
  dateOfInspection: "",
  siteDescription: "",
  flowmeterLocation: "",

  // Permit Limits
  wocNumber: "",
  dryW: "",
  maxD: "",
  maxFFT: "",
  qmaxF: "",

  // Additional Information
  field1: "Secondary verification successfully undertaken.",
  field2: "Yes- The flow meter is MCert product approved.",
  field3:
    'NIW operational personnel record maintenance activities in "Tough Books" this information is subsequently uploaded to NIW central database. At the time of the inspection the weir and channel were clean and free from significant fouling.',

  // Site process & schematic diagram 3.0
  siteProcessDescription: "",
  siteProcessImages: [],
  siteProcessCaptions: [],

  // Inspection of flow monitoring system 4.0
  inspectionFlowDescription: "",
  inspectionFlowImages: [],
  inspectionFlowCaptions: [],

  // Flow measurement verification check 5.0
  flowMeasurementDescription:
    "A flow verification was undertaken using a time-of-flight flow measurement system. 10 separate flow measurement readings were taken and compared against what was being displayed by the meter under test. A zero check was undertaken. The flow measurement verification was successful.",
  flowMeasurementImages: [],
  flowMeasurementCaptions: [],

  // Survey measurement equipment 6.0
  surveyEquipmentDescription:
    "The following is a list of vehicle equipment available for the inspection.",
  surveyEquipmentImages: [],
  surveyEquipmentCaptions: [],

  // Conclusion section
  conclusionUnCert: "",
  conclusionDate: "",

  // Appendix fields
  appendixField1: "",
  appendixField2: "",
  appendixField3: "",
  appendixAFiles: [],
  appendixACaptions: [],
  appendixBFiles: [],
  appendixBCaptions: [],
  appendixCFiles: [],
  appendixCCaptions: [],

  // Signature fields
  signatureIncluded: true,
  signatureName: "Aaron McGilligan", // Inspector signature name
  signatureCompany: "SIRIS Flow Inspections Ltd", // Company name
});

// Form field validation rules
export const formValidationRules = {
  inspector: {
    required: true,
    message: "Inspector is required",
  },
  consentPermitHolder: {
    required: true,
    message: "Consent/Permit Holder is required",
  },
  siteName: {
    required: true,
    message: "Site Name is required",
  },
  flowmeterType: {
    required: true,
    message: "Flowmeter Type is required",
  },
  dateOfInspection: {
    required: true,
    message: "Date of Inspection is required",
  },
};

// Dropdown options
export const dropdownOptions = {
  inspectors: ["Alice Morgan", "Brian O'Neill", "Charlie Kelly"],
  consentList: [
    "Acme Water Ltd",
    "Northern Utilities",
    "Siris Flow Inspections Ltd",
  ],
  flowTypes: ["Ultrasonic time-of-flight", "Electromagnetic", "Vortex"],
  siteContacts: [
    "John Smith - Site Manager",
    "Sarah Johnson - Operations Lead",
    "Mike Wilson - Technical Supervisor",
    "Emma Davis - Environmental Officer",
  ],
};

// Default options that cannot be deleted
export const defaultOptions = {
  inspectors: ["Alice Morgan", "Brian O'Neill", "Charlie Kelly"],
  consentList: [
    "Acme Water Ltd",
    "Northern Utilities",
    "Siris Flow Inspections Ltd",
  ],
  flowTypes: ["Ultrasonic time-of-flight", "Electromagnetic", "Vortex"],
  siteContacts: [
    "John Smith - Site Manager",
    "Sarah Johnson - Operations Lead",
    "Mike Wilson - Technical Supervisor",
    "Emma Davis - Environmental Officer",
  ],
};

// Multiple file upload fields
export const multipleFileFields = [
  "aerialViewImages",
  "siteProcessImages",
  "inspectionFlowImages",
  "flowMeasurementImages",
  "surveyEquipmentImages",
  "appendixAFiles",
  "appendixBFiles",
  "appendixCFiles",
];

export const imageCaptionFieldBySection = {
  aerialViewImages: "aerialViewCaptions",
  siteProcessImages: "siteProcessCaptions",
  inspectionFlowImages: "inspectionFlowCaptions",
  flowMeasurementImages: "flowMeasurementCaptions",
  surveyEquipmentImages: "surveyEquipmentCaptions",
  appendixAFiles: "appendixACaptions",
  appendixBFiles: "appendixBCaptions",
  appendixCFiles: "appendixCCaptions",
};

// Form validation function
export const validateForm = (formData) => {
  const errors = {};

  Object.keys(formValidationRules).forEach((field) => {
    const rule = formValidationRules[field];
    if (
      rule.required &&
      (!formData[field] || formData[field].toString().trim() === "")
    ) {
      errors[field] = rule.message;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Form data mapping for API responses
export const mapFormDataFromAPI = (apiData) => {
  let formDataToMap;

  if (apiData.formData) {
    formDataToMap = apiData.formData;
  } else if (apiData) {
    formDataToMap = apiData;
  } else {
    console.error("Unexpected data structure:", apiData);
    return getDefaultFormData();
  }

  return {
    reportPreparedBy: formDataToMap.reportPreparedBy || "",
    inspector: formDataToMap.inspector || "",
    consentPermitHolder: formDataToMap.consentPermitHolder || "",
    consentPermitNo: formDataToMap.consentPermitNo || "",
    siteName: formDataToMap.siteName || "",
    siteContact: formDataToMap.siteContact || "",
    siteAddress: formDataToMap.siteAddress || "",
    siteRefPostcode: formDataToMap.siteRefPostcode || "",
    irishGridRef: formDataToMap.irishGridRef || "",
    aerialViewFile: formDataToMap.aerialViewFile || null,
    references: formDataToMap.references || [
      "Minimum requirements for the self-monitoring of flow",
      "BS EN ISO 20456: 2019 Measurement of fluid flow in closed conduits",
      "SIRIS Excel site data spreadsheet – relevant flow meter",
    ],
    aerialViewDescription: formDataToMap.aerialViewDescription || "",
    aerialViewImages: formDataToMap.aerialViewImages || [],
    aerialViewCaptions: formDataToMap.aerialViewCaptions || [],
    siteProcessDescription: formDataToMap.siteProcessDescription || "",
    siteProcessImages: formDataToMap.siteProcessImages || [],
    siteProcessCaptions: formDataToMap.siteProcessCaptions || [],
    inspectionFlowDescription: formDataToMap.inspectionFlowDescription || "",
    inspectionFlowImages: formDataToMap.inspectionFlowImages || [],
    inspectionFlowCaptions: formDataToMap.inspectionFlowCaptions || [],
    flowMeasurementDescription: formDataToMap.flowMeasurementDescription || "",
    flowMeasurementImages: formDataToMap.flowMeasurementImages || [],
    flowMeasurementCaptions: formDataToMap.flowMeasurementCaptions || [],
    surveyEquipmentDescription: formDataToMap.surveyEquipmentDescription || "",
    surveyEquipmentImages: formDataToMap.surveyEquipmentImages || [],
    surveyEquipmentCaptions: formDataToMap.surveyEquipmentCaptions || [],
    conclusionUnCert: formDataToMap.conclusionUnCert || "",
    conclusionDate: formDataToMap.conclusionDate || "",
    flowmeterMakeModel: formDataToMap.flowmeterMakeModel || "",
    flowmeterType: formDataToMap.flowmeterType || "",
    flowmeterSerial: formDataToMap.flowmeterSerial || "",
    niwAssetId: formDataToMap.niwAssetId || "",
    statementOfCompliance: formDataToMap.statementOfCompliance || "",
    uncertainty: formDataToMap.uncertainty || "",
    inspectionReportNo: formDataToMap.inspectionReportNo || "",
    dateOfInspection: formDataToMap.dateOfInspection || "",
    siteDescription: formDataToMap.siteDescription || "",
    flowmeterLocation: formDataToMap.flowmeterLocation || "",
    wocNumber: formDataToMap.wocNumber || "",
    dryW: formDataToMap.dryW || "",
    maxD: formDataToMap.maxD || "",
    maxFFT: formDataToMap.maxFFT || "",
    qmaxF: formDataToMap.qmaxF || "",
    field1: formDataToMap.field1 || "",
    field2: formDataToMap.field2 || "",
    field3: formDataToMap.field3 || "",
    appendixField1: formDataToMap.appendixField1 || "",
    appendixField2: formDataToMap.appendixField2 || "",
    appendixField3: formDataToMap.appendixField3 || "",
    appendixAFiles: formDataToMap.appendixAFiles || [],
    appendixACaptions: formDataToMap.appendixACaptions || [],
    appendixBFiles: formDataToMap.appendixBFiles || [],
    appendixBCaptions: formDataToMap.appendixBCaptions || [],
    appendixCFiles: formDataToMap.appendixCFiles || [],
    appendixCCaptions: formDataToMap.appendixCCaptions || [],
    signatureIncluded:
      formDataToMap.signatureIncluded !== undefined
        ? formDataToMap.signatureIncluded
        : true,
    signatureName: formDataToMap.signatureName || "Aaron McGilligan",
    signatureCompany:
      formDataToMap.signatureCompany || "SIRIS Flow Inspections Ltd",
  };
};

// Handle input change for form fields
export const handleFormInputChange = (e, currentFormData, setFormData) => {
  const { name, value, files } = e.target;

  if (multipleFileFields.includes(name) && files) {
    const fileArray = Array.from(files);
    setFormData((prev) => ({
      ...prev,
      [name]: fileArray,
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  }
};

// Photo handling functions
export const removePhoto = (section, index, formData, setFormData) => {
  const captionField = imageCaptionFieldBySection[section];
  setFormData((prev) => ({
    ...prev,
    [section]: prev[section].filter((_, i) => i !== index),
    ...(captionField
      ? {
          [captionField]:
            prev[captionField]?.filter((_, i) => i !== index) || [],
        }
      : {}),
  }));
};

export const addPhotos = async (
  section,
  files,
  formData,
  setFormData,
  onProgress = null,
  openEditorCallback = null
) => {
  const fileArray = Array.from(files);
  const captionField = imageCaptionFieldBySection[section];

  // If editor callback is provided, open editor for each image
  if (openEditorCallback) {
    // Process images one by one through the editor
    for (const file of fileArray) {
      await openEditorCallback(file, section);
    }
    return; // Editor will handle compression and adding to form
  }

  // Original flow: direct compression without editor
  try {
    // Show loading state if progress callback is provided
    if (onProgress) {
      onProgress({ status: "compressing", message: "Compressing images..." });
    }

    // Compress images to max 1MB each
    const compressedFiles = await compressImages(fileArray, 1, onProgress);

    setFormData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), ...compressedFiles],
      ...(captionField
        ? {
            [captionField]: [
              ...(prev[captionField] || []),
              ...new Array(compressedFiles.length).fill(""),
            ],
          }
        : {}),
    }));

    // Show completion state if progress callback is provided
    if (onProgress) {
      onProgress({
        status: "completed",
        message: `Successfully compressed and added ${compressedFiles.length} image(s)`,
      });
    }
  } catch (error) {
    console.error("Error compressing images:", error);

    // Fallback to original files if compression fails
    setFormData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), ...fileArray],
      ...(captionField
        ? {
            [captionField]: [
              ...(prev[captionField] || []),
              ...new Array(fileArray.length).fill(""),
            ],
          }
        : {}),
    }));

    if (onProgress) {
      onProgress({
        status: "error",
        message: "Compression failed, using original images",
      });
    }
  }
};

/**
 * Adds a single photo after editing (used by ImageEditorModal)
 * @param {string} section - The form section to add the photo to
 * @param {File} file - The edited image file
 * @param {Object} formData - Current form data
 * @param {Function} setFormData - Form data setter function
 * @param {Function} onProgress - Progress callback function
 */
export const addEditedPhoto = async (
  section,
  file,
  formData,
  setFormData,
  onProgress = null
) => {
  const captionField = imageCaptionFieldBySection[section];
  try {
    // Show loading state if progress callback is provided
    if (onProgress) {
      onProgress({ status: "compressing", message: "Compressing image..." });
    }

    // Compress the edited image to max 1MB
    const compressedFiles = await compressImages([file], 1, onProgress);

    setFormData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), ...compressedFiles],
      ...(captionField
        ? {
            [captionField]: [
              ...(prev[captionField] || []),
              ...new Array(compressedFiles.length).fill(""),
            ],
          }
        : {}),
    }));

    // Show completion state if progress callback is provided
    if (onProgress) {
      onProgress({
        status: "completed",
        message: "Successfully compressed and added image",
      });
    }
  } catch (error) {
    console.error("Error compressing edited image:", error);

    // Fallback to original file if compression fails
    setFormData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), file],
      ...(captionField
        ? {
            [captionField]: [
              ...(prev[captionField] || []),
              ...new Array(1).fill(""),
            ],
          }
        : {}),
    }));

    if (onProgress) {
      onProgress({
        status: "error",
        message: "Compression failed, using original image",
      });
    }
  }
};

// Reset form data to default
export const resetFormData = (setFormData) => {
  setFormData(getDefaultFormData());
};

// Demo Excel upload data mapping
export const getDemoExcelData = () => ({
  consentPermitNo: "CONS-2025-1234",
  flowmeterMakeModel: "FM-Model-X",
  flowmeterSerial: "SN12345, SN12346",
  qmaxF: "1200",
  uncertainty: "±1.2%",
  siteName: "Demo Site from Spreadsheet",
});

// Form sections configuration for UI rendering
export const formSections = [
  {
    id: "reportPreparation",
    title: "Report Preparation Details",
    fields: ["reportPreparedBy", "inspector"],
  },
  {
    id: "consentPermit",
    title: "Consent/Permit Holder & Company Registration",
    fields: ["consentPermitHolder", "consentPermitNo"],
  },
  {
    id: "siteInformation",
    title: "Site Information",
    fields: [
      "siteName",
      "siteContact",
      "siteAddress",
      "siteRefPostcode",
      "irishGridRef",
    ],
  },
  {
    id: "flowmeterInformation",
    title: "Flowmeter Information",
    fields: [
      "flowmeterMakeModel",
      "flowmeterType",
      "flowmeterSerial",
      "niwAssetId",
    ],
  },
  {
    id: "complianceInspection",
    title: "Compliance and Inspection Details",
    fields: [
      "statementOfCompliance",
      "uncertainty",
      "inspectionReportNo",
      "dateOfInspection",
    ],
  },
  {
    id: "siteDescription",
    title: "Site Description and Flowmeter",
    fields: ["siteDescription", "flowmeterLocation"],
  },
  {
    id: "permitLimits",
    title: "Permit Limits",
    fields: ["wocNumber", "dryW", "maxD", "maxFFT", "qmaxF"],
  },
  {
    id: "additionalInformation",
    title: "Additional Information",
    fields: ["field1", "field2", "field3"],
  },
];

// File upload configuration
export const fileUploadConfig = {
  imageTypes: {
    accept: "image/*",
    maxFiles: 5,
    maxSize: 1 * 1024 * 1024, // 1MB (after compression)
    description:
      "Upload multiple images (maximum 5 files). Images will be automatically compressed to max 1MB each. Accepted formats: JPG, PNG, GIF.",
  },
  documentTypes: {
    accept: "image/*,application/pdf",
    maxFiles: 5,
    maxSize: 1 * 1024 * 1024, // 1MB for images (after compression), PDFs unchanged
    description:
      "Upload multiple files (maximum 5 files). Images will be automatically compressed to max 1MB each. Accepted formats: JPG, PNG, PDF.",
  },
  excelTypes: {
    accept: ".xlsx,.xls,.csv",
    maxSize: 2 * 1024 * 1024, // 2MB
    description: "Upload Excel file for data import",
  },
};

const formModel = {
  getDefaultFormData,
  formValidationRules,
  dropdownOptions,
  multipleFileFields,
  imageCaptionFieldBySection,
  validateForm,
  mapFormDataFromAPI,
  handleFormInputChange,
  removePhoto,
  addPhotos,
  addEditedPhoto,
  resetFormData,
  getDemoExcelData,
  formSections,
  fileUploadConfig,
};

export default formModel;
