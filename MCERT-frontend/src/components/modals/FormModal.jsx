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

const FormModal = ({
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
            Electromagnetic Flow Meters - {editingFormId ? "Edit" : "New Entry"}
          </h2>
          <div className="flex gap-2">
            <label className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleExcelUpload}
                className="hidden"
              />
              Upload Excel File
            </label>
            <Button
              onClick={closeModal}
              className="rounded-md bg-gray-200 px-3 py-2 text-gray-700 hover:bg-gray-300"
            >X</Button>
          </div>
        </div>

        {/* Compression Status */}
        {compressionStatus && (
          <div
            className={`mb-4 rounded-lg p-4 ${
              compressionStatus === "compressing"
                ? "border border-brand-200 bg-brand-50"
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
                  className="h-4 w-4 animate-spin text-brand-500"
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
                    ? "text-brand-700"
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
                      MB â†’{" "}
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
          {/* Template Information */}

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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Report prepared by"
                />
                <div className="mt-1 text-xs text-gray-500">
                  editable - saved to local storage
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
                      // Note: Background update removed - only update on image upload or form submission
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
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-brand-600"
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

          {/* Consent/Permit Holder & Company Registration */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Consent/Permit Holder & Company Registration
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Consent/Permit Holder & Company registration
                </label>
                <div className="flex gap-2">
                  <CustomDropdown
                    value={formData.consentPermitHolder}
                    onChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        consentPermitHolder: value,
                      }));
                      // Note: Background update removed - only update on image upload or form submission
                    }}
                    options={consentList}
                    defaultOptions={defaultOptions.consentList}
                    placeholder="Select Company"
                    isOpen={isConsentDropdownOpen}
                    setIsOpen={setIsConsentDropdownOpen}
                    onDelete={(value) =>
                      handleDeleteDropdownOption("consentPermitHolder", value)
                    }
                    onAdd={() => openModal("consentPermitHolder")}
                    addButtonTitle="Add new company"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => openModal("consentPermitHolder")}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-brand-600"
                    title="Add new company"
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="from DB / Emag data E4"
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                    // Note: Background update removed - only update on image upload or form submission
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              {/* <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Aerial View of Site
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        name="aerialViewFile"
                        onChange={handleInputChangeWithBackgroundUpdate}
                        accept="image/*,.pdf"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100 dark:file:bg-brand-900 dark:file:text-brand-300"
                      />
                      {formData.aerialViewFile && (
                        <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{formData.aerialViewFile.name}</span>
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Upload an aerial view image or PDF of the site. Accepted
                      formats: JPG, PNG, PDF
                    </p>
                  </div> */}
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
                  Make and model of Flowmeter(s)
                </label>
                <input
                  type="text"
                  name="flowmeterMakeModel"
                  value={formData.flowmeterMakeModel}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Emag data E7"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Type of Flowmeter(s)
                </label>
                <div className="flex gap-2">
                  <CustomDropdown
                    value={formData.flowmeterType}
                    onChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        flowmeterType: value,
                      }));
                      // Note: Background update removed - only update on image upload or form submission
                    }}
                    options={flowTypes}
                    defaultOptions={defaultOptions.flowTypes}
                    placeholder="Select Type"
                    isOpen={isFlowTypeDropdownOpen}
                    setIsOpen={setIsFlowTypeDropdownOpen}
                    onDelete={(value) =>
                      handleDeleteDropdownOption("flowmeterType", value)
                    }
                    onAdd={() => openModal("flowmeterType")}
                    addButtonTitle="Add new flowmeter type"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => openModal("flowmeterType")}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:text-brand-600"
                    title="Add new flowmeter type"
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
                  Serial number(s) of Flowmeter(s)
                </label>
                <input
                  type="text"
                  name="flowmeterSerial"
                  value={formData.flowmeterSerial}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Emag data E8 & E9"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  NIW Asset ID
                </label>
                <input
                  type="text"
                  name="niwAssetId"
                  value={formData.niwAssetId}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="manually enter"
                />
              </div>
            </div>
          </div>
          {/* Compliance and Inspection Details (moved up) */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Compliance and Inspection Details
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Statement of Compliance
                </label>
                <input
                  type="text"
                  name="statementOfCompliance"
                  value={formData.statementOfCompliance}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="from spreadsheet (Uncertainty sheet f104)"
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                  Site & flow meter description
                </label>
                <textarea
                  name="siteDescription"
                  value={formData.siteDescription}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  rows="4"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="manually entered"
                />
              </div>
            </div>
          </div>

          {/* Permit Limits */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Permit Limits
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  WOC Number
                </label>
                <input
                  type="text"
                  name="wocNumber"
                  value={formData.wocNumber}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="same as Consent/Permit No (from DB)"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Dry Weather Flow
                </label>
                <input
                  type="text"
                  name="dryW"
                  value={formData.dryW}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="from DB"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Max Daily Volume
                </label>
                <input
                  type="text"
                  name="maxD"
                  value={formData.maxD}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="from DB"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Max FFT Flow Rate
                </label>
                <input
                  type="text"
                  name="maxFFT"
                  value={formData.maxFFT}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="from DB"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Qmax Flowmeter
                </label>
                <input
                  type="text"
                  name="qmaxF"
                  value={formData.qmaxF}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Emag data E14"
                />
              </div>
            </div>
          </div>

          {/* Additional Information (merged) */}
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Site maintenance arrangements"
                />
                <div className="mt-1 text-xs text-gray-500">
                  editable - saved to local storage
                </div>
              </div>
            </div>
          </div>

          {/* References & Definitions 1.0 */}
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
                      className="flex w-full items-center justify-center rounded-md bg-brand-50 px-3 py-2 text-sm text-brand-600 hover:bg-brand-100"
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

          {/* Aerial view & general arrangement */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Aerial view & general arrangement
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
                  rows="3"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Below is an aerial view of the site which provides the approximate location of the flow measurement system(s). In addition, a photograph showing the general arrangement and NIEA viewpoint is provided."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Upload Multiple Images
                </label>
                <input
                  type="file"
                  name="aerialViewImages"
                  onChange={(e) =>
                    handleAddPhotos("aerialViewImages", e.target.files)
                  }
                  accept="image/*"
                  multiple
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
                />
                <div className="mt-1 text-xs text-gray-500">
                  Upload multiple aerial view images (maximum 5 files). Images
                  will be automatically compressed to max 1MB each. Accepted
                  formats: JPG, PNG, GIF.
                </div>

                {/* Show existing photos with previews */}
                {formData.aerialViewImages &&
                  formData.aerialViewImages.length > 0 && (
                    <div className="mt-3">
                      <div className="mb-2 text-sm font-medium text-gray-700">
                        Selected files ({formData.aerialViewImages.length}
                        /5):
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
                                className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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

          {/* Site process & schematic diagram 3.0 */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Site process & schematic diagram 3.0
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
                  rows="3"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="manually entered"
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
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
                />
                <div className="mt-1 text-xs text-gray-500">
                  Upload multiple site process and schematic images (maximum 5
                  files). Images will be automatically compressed to max 1MB
                  each.
                </div>

                {/* Show existing photos with previews */}
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
                                className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemovePhoto("siteProcessImages", index)
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

          {/* Inspection of flow monitoring system 4.0 */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Inspection of flow monitoring system 4.0
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Description
                </label>
                <textarea
                  name="inspectionFlowDescription"
                  value={formData.inspectionFlowDescription}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  rows="3"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="manually entered"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Upload Multiple Images
                </label>
                <input
                  type="file"
                  name="inspectionFlowImages"
                  onChange={(e) =>
                    handleAddPhotos("inspectionFlowImages", e.target.files)
                  }
                  accept="image/*"
                  multiple
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
                />
                <div className="mt-1 text-xs text-gray-500">
                  Upload multiple flow monitoring system inspection images
                  (maximum 5 files).
                </div>

                {/* Show existing photos with previews */}
                {formData.inspectionFlowImages &&
                  formData.inspectionFlowImages.length > 0 && (
                    <div className="mt-3">
                      <div className="mb-2 text-sm font-medium text-gray-700">
                        Selected files ({formData.inspectionFlowImages.length}
                        /5):
                      </div>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {formData.inspectionFlowImages.map((file, index) => {
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
                                  formData.inspectionFlowCaptions?.[index] || ""
                                }
                                onChange={(e) =>
                                  handleImageCaptionChange(
                                    "inspectionFlowImages",
                                    index,
                                    e.target.value
                                  )
                                }
                                placeholder="Add caption"
                                className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemovePhoto(
                                    "inspectionFlowImages",
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

          {/* Flow measurement verification check 5.0 */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Flow measurement verification check 5.0
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Description
                </label>
                <textarea
                  name="flowMeasurementDescription"
                  value={formData.flowMeasurementDescription}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  rows="3"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="A flow verification was undertaken using a time-of-flight flow measurement system. 10 separate flow measurement readings were taken and compared against what was being displayed by the meter under test. A zero check was undertaken. The flow measurement verification was successful."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Upload Multiple Images
                </label>
                <input
                  type="file"
                  name="flowMeasurementImages"
                  onChange={(e) =>
                    handleAddPhotos("flowMeasurementImages", e.target.files)
                  }
                  accept="image/*"
                  multiple
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
                />

                <div className="mt-1 text-xs text-gray-500">
                  Upload multiple flow measurement verification images (maximum
                  5 files).
                </div>

                {/* Show existing photos with previews */}
                {formData.flowMeasurementImages &&
                  formData.flowMeasurementImages.length > 0 && (
                    <div className="mt-3">
                      <div className="mb-2 text-sm font-medium text-gray-700">
                        Selected files ({formData.flowMeasurementImages.length}
                        /5):
                      </div>
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {formData.flowMeasurementImages.map((file, index) => {
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
                                  formData.flowMeasurementCaptions?.[index] ||
                                  ""
                                }
                                onChange={(e) =>
                                  handleImageCaptionChange(
                                    "flowMeasurementImages",
                                    index,
                                    e.target.value
                                  )
                                }
                                placeholder="Add caption"
                                className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemovePhoto(
                                    "flowMeasurementImages",
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

          {/* <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="mb-3 text-lg font-semibold text-gray-800">
                  Survey measurement equipment 6.0
                </h3>
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
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      placeholder="The following is a list of vehicle equipment available for the inspection."
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
                      className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
                    />

                    <div className="mt-1 text-xs text-gray-500">
                      Upload multiple survey equipment images (maximum 5 files).
                      Images will be automatically compressed to max 1MB each.
                    </div>

                   
                    {formData.surveyEquipmentImages &&
                      formData.surveyEquipmentImages.length > 0 && (
                        <div className="mt-3">
                          <div className="mb-2 text-sm font-medium text-gray-700">
                            Selected files (
                            {formData.surveyEquipmentImages.length}/5):
                          </div>
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {formData.surveyEquipmentImages.map(
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
                                        ({(file.size / 1024 / 1024).toFixed(2)}{" "}
                                        MB)
                                      </span>
                                    </div>
                                    <input
                                      type="text"
                                      value={
                                        formData.surveyEquipmentCaptions?.[
                                          index
                                        ] || ""
                                      }
                                      onChange={(e) =>
                                        handleImageCaptionChange(
                                          "surveyEquipmentImages",
                                          index,
                                          e.target.value
                                        )
                                      }
                                      placeholder="Add caption"
                                      className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                              }
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div> */}

          {/* Conclusion */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Conclusion
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Uncertainty
                </label>
                <input
                  type="text"
                  name="conclusionUnCert"
                  value={formData.conclusionUnCert}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="Enter uncertainty value (e.g.,  ±1.2%)"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">
                  Date
                </label>
                <input
                  type="date"
                  name="conclusionDate"
                  value={formData.conclusionDate}
                  onChange={handleInputChangeWithBackgroundUpdate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Appendices A,B,C */}
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
                />

                <div className="mt-1 text-xs text-gray-500">
                  Upload multiple files (maximum 5 files). Accepted formats:
                  JPG, PNG, PDF.
                </div>

                {/* Show existing files with previews */}
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
                                className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
                />

                <div className="mt-1 text-xs text-gray-500">
                  Upload multiple files (maximum 5 files). Accepted formats:
                  JPG, PNG, PDF.
                </div>

                {/* Show existing files with previews */}
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
                                className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                  className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
                />

                <div className="mt-1 text-xs text-gray-500">
                  Upload multiple files (maximum 5 files). Accepted formats:
                  JPG, PNG, PDF.
                </div>

                {/* Show existing files with previews */}
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
                                className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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

          {/* Bottom: Signature toggle and actions */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                  Signature
                </h3>
                <div className="text-xs text-gray-500">
                  Toggle on = signature included. Toggle off = signature removed
                  from generated file (demo).
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={`h-7 w-12 cursor-pointer rounded-full transition-colors duration-200 ${
                    signatureIncluded ? "bg-brand-500" : "bg-gray-300"
                  }`}
                  onClick={() => setSignatureIncluded(!signatureIncluded)}
                >
                  <div
                    className={`mt-1 h-5 w-5 rounded-full bg-white transition-transform duration-200 ${
                      signatureIncluded ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </div>
                <div
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    signatureIncluded
                      ? "border-brand-200 bg-brand-50 text-brand-700"
                      : "border-gray-200 bg-gray-50 text-gray-500"
                  }`}
                >
                  {signatureIncluded ? "Signed by inspector" : "No signature"}
                </div>
              </div>
            </div>

            {/* Signature Text Fields - Only show when toggle is on */}
            {signatureIncluded && (
              <div className="mt-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">
                      Inspector Signature Name
                    </label>
                    <input
                      type="text"
                      name="signatureName"
                      value={formData.signatureName}
                      onChange={handleInputChangeWithBackgroundUpdate}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      placeholder="Enter inspector signature name"
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      This will appear as the signature in the report
                    </div>
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
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                      placeholder="Enter company name"
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      This will appear below the signature
                    </div>
                  </div>
                </div>

                {/* Show signature preview */}
                {formData.signatureName && formData.signatureCompany && (
                  <div className="mt-4">
                    <div className="mb-2 text-sm font-medium text-gray-700">
                      Signature Preview:
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="text-center">
                        <div
                          className="font-italic text-2xl text-gray-800"
                          style={{ fontFamily: "cursive" }}
                        >
                          {formData.signatureName}
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          {formData.signatureCompany}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                onClick={closeModal}
                disabled={isCreatingForm || isGenerating}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </Button>

              {editingFormId && (
                <Button
                  type="button"
                  onClick={handleGenerateReport}
                  disabled={isGenerating || isCreatingForm}
                  className="rounded-lg bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isGenerating ? (
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
                      <span>Generating Report...</span>
                    </div>
                  ) : (
                    "Generate Report"
                  )}
                </Button>
              )}

              <Button
                type="submit"
                disabled={isCreatingForm || isGenerating}
                className="rounded-lg bg-brand-500 px-4 py-2 font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(FormModal);
