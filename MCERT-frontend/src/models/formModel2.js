/**
 * Form Model for MCERTS Flow Inspection Forms
 * Contains form data structure, validation, and utility functions
 *
 * DATA SOURCE LEGEND:
 * - Fixed: Field has a fixed default value that cannot be changed
 * - Dropdown Menu: Field value is selected from a predefined dropdown list
 * - Input Data [CELL]: Field value is extracted from Excel file at specified cell (e.g., D4, I10, F104)
 * - Manually Entered: Field value must be entered manually by the user
 * - Manual or From DB: Field can be entered manually or loaded from database
 */

import { compressImages } from "../utils/imageCompression";

// Default form data structure
export const getDefaultFormData = () => ({
  // ============================================
  // REPORT PREPARATION DETAILS
  // ============================================

  // Report prepared by: Fixed (Default: "Siris Flow Inspections Ltd")
  reportPreparedBy: "Siris Flow Inspections Ltd",

  // Inspector: Dropdown Menu
  inspector: "",

  // ============================================
  // CONSENT/PERMIT HOLDER & COMPANY REGISTRATION
  // ============================================

  // Consent/Permit Holder: Dropdown Menu
  consentPermitHolder: "",

  // Consent/Permit No: Input Data D4 (from Excel - same cell as siteName, parsed separately)
  consentPermitNo: "",

  // ============================================
  // SITE INFORMATION
  // ============================================

  // Site Name: Input Data D4 (from Excel)
  siteName: "",

  // Site Contact: Dropdown Menu
  siteContact: "",

  // Site Address: Manually Entered or From DB
  siteAddress: "",

  // Site Ref or Postcode: Manual or From DB
  siteRefPostcode: "",

  // Irish Grid ref for Site Entrance: Manual or From DB
  irishGridRef: "",

  aerialViewFile: null,

  // References & Definitions section
  references: [
    "Minimum requirements for the self-monitoring of flow",
    "BS EN ISO 20456: 2019 Measurement of fluid flow in closed conduits",
    "SIRIS Excel site data spreadsheet – relevant flow meter",
  ],

  // Aerial view & general arrangement section (Integrity of flow monitoring 2.2)
  aerialViewDescription:
    "The Final Effluent thin plate V-notch weir and associated flow meter are situated downstream of the treatment process and are correctly located to ensure representative measurement of the total daily volume of treated effluent being discharged to the watercourse. There is no double counting or undercounting of flows at this location. There is a drain down valve on the carrier plate for the V-notch weir. At the time of the inspection the valve was 100% closed and is to remain closed at all times. Use of the drain down valves should be covered in the quality documentation.",
  aerialViewImages: [],
  aerialViewCaptions: [],

  // ============================================
  // FLOWMETER INFORMATION
  // ============================================

  flowmeterMakeModel: "",
  flowmeterType: "",
  flowmeterSerial: "",

  // Type of Flowmeter(s): Input Data I10 & I11 (from Excel, combined)
  // Note: This maps to secondaryDeviceType in Form2
  // Example: "Siemens Hydroranger LT500" (combined from I10 and I11)
  secondaryDeviceType: "Siemens Hydroranger LT500",

  // Serial number(s) of Flowmeter(s) - Transmitter: Input Data I13 (from Excel)
  // Example: "PBD-S7086053"
  flowmeterTransmitterSerial: "",

  // Serial number(s) of Flowmeter(s) - Sensor: Input Data I12 (from Excel)
  // Example: "YSN/MN138215937"
  flowmeterSensorSerial: "",

  // NIW Asset ID: Manual or from DB
  niwAssetId: "",

  // ============================================
  // COMPLIANCE AND INSPECTION DETAILS
  // ============================================

  // Statement of Compliance: Fixed (Default text)
  // Example: "The flow monitoring arrangements meet the requirements of the Environment Agency's "Minimum requirements for the self-monitoring of flow."
  statementOfCompliance:
    'The flow monitoring arrangements meet the requirements of the Environment Agency\'s "Minimum requirements for the self-monitoring of flow."',

  // Uncertainty: Uncertainty Sheet F104 (from Excel)
  // Example: "± 3.03 %"
  uncertainty: "",

  // Inspection report No: Manually Entered
  inspectionReportNo: "",

  // Date of Inspection: Manually Entered
  dateOfInspection: "",

  siteDescription: "",
  flowmeterLocation: "",

  // MCERTS Certification
  mcertProductCertified: "Yes- The flow meter is MCert product approved",
  mcertCertificateNo: "",
  mcertCertificationDate: "",

  // Primary Device Details
  primaryDeviceType: "Final effluent thin plate V-notch weir",
  primaryDeviceDescription:
    "There is a final effluent thin plate V-notch weir installation used to monitor treated effluent being discharged from site. The flow measurement primary device is located downstream of treatment. The weir chamber meets the dimensional requirements of BS ISO 1438:2008. The V-Notch weir plate has a 2mm width profile, which is correctly machined and is manufactured from stainless steel. The weir plate is in good condition. Flow is free discharging and fully ventilated. The weir plate is firmly secured and provides a watertight seal across the chamber. Flow within the approach channel is uniform and steady with no visible hydraulic disturbances.",
  primaryDeviceCompliance: "BS ISO 1438:2008",
  primaryDeviceImages: [],
  primaryDeviceCaptions: [],

  // Secondary Device Details
  secondaryDeviceDescription: "",
  secondaryDeviceTransmitter: "",
  secondaryDeviceSensor: "XRS-5 ultra-sonic sensor",
  secondaryDeviceCompliance: "BS/ISO calculations",
  secondaryDeviceImages: [],
  secondaryDeviceCaptions: [],

  // Flow Meter Verification
  verificationDescription: "",
  verificationCalibrationReference: "",
  verificationPlateMeasurement: "",
  verificationInstrumentDisplay: "",
  verificationHeadError: "",
  verificationRepeatabilityError: "",
  verificationCurvePointCheck: "",
  verificationImages: [],
  verificationCaptions: [],

  // Telemetry Check
  telemetryCheck: "",
  telemetryUncertainty: "",

  // NIEA Viewpoint
  nieaViewpointDescription:
    "The flow meters display forms the NIEA viewpoint and there is no secondary flow display. The flow meter display provides instantaneous flow in (L/s) litres per second. The flow meter has a new MCERTS sticker.",
  nieaInstantaneousFlow: "",
  nieaPeriodTotal: "",
  nieaSecondaryDisplay: "No",
  nieaMcertSticker: "New MCERTS sticker",
  nieaImages: [],
  nieaCaptions: [],

  // Maintenance & Calibration 4.0
  routineMaintenanceDescription:
    'NIW operational personnel record maintenance activities in "Tough Books" this information is subsequently uploaded to NIW central database. At the time of the inspection the weir and channel were clean and free from significant fouling. Maintenance appears satisfactory.',
  routineMaintenanceImages: [],
  routineMaintenanceCaptions: [],
  routineVerificationDescription:
    "The flow sensor has a fixed calibration bracket for a removable reference plate. NIW have an annual flow validation programme. A routine flow validation is due on or before the date shown below. Date of Inspection: + 1 year. Labelling has been affixed to the flow installation, displaying critical data and calibration details.",
  routineVerificationImages: [],
  routineVerificationCaptions: [],
  nextFlowValidationDate: "",

  // Critical Data Stickers
  criticalDataStickerImages: [],
  criticalDataStickerCaptions: [],

  // Survey Equipment Table
  surveyEquipmentTable: [],

  // Conclusion section 6.0 - simplified to two fields
  conclusionUncertaintySheetF2: "", // Date from Uncertainty Sheet F2
  conclusionUncertaintySheetF104: "", // Uncertainty from Uncertainty Sheet F104

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
    'NIW operational personnel record maintenance activities in "Tough Books" this information is Subsequently uploaded to NIW central database. At the time of the inspection the weir and channel were clean and free from significant fouling. Maintenance appears satisfactory.',

  // Site process & schematic diagram 2.1
  siteProcessDescription:
    "Flows enter the works via gravity, undergoing screening and grit removal. This is followed by passage through a greater than Formula A overspill weir. Flows are quantified by an FFT rectangular flume flow measurement system. After initial measurement, flows proceed through primary settlement and aerated reed beds. Treated water is discharged under gravity to the watercourse through a Final Effluent thin plate V-notch weir flow measurement system. Any storm water that spills from the Formula A overspill weir is directed directly to the watercourse, indicating no storm storage on site. Sludge generated from the treatment process is tankered from site. Return liquors and site drainage are recycled back into the treatment process. Wash water used on site is Final Effluent, which is drawn upstream from the Final Effluent flow measurement system. The Final Effluent V-Notch weir & associated flow meter display are used to certify the works under NIW's FComp scheme.",
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

  // Survey measurement equipment 5.0
  surveyEquipmentDescription:
    "The following is a list of equipment taken to each inspection.",
  surveyEquipmentImages: [],
  surveyEquipmentCaptions: [],

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
    "Northern Ireland Water",
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
    "Northern Ireland Water",
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
  "primaryDeviceImages",
  "secondaryDeviceImages",
  "verificationImages",
  "nieaImages",
  "routineMaintenanceImages",
  "routineVerificationImages",
  "appendixAFiles",
  "appendixBFiles",
  "appendixCFiles",
  "criticalDataStickerImages",
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
  primaryDeviceImages: "primaryDeviceCaptions",
  secondaryDeviceImages: "secondaryDeviceCaptions",
  verificationImages: "verificationCaptions",
  nieaImages: "nieaCaptions",
  routineMaintenanceImages: "routineMaintenanceCaptions",
  routineVerificationImages: "routineVerificationCaptions",
  criticalDataStickerImages: "criticalDataStickerCaptions",
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
    flowmeterMakeModel: formDataToMap.flowmeterMakeModel || "",
    flowmeterType: formDataToMap.flowmeterType || "",
    flowmeterSerial: formDataToMap.flowmeterSerial || "",
    flowmeterTransmitterSerial: formDataToMap.flowmeterTransmitterSerial || "",
    flowmeterSensorSerial: formDataToMap.flowmeterSensorSerial || "",
    niwAssetId: formDataToMap.niwAssetId || "",
    statementOfCompliance:
      formDataToMap.statementOfCompliance ||
      'The flow monitoring arrangements meet the requirements of the Environment Agency\'s "Minimum requirements for the self-monitoring of flow."',
    uncertainty: formDataToMap.uncertainty || "",
    inspectionReportNo: formDataToMap.inspectionReportNo || "",
    dateOfInspection: formDataToMap.dateOfInspection || "",
    siteDescription: formDataToMap.siteDescription || "",
    flowmeterLocation: formDataToMap.flowmeterLocation || "",
    // MCERTS Certification
    mcertProductCertified:
      formDataToMap.mcertProductCertified ||
      "yes the flow meter is MCert product approved",
    mcertCertificateNo: formDataToMap.mcertCertificateNo || "",
    mcertCertificationDate: formDataToMap.mcertCertificationDate || "",
    // Primary Device
    primaryDeviceType: formDataToMap.primaryDeviceType || "",
    primaryDeviceDescription: formDataToMap.primaryDeviceDescription || "",
    primaryDeviceCompliance: formDataToMap.primaryDeviceCompliance || "",
    primaryDeviceImages: formDataToMap.primaryDeviceImages || [],
    primaryDeviceCaptions: formDataToMap.primaryDeviceCaptions || [],
    // Secondary Device
    secondaryDeviceDescription: formDataToMap.secondaryDeviceDescription || "",
    secondaryDeviceType: formDataToMap.secondaryDeviceType || "",
    secondaryDeviceTransmitter: formDataToMap.secondaryDeviceTransmitter || "",
    secondaryDeviceSensor: formDataToMap.secondaryDeviceSensor || "",
    secondaryDeviceCompliance: formDataToMap.secondaryDeviceCompliance || "",
    secondaryDeviceImages: formDataToMap.secondaryDeviceImages || [],
    secondaryDeviceCaptions: formDataToMap.secondaryDeviceCaptions || [],
    // Verification
    verificationDescription: formDataToMap.verificationDescription || "",
    verificationCalibrationReference:
      formDataToMap.verificationCalibrationReference || "",
    verificationPlateMeasurement:
      formDataToMap.verificationPlateMeasurement || "",
    verificationInstrumentDisplay:
      formDataToMap.verificationInstrumentDisplay || "",
    verificationHeadError: formDataToMap.verificationHeadError || "",
    verificationRepeatabilityError:
      formDataToMap.verificationRepeatabilityError || "",
    verificationCurvePointCheck:
      formDataToMap.verificationCurvePointCheck || "",
    verificationImages: formDataToMap.verificationImages || [],
    verificationCaptions: formDataToMap.verificationCaptions || [],
    // Telemetry
    telemetryCheck: formDataToMap.telemetryCheck || "",
    telemetryUncertainty: formDataToMap.telemetryUncertainty || "",
    // NIEA
    nieaDescription:
      formDataToMap.nieaDescription ||
      formDataToMap.nieaViewpointDescription ||
      "",
    nieaViewpointDescription:
      formDataToMap.nieaViewpointDescription ||
      formDataToMap.nieaDescription ||
      "",
    nieaInstantaneousFlow: formDataToMap.nieaInstantaneousFlow || "",
    nieaPeriodTotal: formDataToMap.nieaPeriodTotal || "",
    nieaSecondaryDisplay: formDataToMap.nieaSecondaryDisplay || "",
    nieaMcertSticker: formDataToMap.nieaMcertSticker || "",
    nieaImages: formDataToMap.nieaImages || [],
    nieaCaptions: formDataToMap.nieaCaptions || [],
    // Maintenance & Calibration 4.0
    routineMaintenanceDescription:
      formDataToMap.routineMaintenanceDescription || "",
    routineMaintenanceImages: formDataToMap.routineMaintenanceImages || [],
    routineMaintenanceCaptions: formDataToMap.routineMaintenanceCaptions || [],
    routineVerificationDescription:
      formDataToMap.routineVerificationDescription || "",
    routineVerificationImages: formDataToMap.routineVerificationImages || [],
    routineVerificationCaptions:
      formDataToMap.routineVerificationCaptions || [],
    nextFlowValidationDate: formDataToMap.nextFlowValidationDate || "",
    // Critical Data Stickers
    criticalDataStickerImages: formDataToMap.criticalDataStickerImages || [],
    criticalDataStickerCaptions:
      formDataToMap.criticalDataStickerCaptions || [],
    // Survey Equipment
    surveyEquipmentTable: formDataToMap.surveyEquipmentTable || [],
    // Conclusion section 6.0 - simplified to two fields
    conclusionUncertaintySheetF2:
      formDataToMap.conclusionUncertaintySheetF2 || "",
    conclusionUncertaintySheetF104:
      formDataToMap.conclusionUncertaintySheetF104 || "",
    wocNumber: formDataToMap.wocNumber || "",
    dryW: formDataToMap.dryW || "",
    maxD: formDataToMap.maxD || "",
    maxFFT: formDataToMap.maxFFT || "",
    qmaxF: formDataToMap.qmaxF || "",
    // Permanent fields - preserve defaults if not in API data
    field1:
      formDataToMap.field1 || "Secondary verification successfully undertaken.",
    field2:
      formDataToMap.field2 || "Yes- The flow meter is MCert product approved.",
    field3:
      formDataToMap.field3 ||
      'NIW operational personnel record maintenance activities in "Tough Books" this information is Subsequently uploaded to NIW central database. At the time of the inspection the weir and channel were clean and free from significant fouling. Maintenance appears satisfactory.',
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
