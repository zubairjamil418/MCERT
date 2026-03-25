import React from "react";

// Simple Button component
const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

const FormModal2 = ({
  isOpen,
  editingFormId,
  handleExcelUpload,
  closeModal,
  compressionStatus,
  compressionProgress,
  handleSubmitForm,
  formData,
  handleInputChangeWithBackgroundUpdate,
  setFormData,
  inspectors,
  defaultOptions,
  isInspectorDropdownOpen,
  setIsInspectorDropdownOpen,
  handleDeleteDropdownOption,
  openModal,
  CustomDropdown,
  consentList,
  isConsentDropdownOpen,
  setIsConsentDropdownOpen,
  siteContacts,
  isSiteContactDropdownOpen,
  setIsSiteContactDropdownOpen,
  setModalTarget,
  setModalValue,
  setShowModal,
  handleAddPhotos,
  handleRemovePhoto,
  handleImageCaptionChange,
  flowTypes,
  isFlowTypeDropdownOpen,
  setIsFlowTypeDropdownOpen,
  signatureIncluded,
  setSignatureIncluded,
  handleGenerateReport,
  isCreatingForm,
  isGenerating,
  getImagePreview,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/50 p-4">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-lg bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Flow Inspection Form 2 — {editingFormId ? "Edit" : "New Entry"}
          </h2>
          <div className="flex gap-2">
            <label className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleExcelUpload}
                className="hidden"
              />
              📄 Upload Excel File
            </label>
            <Button
              onClick={closeModal}
              className="rounded-md bg-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-300"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Compression Status */}
        {compressionStatus && (
          <div
            className={`mb-4 rounded-lg p-4 ${
              compressionStatus === "compressing"
                ? "border border-blue-200 bg-blue-50"
                : compressionStatus === "completed"
                ? "border border-green-200 bg-green-50"
                : compressionStatus === "error"
                ? "border border-red-200 bg-red-50"
                : ""
            }`}
          >
            <div className="flex items-center space-x-2">
              {compressionStatus === "compressing" && (
                <svg
                  className="h-4 w-4 animate-spin text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {compressionStatus === "completed" && (
                <svg
                  className="h-4 w-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              )}
              {compressionStatus === "error" && (
                <svg
                  className="h-4 w-4 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              )}
              <span
                className={`text-sm font-medium ${
                  compressionStatus === "compressing"
                    ? "text-blue-700"
                    : compressionStatus === "completed"
                    ? "text-green-700"
                    : compressionStatus === "error"
                    ? "text-red-700"
                    : ""
                }`}
              >
                {compressionStatus === "compressing" && "Compressing images..."}
                {compressionStatus === "completed" &&
                  "Images compressed successfully!"}
                {compressionStatus === "error" &&
                  "Compression failed, using original images"}
              </span>
            </div>
            {compressionProgress && (
              <div className="mt-2 text-xs text-gray-600">
                <div>Processing: {compressionProgress.fileName}</div>
                <div>
                  Progress: {compressionProgress.current}/
                  {compressionProgress.total}
                </div>
                {compressionProgress.originalSize &&
                  compressionProgress.compressedSize && (
                    <div>
                      Size reduced by {compressionProgress.compressionRatio}% (
                      {(compressionProgress.originalSize / 1024 / 1024).toFixed(
                        1
                      )}
                      MB →{" "}
                      {(
                        compressionProgress.compressedSize /
                        1024 /
                        1024
                      ).toFixed(1)}
                      MB)
                    </div>
                  )}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmitForm} className="space-y-6">
          {/* Report Preparation Details */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Report Preparation Details
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Report prepared by
                </label>
                <input
                  type="text"
                  name="reportPreparedBy"
                  value={formData.reportPreparedBy}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Siris Flow Inspections Ltd"
                />
                <div className="mt-1 text-xs text-gray-500">
                  Default: Siris Flow Inspections Ltd
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-600">
                    Inspector
                  </label>
                </div>
                <div className="flex gap-2">
                  <CustomDropdown
                    value={formData.inspector}
                    onChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        inspector: value,
                      }));
                    }}
                    options={inspectors}
                    defaultOptions={defaultOptions.inspectors}
                    placeholder="Select Inspector"
                    isOpen={isInspectorDropdownOpen}
                    setIsOpen={setIsInspectorDropdownOpen}
                    onDelete={(value) =>
                      handleDeleteDropdownOption("inspector", value)
                    }
                    onAdd={() => openModal("inspector")}
                    addButtonTitle="Add new inspector"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => openModal("inspector")}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                    title="Add new inspector"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Consent/Permit & Inspection Details */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Consent/Permit & Inspection Details
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Consent/Permit Holder
                </label>
                <div className="flex gap-2">
                  <CustomDropdown
                    value={formData.consentPermitHolder}
                    onChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        consentPermitHolder: value,
                      }));
                    }}
                    options={consentList}
                    defaultOptions={defaultOptions.consentList}
                    placeholder="Select consent/permit holder"
                    isOpen={isConsentDropdownOpen}
                    setIsOpen={setIsConsentDropdownOpen}
                    onDelete={(value) =>
                      handleDeleteDropdownOption("consentPermitHolder", value)
                    }
                    onAdd={() => openModal("consentPermitHolder")}
                    addButtonTitle="Add new consent/permit holder"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => openModal("consentPermitHolder")}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                    title="Add new consent/permit holder"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Consent/Permit No
                </label>
                <input
                  type="text"
                  name="consentPermitNo"
                  value={formData.consentPermitNo}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter consent/permit number"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Inspection report No
                </label>
                <input
                  type="text"
                  name="inspectionReportNo"
                  value={formData.inspectionReportNo}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter inspection report number"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Date of Inspection
                </label>
                <input
                  type="date"
                  name="dateOfInspection"
                  value={formData.dateOfInspection}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Statement of Compliance
                </label>
                <input
                  type="text"
                  name="statementOfCompliance"
                  value={formData.statementOfCompliance}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Statement of compliance"
                />
                <div className="mt-1 text-xs text-gray-500">
                  editable - saved to local storage
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Uncertainty
                </label>
                <input
                  type="text"
                  name="uncertainty"
                  value={formData.uncertainty}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., ±3.03% (from Uncertainty Sheet F104)"
                />
              </div>
            </div>
          </div>

          {/* Site Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Site Information
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Site Name
                </label>
                <input
                  type="text"
                  name="siteName"
                  value={formData.siteName}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="linked to spreadsheet / DB (demo)"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Site Contact
                </label>
                <CustomDropdown
                  value={formData.siteContact}
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      siteContact: value,
                    }));
                  }}
                  options={siteContacts}
                  defaultOptions={defaultOptions.siteContacts}
                  placeholder="Select site contact"
                  isOpen={isSiteContactDropdownOpen}
                  setIsOpen={setIsSiteContactDropdownOpen}
                  onDelete={(value) =>
                    handleDeleteDropdownOption("siteContact", value)
                  }
                  onAdd={() => {
                    setModalTarget("siteContact");
                    setModalValue("");
                    setShowModal(true);
                  }}
                  addButtonTitle="Add new site contact"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Site Address
                </label>
                <textarea
                  name="siteAddress"
                  value={formData.siteAddress}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  rows="3"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="text field"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Site Ref or Postcode
                </label>
                <input
                  type="text"
                  name="siteRefPostcode"
                  value={formData.siteRefPostcode}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Irish Grid ref for Site Entrance
                </label>
                <input
                  type="text"
                  name="irishGridRef"
                  value={formData.irishGridRef}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Flowmeter Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Flowmeter Information
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Type of Flowmeter(s){" "}
                  <span className="text-xs text-gray-500">
                    (Input Data I10 & I11)
                  </span>
                </label>
                <input
                  type="text"
                  name="secondaryDeviceType"
                  value={formData.secondaryDeviceType}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., Siemens Hydroranger LT500 (from Excel I10 & I11)"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Serial number(s) of Flowmeter(s) - Sensor{" "}
                  <span className="text-xs text-gray-500">
                    (Input Data I12)
                  </span>
                </label>
                <input
                  type="text"
                  name="flowmeterSensorSerial"
                  value={formData.flowmeterSensorSerial}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., YSN/MN138215937 (from Excel I12)"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Serial number(s) of Flowmeter(s) - Transmitter{" "}
                  <span className="text-xs text-gray-500">
                    (Input Data I13)
                  </span>
                </label>
                <input
                  type="text"
                  name="flowmeterTransmitterSerial"
                  value={formData.flowmeterTransmitterSerial}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., PBD-S7086053 (from Excel I13)"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  NIW Asset ID{" "}
                  <span className="text-xs text-gray-500">
                    (Manual or from DB)
                  </span>
                </label>
                <input
                  type="text"
                  name="niwAssetId"
                  value={formData.niwAssetId}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., 0324638 (manually enter or from DB)"
                />
              </div>
            </div>
          </div>

          {/* Site Description and Flowmeter */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Site Description and Flowmeter
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Site description
                </label>
                <textarea
                  name="siteDescription"
                  value={formData.siteDescription}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  rows="4"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="manually entered"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Location of flowmeter(s)
                </label>
                <textarea
                  name="flowmeterLocation"
                  value={formData.flowmeterLocation}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  rows="4"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="manually entered"
                />
              </div>
            </div>
          </div>

          {/* Emission Points Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Emission Point(s) Requiring Flow Measurement
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Left Column - Emission Point Name */}
              <div className="space-y-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Emission Point Name{" "}
                    <span className="text-xs text-gray-500">
                      (From Input Data D4)
                    </span>
                  </label>
                  <div className="rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-800">
                    {formData.siteName || "Site Name"}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Information provided by NIW.
                </div>
              </div>

              {/* Right Column - Flow Measurement Parameters */}
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    WOC number{" "}
                    <span className="text-xs text-gray-500">
                      (Input Data C5)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="wocNumber"
                    value={formData.wocNumber || ""}
                    onChange={handleInputChangeWithBackgroundUpdate}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., 6033/2007 (from Excel C5)"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Dry weather flow{" "}
                    <span className="text-xs text-gray-500">
                      (Input Data H6)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="dryW"
                    value={formData.dryW}
                    onChange={handleInputChangeWithBackgroundUpdate}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., 211 m³/day (from Excel H6)"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Maximum daily volume{" "}
                    <span className="text-xs text-gray-500">
                      (Input Data D6)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="maxD"
                    value={formData.maxD}
                    onChange={handleInputChangeWithBackgroundUpdate}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., 211 m³/day (from Excel D6)"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Maximum FFT flow rate{" "}
                    <span className="text-xs text-gray-500">
                      (Input Data I5)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="maxFFT"
                    value={formData.maxFFT}
                    onChange={handleInputChangeWithBackgroundUpdate}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., 2.44 l/s (from Excel I5)"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Qmax of flowmeter{" "}
                    <span className="text-xs text-gray-500">
                      (Input Data I4)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="qmaxF"
                    value={formData.qmaxF}
                    onChange={handleInputChangeWithBackgroundUpdate}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g., 10.00 l/s (from Excel I4)"
                  />
                </div>
                <div className="mt-2 text-xs italic text-gray-500">
                  All from Input Data
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Method of secondary verification
                </label>
                <input
                  type="text"
                  name="field1"
                  value={formData.field1}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Secondary verification details"
                />
                <div className="mt-1 text-xs text-gray-500">
                  editable - saved to local storage
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  MCERTS product certification (Cert No & range)
                </label>
                <input
                  type="text"
                  name="field2"
                  value={formData.field2}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="MCERTS certification details"
                />
                <div className="mt-1 text-xs text-gray-500">
                  editable - saved to local storage
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Site maintenance arrangements
                </label>
                <textarea
                  name="field3"
                  value={formData.field3}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  rows="3"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Site maintenance arrangements"
                />
                <div className="mt-1 text-xs text-gray-500">
                  editable - saved to local storage
                </div>
              </div>
            </div>
          </div>

          {/* References & Definitions */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              References & Definitions 1.0
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  References
                </label>
                <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  {formData.references &&
                    formData.references.map((reference, index) => (
                      <div
                        key={index}
                        className="group flex items-start justify-between space-x-2"
                      >
                        <div className="flex flex-1 items-start space-x-2">
                          <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-gray-600"></span>
                          <span className="text-sm text-gray-700">
                            {reference}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newReferences = formData.references.filter(
                              (_, i) => i !== index
                            );
                            setFormData((prev) => ({
                              ...prev,
                              references: newReferences,
                            }));
                          }}
                          className="ml-2 rounded-full bg-red-100 p-1 text-red-600 opacity-0 transition-opacity hover:bg-red-200 group-hover:opacity-100"
                          title={`Delete reference`}
                        >
                          <svg
                            className="h-3 w-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  <div className="border-t border-gray-200 pt-2">
                    <button
                      type="button"
                      onClick={() => openModal("references")}
                      className="flex w-full items-center justify-center rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100"
                      title="Add new reference"
                    >
                      <svg
                        className="mr-1 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add New Reference
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Site review 2.0 */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Site review 2.0
            </h2>

            {/* Site process & schematic diagram 2.1 */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 text-lg font-semibold text-gray-800">
                Site process & schematic diagram 2.1
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <textarea
                    name="siteProcessDescription"
                    value={formData.siteProcessDescription}
                    onChange={handleInputChangeWithBackgroundUpdate}
                    rows="4"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Flows enter the works via gravity, undergoing screening and grit removal. This is followed by passage through a greater than Formula A overspill weir. Flows are quantified by an FFT rectangular flume flow measurement system. After initial measurement, flows proceed through primary settlement and aerated reed beds. Treated water is discharged under gravity to the watercourse through a Final Effluent thin plate V-notch weir flow measurement system. Any storm water that spills from the Formula A overspill weir is directed directly to the watercourse, indicating no storm storage on site. Sludge generated from the treatment process is tankered from site. Return liquors and site drainage are recycled back into the treatment process. Wash water used on site is Final Effluent, which is drawn upstream from the Final Effluent flow measurement system. The Final Effluent V-Notch weir & associated flow meter display are used to certify the works under NIW's FComp scheme."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Upload Multiple Images
                  </label>
                  <input
                    type="file"
                    name="siteProcessImages"
                    onChange={(e) =>
                      handleAddPhotos("siteProcessImages", e.target.files)
                    }
                    accept="image/*"
                    multiple
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Upload multiple site process and schematic images (maximum 5
                    files). Images will be automatically compressed to max 1MB
                    each.
                  </div>

                  {formData.siteProcessImages &&
                    formData.siteProcessImages.length > 0 && (
                      <div className="mt-3">
                        <div className="mb-2 text-sm font-medium text-gray-700">
                          Selected files ({formData.siteProcessImages.length}
                          /5):
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {formData.siteProcessImages.map((file, index) => {
                            const previewUrl = getImagePreview(file);
                            return (
                              <div
                                key={index}
                                className="relative rounded-lg border border-gray-200 bg-white p-2 shadow-sm"
                              >
                                {previewUrl && (
                                  <div className="mb-2">
                                    <img
                                      src={previewUrl}
                                      alt={`Preview ${index + 1}`}
                                      className="h-24 w-full rounded object-cover"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                      }}
                                    />
                                  </div>
                                )}
                                <div className="flex items-center space-x-2 text-sm text-green-600">
                                  <svg
                                    className="h-4 w-4 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="flex-1 truncate text-xs">
                                    {file.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  value={
                                    formData.siteProcessCaptions?.[index] || ""
                                  }
                                  onChange={(e) =>
                                    handleImageCaptionChange(
                                      "siteProcessImages",
                                      index,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Add caption"
                                  className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemovePhoto(
                                      "siteProcessImages",
                                      index
                                    )
                                  }
                                  className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                  title="Remove image"
                                >
                                  <svg
                                    className="h-3 w-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Integrity of flow monitoring 2.2 */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 text-lg font-semibold text-gray-800">
                Integrity of flow monitoring 2.2
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <textarea
                    name="aerialViewDescription"
                    value={formData.aerialViewDescription}
                    onChange={handleInputChangeWithBackgroundUpdate}
                    rows="4"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="The Final Effluent thin plate V-notch weir and associated flow meter are situated downstream of the treatment process and are correctly located to ensure representative measurement of the total daily volume of treated effluent being discharged to the watercourse. There is no double counting or undercounting of flows at this location. There is a drain down valve on the carrier plate for the V-notch weir. At the time of the inspection the valve was 100% closed and is to remain closed at all times. Use of the drain down valves should be covered in the quality documentation."
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-600">
                    Aerial view of site
                  </label>
                  <input
                    type="file"
                    name="aerialViewImages"
                    onChange={(e) =>
                      handleAddPhotos("aerialViewImages", e.target.files)
                    }
                    accept="image/*"
                    multiple
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Upload multiple aerial view images (maximum 5 files). Images
                    will be automatically compressed to max 1MB each. Accepted
                    formats: JPG, PNG, GIF.
                  </div>

                  {formData.aerialViewImages &&
                    formData.aerialViewImages.length > 0 && (
                      <div className="mt-3">
                        <div className="mb-2 text-sm font-medium text-gray-700">
                          Selected files ({formData.aerialViewImages.length}/5):
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {formData.aerialViewImages.map((file, index) => {
                            const previewUrl = getImagePreview(file);
                            return (
                              <div
                                key={index}
                                className="relative rounded-lg border border-gray-200 bg-white p-2 shadow-sm"
                              >
                                {previewUrl && (
                                  <div className="mb-2">
                                    <img
                                      src={previewUrl}
                                      alt={`Preview ${index + 1}`}
                                      className="h-24 w-full rounded object-cover"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                      }}
                                    />
                                  </div>
                                )}
                                <div className="flex items-center space-x-2 text-sm text-green-600">
                                  <svg
                                    className="h-4 w-4 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="flex-1 truncate text-xs">
                                    {file.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  value={
                                    formData.aerialViewCaptions?.[index] || ""
                                  }
                                  onChange={(e) =>
                                    handleImageCaptionChange(
                                      "aerialViewImages",
                                      index,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Add caption"
                                  className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemovePhoto("aerialViewImages", index)
                                  }
                                  className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                  title="Remove image"
                                >
                                  <svg
                                    className="h-3 w-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Site inspection of flow monitoring system 3.0 */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Site inspection of flow monitoring system 3.0
            </h2>

            {/* Primary device (Flow meter sensor) 3.1 */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 text-lg font-semibold text-gray-800">
                Primary device (Flow meter sensor) 3.1
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <textarea
                    name="primaryDeviceDescription"
                    value={formData.primaryDeviceDescription}
                    onChange={handleInputChangeWithBackgroundUpdate}
                    rows="4"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter description for the primary device..."
                  />
                </div>

                {/* Image Upload for Primary Device */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Upload Multiple Images
                  </label>
                  <input
                    type="file"
                    name="primaryDeviceImages"
                    onChange={(e) =>
                      handleAddPhotos("primaryDeviceImages", e.target.files)
                    }
                    accept="image/*"
                    multiple
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Upload multiple primary device images (maximum 5 files).
                    Images will be automatically compressed to max 1MB each.
                  </div>
                  {formData.primaryDeviceImages &&
                    formData.primaryDeviceImages.length > 0 && (
                      <div className="mt-3">
                        <div className="mb-2 text-sm font-medium text-gray-700">
                          Selected files ({formData.primaryDeviceImages.length}
                          /5):
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {formData.primaryDeviceImages.map((file, index) => {
                            const previewUrl = getImagePreview(file);
                            return (
                              <div
                                key={index}
                                className="relative rounded-lg border border-gray-200 bg-white p-2 shadow-sm"
                              >
                                {previewUrl && (
                                  <div className="mb-2">
                                    <img
                                      src={previewUrl}
                                      alt={`Preview ${index + 1}`}
                                      className="h-24 w-full rounded object-cover"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                      }}
                                    />
                                  </div>
                                )}
                                <div className="flex items-center space-x-2 text-sm text-green-600">
                                  <span className="flex-1 truncate text-xs">
                                    {file.name}
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  value={
                                    formData.primaryDeviceCaptions?.[index] ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleImageCaptionChange(
                                      "primaryDeviceImages",
                                      index,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Add caption"
                                  className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemovePhoto(
                                      "primaryDeviceImages",
                                      index
                                    )
                                  }
                                  className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                  title="Remove image"
                                >
                                  <svg
                                    className="h-3 w-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Secondary device (Flow meter transmitter) 3.2 */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 text-lg font-semibold text-gray-800">
                Secondary device (Flow meter transmitter) 3.2
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <textarea
                    name="secondaryDeviceDescription"
                    value={formData.secondaryDeviceDescription}
                    onChange={handleInputChangeWithBackgroundUpdate}
                    rows="4"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter description for the secondary device..."
                  />
                </div>

                {/* Image Upload for Secondary Device */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Upload Multiple Images
                  </label>
                  <input
                    type="file"
                    name="secondaryDeviceImages"
                    onChange={(e) =>
                      handleAddPhotos("secondaryDeviceImages", e.target.files)
                    }
                    accept="image/*"
                    multiple
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Upload multiple secondary device images (maximum 5 files).
                    Images will be automatically compressed to max 1MB each.
                  </div>
                  {formData.secondaryDeviceImages &&
                    formData.secondaryDeviceImages.length > 0 && (
                      <div className="mt-3">
                        <div className="mb-2 text-sm font-medium text-gray-700">
                          Selected files (
                          {formData.secondaryDeviceImages.length}
                          /5):
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {formData.secondaryDeviceImages.map((file, index) => {
                            const previewUrl = getImagePreview(file);
                            return (
                              <div
                                key={index}
                                className="relative rounded-lg border border-gray-200 bg-white p-2 shadow-sm"
                              >
                                {previewUrl && (
                                  <div className="mb-2">
                                    <img
                                      src={previewUrl}
                                      alt={`Preview ${index + 1}`}
                                      className="h-24 w-full rounded object-cover"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                      }}
                                    />
                                  </div>
                                )}
                                <div className="flex items-center space-x-2 text-sm text-green-600">
                                  <span className="flex-1 truncate text-xs">
                                    {file.name}
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  value={
                                    formData.secondaryDeviceCaptions?.[index] ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleImageCaptionChange(
                                      "secondaryDeviceImages",
                                      index,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Add caption"
                                  className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemovePhoto(
                                      "secondaryDeviceImages",
                                      index
                                    )
                                  }
                                  className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                  title="Remove image"
                                >
                                  <svg
                                    className="h-3 w-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Flow Meter Verification 3.3 */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 text-lg font-semibold text-gray-800">
                Flow Meter Verification 3.3
              </h3>
              <div className="space-y-4">
                {/* Image Upload for Verification */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Upload Verification Images
                  </label>
                  <input
                    type="file"
                    name="verificationImages"
                    onChange={(e) =>
                      handleAddPhotos("verificationImages", e.target.files)
                    }
                    accept="image/*"
                    multiple
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Upload multiple verification images (maximum 5 files).
                    Images will be automatically compressed to max 1MB each.
                  </div>
                  {formData.verificationImages &&
                    formData.verificationImages.length > 0 && (
                      <div className="mt-3">
                        <div className="mb-2 text-sm font-medium text-gray-700">
                          Selected files ({formData.verificationImages.length}
                          /5):
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {formData.verificationImages.map((file, index) => {
                            const previewUrl = getImagePreview(file);
                            return (
                              <div
                                key={index}
                                className="relative rounded-lg border border-gray-200 bg-white p-2 shadow-sm"
                              >
                                {previewUrl && (
                                  <div className="mb-2">
                                    <img
                                      src={previewUrl}
                                      alt={`Preview ${index + 1}`}
                                      className="h-24 w-full rounded object-cover"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                      }}
                                    />
                                  </div>
                                )}
                                <div className="flex items-center space-x-2 text-sm text-green-600">
                                  <span className="flex-1 truncate text-xs">
                                    {file.name}
                                  </span>
                                </div>
                                <input
                                  type="text"
                                  value={
                                    formData.verificationCaptions?.[index] || ""
                                  }
                                  onChange={(e) =>
                                    handleImageCaptionChange(
                                      "verificationImages",
                                      index,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Add caption"
                                  className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemovePhoto(
                                      "verificationImages",
                                      index
                                    )
                                  }
                                  className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                  title="Remove image"
                                >
                                  <svg
                                    className="h-3 w-3"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">
                      Calibration Reference{" "}
                      <span className="text-xs text-gray-500">(Permanent)</span>
                    </label>
                    <input
                      type="text"
                      name="verificationCalibrationReference"
                      value={formData.verificationCalibrationReference}
                      onChange={handleInputChangeWithBackgroundUpdate}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., Blue Collar 212mm (±1mm)"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">
                      Plate Measurement (mm){" "}
                      <span className="text-xs text-gray-500">
                        (Input Data I26 & I27)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="verificationPlateMeasurement"
                      value={formData.verificationPlateMeasurement}
                      onChange={handleInputChangeWithBackgroundUpdate}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., 212mm (from Excel I26 & I27)"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">
                      Instrument Display (mm){" "}
                      <span className="text-xs text-gray-500">
                        (Input Data E19 & E21)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="verificationInstrumentDisplay"
                      value={formData.verificationInstrumentDisplay}
                      onChange={handleInputChangeWithBackgroundUpdate}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., 212.55mm (from Excel E19 & E21)"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">
                      Head Error (mm){" "}
                      <span className="text-xs text-gray-500">
                        (Calculated)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="verificationHeadError"
                      value={formData.verificationHeadError}
                      onChange={handleInputChangeWithBackgroundUpdate}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., 0.55mm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">
                      Repeatability Error (mm){" "}
                      <span className="text-xs text-gray-500">
                        (Calculated)
                      </span>
                    </label>
                    <input
                      type="text"
                      name="verificationRepeatabilityError"
                      value={formData.verificationRepeatabilityError}
                      onChange={handleInputChangeWithBackgroundUpdate}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., 0.40mm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">
                      Curve Point Check Result{" "}
                      <span className="text-xs text-gray-500">(Manual)</span>
                    </label>
                    <input
                      type="text"
                      name="verificationCurvePointCheck"
                      value={formData.verificationCurvePointCheck}
                      onChange={handleInputChangeWithBackgroundUpdate}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., Successful"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Flow Measurement NIEA Viewpoint 3.4 */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 text-lg font-semibold text-gray-800">
                Flow Measurement NIEA Viewpoint 3.4
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <textarea
                    name="nieaDescription"
                    value={formData.nieaDescription}
                    onChange={handleInputChangeWithBackgroundUpdate}
                    rows="4"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Enter description for NIEA viewpoint..."
                  />
                </div>

                {/* Image Upload for NIEA Viewpoint */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Upload Multiple Images
                  </label>
                  <input
                    type="file"
                    name="nieaImages"
                    onChange={(e) =>
                      handleAddPhotos("nieaImages", e.target.files)
                    }
                    accept="image/*"
                    multiple
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Upload multiple NIEA viewpoint images (maximum 5 files).
                    Images will be automatically compressed to max 1MB each.
                  </div>
                  {formData.nieaImages && formData.nieaImages.length > 0 && (
                    <div className="mt-3">
                      <div className="mb-2 text-sm font-medium text-gray-700">
                        Selected files ({formData.nieaImages.length}/5):
                      </div>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {formData.nieaImages.map((file, index) => {
                          const previewUrl = getImagePreview(file);
                          return (
                            <div
                              key={index}
                              className="relative rounded-lg border border-gray-200 bg-white p-2 shadow-sm"
                            >
                              {previewUrl && (
                                <div className="mb-2">
                                  <img
                                    src={previewUrl}
                                    alt={`Preview ${index + 1}`}
                                    className="h-24 w-full rounded object-cover"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                </div>
                              )}
                              <div className="flex items-center space-x-2 text-sm text-green-600">
                                <span className="flex-1 truncate text-xs">
                                  {file.name}
                                </span>
                              </div>
                              <input
                                type="text"
                                value={formData.nieaCaptions?.[index] || ""}
                                onChange={(e) =>
                                  handleImageCaptionChange(
                                    "nieaImages",
                                    index,
                                    e.target.value
                                  )
                                }
                                placeholder="Add caption"
                                className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemovePhoto("nieaImages", index)
                                }
                                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                title="Remove image"
                              >
                                <svg
                                  className="h-3 w-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Maintenance & Calibration 4.0 */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Maintenance & calibration 4.0
            </h2>

            {/* Routine maintenance 4.1 */}
            <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 text-lg font-semibold text-gray-800">
                Routine maintenance 4.1
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <textarea
                    name="routineMaintenanceDescription"
                    value={formData.routineMaintenanceDescription}
                    onChange={handleInputChangeWithBackgroundUpdate}
                    rows="4"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="NIW operational personnel record maintenance activities..."
                  />
                </div>

                {/* Image Upload for Routine Maintenance */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Upload Multiple Images
                  </label>
                  <input
                    type="file"
                    name="routineMaintenanceImages"
                    onChange={(e) =>
                      handleAddPhotos(
                        "routineMaintenanceImages",
                        e.target.files
                      )
                    }
                    accept="image/*"
                    multiple
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Upload multiple routine maintenance images (maximum 5
                    files). Images will be automatically compressed to max 1MB
                    each.
                  </div>
                  {formData.routineMaintenanceImages &&
                    formData.routineMaintenanceImages.length > 0 && (
                      <div className="mt-3">
                        <div className="mb-2 text-sm font-medium text-gray-700">
                          Selected files (
                          {formData.routineMaintenanceImages.length}
                          /5):
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {formData.routineMaintenanceImages.map(
                            (file, index) => {
                              const previewUrl = getImagePreview(file);
                              return (
                                <div
                                  key={index}
                                  className="relative rounded-lg border border-gray-200 bg-white p-2 shadow-sm"
                                >
                                  {previewUrl && (
                                    <div className="mb-2">
                                      <img
                                        src={previewUrl}
                                        alt={`Preview ${index + 1}`}
                                        className="h-24 w-full rounded object-cover"
                                        onError={(e) => {
                                          e.target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  )}
                                  <div className="flex items-center space-x-2 text-sm text-green-600">
                                    <span className="flex-1 truncate text-xs">
                                      {file.name}
                                    </span>
                                  </div>
                                  <input
                                    type="text"
                                    value={
                                      formData.routineMaintenanceCaptions?.[
                                        index
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      handleImageCaptionChange(
                                        "routineMaintenanceImages",
                                        index,
                                        e.target.value
                                      )
                                    }
                                    placeholder="Add caption"
                                    className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemovePhoto(
                                        "routineMaintenanceImages",
                                        index
                                      )
                                    }
                                    className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                    title="Remove image"
                                  >
                                    <svg
                                      className="h-3 w-3"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Routine verification 4.2 */}
            <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-3 text-lg font-semibold text-gray-800">
                Routine verification 4.2
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <textarea
                    name="routineVerificationDescription"
                    value={formData.routineVerificationDescription}
                    onChange={handleInputChangeWithBackgroundUpdate}
                    rows="4"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="The flow sensor has a fixed calibration bracket..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Next Flow Validation Date
                  </label>
                  <input
                    type="date"
                    name="nextFlowValidationDate"
                    value={formData.nextFlowValidationDate}
                    onChange={handleInputChangeWithBackgroundUpdate}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Date of Inspection + 1 year
                  </div>
                </div>

                {/* Image Upload for Routine Verification */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Upload Multiple Images
                  </label>
                  <input
                    type="file"
                    name="routineVerificationImages"
                    onChange={(e) =>
                      handleAddPhotos(
                        "routineVerificationImages",
                        e.target.files
                      )
                    }
                    accept="image/*"
                    multiple
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    Upload multiple routine verification images (maximum 5
                    files). Images will be automatically compressed to max 1MB
                    each.
                  </div>
                  {formData.routineVerificationImages &&
                    formData.routineVerificationImages.length > 0 && (
                      <div className="mt-3">
                        <div className="mb-2 text-sm font-medium text-gray-700">
                          Selected files (
                          {formData.routineVerificationImages.length}/5):
                        </div>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {formData.routineVerificationImages.map(
                            (file, index) => {
                              const previewUrl = getImagePreview(file);
                              return (
                                <div
                                  key={index}
                                  className="relative rounded-lg border border-gray-200 bg-white p-2 shadow-sm"
                                >
                                  {previewUrl && (
                                    <div className="mb-2">
                                      <img
                                        src={previewUrl}
                                        alt={`Preview ${index + 1}`}
                                        className="h-24 w-full rounded object-cover"
                                        onError={(e) => {
                                          e.target.style.display = "none";
                                        }}
                                      />
                                    </div>
                                  )}
                                  <div className="flex items-center space-x-2 text-sm text-green-600">
                                    <span className="flex-1 truncate text-xs">
                                      {file.name}
                                    </span>
                                  </div>
                                  <input
                                    type="text"
                                    value={
                                      formData.routineVerificationCaptions?.[
                                        index
                                      ] || ""
                                    }
                                    onChange={(e) =>
                                      handleImageCaptionChange(
                                        "routineVerificationImages",
                                        index,
                                        e.target.value
                                      )
                                    }
                                    placeholder="Add caption"
                                    className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemovePhoto(
                                        "routineVerificationImages",
                                        index
                                      )
                                    }
                                    className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                    title="Remove image"
                                  >
                                    <svg
                                      className="h-3 w-3"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Survey measurement equipment 5.0 */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Survey measurement equipment 5.0
            </h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Description
                </label>
                <textarea
                  name="surveyEquipmentDescription"
                  value={formData.surveyEquipmentDescription}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  rows="3"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="The following is a list of equipment taken to each inspection."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Upload Multiple Images
                </label>
                <input
                  type="file"
                  name="surveyEquipmentImages"
                  onChange={(e) =>
                    handleAddPhotos("surveyEquipmentImages", e.target.files)
                  }
                  accept="image/*"
                  multiple
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                />
                <div className="mt-1 text-xs text-gray-500">
                  Upload multiple survey equipment images (maximum 5 files).
                  Images will be automatically compressed to max 1MB each.
                </div>

                {formData.surveyEquipmentImages &&
                  formData.surveyEquipmentImages.length > 0 && (
                    <div className="mt-3">
                      <div className="mb-2 text-sm font-medium text-gray-700">
                        Selected files ({formData.surveyEquipmentImages.length}
                        /5):
                      </div>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {formData.surveyEquipmentImages.map((file, index) => {
                          const previewUrl = getImagePreview(file);
                          return (
                            <div
                              key={index}
                              className="relative rounded-lg border border-gray-200 bg-white p-2 shadow-sm"
                            >
                              {previewUrl && (
                                <div className="mb-2">
                                  <img
                                    src={previewUrl}
                                    alt={`Preview ${index + 1}`}
                                    className="h-24 w-full rounded object-cover"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                </div>
                              )}
                              <div className="flex items-center space-x-2 text-sm text-green-600">
                                <svg
                                  className="h-4 w-4 flex-shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="flex-1 truncate text-xs">
                                  {file.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <input
                                type="text"
                                value={
                                  formData.surveyEquipmentCaptions?.[index] ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleImageCaptionChange(
                                    "surveyEquipmentImages",
                                    index,
                                    e.target.value
                                  )
                                }
                                placeholder="Add caption"
                                className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemovePhoto(
                                    "surveyEquipmentImages",
                                    index
                                  )
                                }
                                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                title="Remove image"
                              >
                                <svg
                                  className="h-3 w-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Appendices A, B, C */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Appendix A
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Description
                </label>
                <textarea
                  name="appendixField1"
                  value={formData.appendixField1}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  rows="3"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Upload Multiple Files
                </label>
                <input
                  type="file"
                  name="appendixAFiles"
                  onChange={(e) =>
                    handleAddPhotos("appendixAFiles", e.target.files)
                  }
                  accept="image/*,application/pdf"
                  multiple
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                />
                <div className="mt-1 text-xs text-gray-500">
                  Upload multiple files (maximum 5 files). Accepted formats:
                  JPG, PNG, PDF.
                </div>

                {formData.appendixAFiles &&
                  formData.appendixAFiles.length > 0 && (
                    <div className="mt-3">
                      <div className="mb-2 text-sm font-medium text-gray-700">
                        Selected files ({formData.appendixAFiles.length}/5):
                      </div>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {formData.appendixAFiles.map((file, index) => {
                          const previewUrl = getImagePreview(file);
                          const isImage =
                            file.type && file.type.startsWith("image/");
                          return (
                            <div
                              key={index}
                              className="relative rounded-lg border border-gray-200 bg-white p-2 shadow-sm"
                            >
                              {previewUrl && isImage && (
                                <div className="mb-2">
                                  <img
                                    src={previewUrl}
                                    alt={`Preview ${index + 1}`}
                                    className="h-24 w-full rounded object-cover"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                </div>
                              )}
                              {!isImage && (
                                <div className="mb-2 flex h-24 w-full items-center justify-center rounded bg-gray-100">
                                  <svg
                                    className="h-8 w-8 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}
                              <div className="flex items-center space-x-2 text-sm text-green-600">
                                <svg
                                  className="h-4 w-4 flex-shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="flex-1 truncate text-xs">
                                  {file.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <input
                                type="text"
                                value={
                                  formData.appendixACaptions?.[index] || ""
                                }
                                onChange={(e) =>
                                  handleImageCaptionChange(
                                    "appendixAFiles",
                                    index,
                                    e.target.value
                                  )
                                }
                                placeholder="Add caption"
                                className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemovePhoto("appendixAFiles", index)
                                }
                                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                title="Remove file"
                              >
                                <svg
                                  className="h-3 w-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Appendix B
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Description
                </label>
                <textarea
                  name="appendixField2"
                  value={formData.appendixField2}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  rows="3"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Upload Multiple Files
                </label>
                <input
                  type="file"
                  name="appendixBFiles"
                  onChange={(e) =>
                    handleAddPhotos("appendixBFiles", e.target.files)
                  }
                  accept="image/*,application/pdf"
                  multiple
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                />
                <div className="mt-1 text-xs text-gray-500">
                  Upload multiple files (maximum 5 files). Accepted formats:
                  JPG, PNG, PDF.
                </div>

                {formData.appendixBFiles &&
                  formData.appendixBFiles.length > 0 && (
                    <div className="mt-3">
                      <div className="mb-2 text-sm font-medium text-gray-700">
                        Selected files ({formData.appendixBFiles.length}/5):
                      </div>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {formData.appendixBFiles.map((file, index) => {
                          const previewUrl = getImagePreview(file);
                          const isImage =
                            file.type && file.type.startsWith("image/");
                          return (
                            <div
                              key={index}
                              className="relative rounded-lg border border-gray-200 bg-white p-2 shadow-sm"
                            >
                              {previewUrl && isImage && (
                                <div className="mb-2">
                                  <img
                                    src={previewUrl}
                                    alt={`Preview ${index + 1}`}
                                    className="h-24 w-full rounded object-cover"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                </div>
                              )}
                              {!isImage && (
                                <div className="mb-2 flex h-24 w-full items-center justify-center rounded bg-gray-100">
                                  <svg
                                    className="h-8 w-8 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}
                              <div className="flex items-center space-x-2 text-sm text-green-600">
                                <svg
                                  className="h-4 w-4 flex-shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="flex-1 truncate text-xs">
                                  {file.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <input
                                type="text"
                                value={
                                  formData.appendixBCaptions?.[index] || ""
                                }
                                onChange={(e) =>
                                  handleImageCaptionChange(
                                    "appendixBFiles",
                                    index,
                                    e.target.value
                                  )
                                }
                                placeholder="Add caption"
                                className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemovePhoto("appendixBFiles", index)
                                }
                                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                title="Remove file"
                              >
                                <svg
                                  className="h-3 w-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Appendix C
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Description
                </label>
                <textarea
                  name="appendixField3"
                  value={formData.appendixField3}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  rows="3"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder=""
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Upload Multiple Files
                </label>
                <input
                  type="file"
                  name="appendixCFiles"
                  onChange={(e) =>
                    handleAddPhotos("appendixCFiles", e.target.files)
                  }
                  accept="image/*,application/pdf"
                  multiple
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                />
                <div className="mt-1 text-xs text-gray-500">
                  Upload multiple files (maximum 5 files). Accepted formats:
                  JPG, PNG, PDF.
                </div>

                {formData.appendixCFiles &&
                  formData.appendixCFiles.length > 0 && (
                    <div className="mt-3">
                      <div className="mb-2 text-sm font-medium text-gray-700">
                        Selected files ({formData.appendixCFiles.length}/5):
                      </div>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {formData.appendixCFiles.map((file, index) => {
                          const previewUrl = getImagePreview(file);
                          const isImage =
                            file.type && file.type.startsWith("image/");
                          return (
                            <div
                              key={index}
                              className="relative rounded-lg border border-gray-200 bg-white p-2 shadow-sm"
                            >
                              {previewUrl && isImage && (
                                <div className="mb-2">
                                  <img
                                    src={previewUrl}
                                    alt={`Preview ${index + 1}`}
                                    className="h-24 w-full rounded object-cover"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                </div>
                              )}
                              {!isImage && (
                                <div className="mb-2 flex h-24 w-full items-center justify-center rounded bg-gray-100">
                                  <svg
                                    className="h-8 w-8 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}
                              <div className="flex items-center space-x-2 text-sm text-green-600">
                                <svg
                                  className="h-4 w-4 flex-shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="flex-1 truncate text-xs">
                                  {file.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <input
                                type="text"
                                value={
                                  formData.appendixCCaptions?.[index] || ""
                                }
                                onChange={(e) =>
                                  handleImageCaptionChange(
                                    "appendixCFiles",
                                    index,
                                    e.target.value
                                  )
                                }
                                placeholder="Add caption"
                                className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemovePhoto("appendixCFiles", index)
                                }
                                className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                                title="Remove file"
                              >
                                <svg
                                  className="h-3 w-3"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Conclusions 6.0 */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-800">
              Conclusions 6.0
            </h2>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Date (Uncertainty Sheet F2)
                </label>
                <input
                  type="date"
                  name="conclusionUncertaintySheetF2"
                  value={formData.conclusionUncertaintySheetF2}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Uncertainty (Uncertainty Sheet F104)
                </label>
                <input
                  type="text"
                  name="conclusionUncertaintySheetF104"
                  value={formData.conclusionUncertaintySheetF104}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., ±3.03%"
                />
              </div>
            </div>
          </div>

          {/* Signature Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                  Signature
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`h-7 w-12 cursor-pointer rounded-full transition-colors duration-200 ${
                    signatureIncluded ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  onClick={() => setSignatureIncluded(!signatureIncluded)}
                >
                  <div
                    className={`mt-1 h-5 w-5 rounded-full bg-white transition-transform duration-200 ${
                      signatureIncluded ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
              </div>
            </div>

            {signatureIncluded && (
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Inspector Signature Name
                  </label>
                  <input
                    type="text"
                    name="signatureName"
                    value={formData.signatureName}
                    onChange={handleInputChangeWithBackgroundUpdate}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="signatureCompany"
                    value={formData.signatureCompany}
                    onChange={handleInputChangeWithBackgroundUpdate}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={closeModal}
              disabled={isCreatingForm || isGenerating}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isCreatingForm || isGenerating}
              className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreatingForm ? (
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-4 w-4 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>{editingFormId ? "Updating..." : "Creating..."}</span>
                </div>
              ) : editingFormId ? (
                "Update Form"
              ) : (
                "Create Form"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(FormModal2);
