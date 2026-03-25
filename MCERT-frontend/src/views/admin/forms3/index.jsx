import React, { useState, useEffect, useCallback } from "react";
import { generateMCLERTSReport } from "../../../utils/documentGenerator3";
import {
  formsService,
  handleApiError,
  getSuccessMessage,
} from "../../../services/formsService3";
import {
  getDefaultFormData,
  dropdownOptions,
  defaultOptions,
  mapFormDataFromAPI,
  handleFormInputChange,
  removePhoto,
  addPhotos,
  addEditedPhoto,
  imageCaptionFieldBySection,
} from "../../../models/formModel3";
import {
  processExcelFile,
  validateExcelFile,
  mapExcelDataToForm,
  extractUncertaintySheetData,
} from "../../../utils/excelProcessor3";
import FormModal3 from "../../../components/modals/FormModal3";
import AddValueModal2 from "../../../components/modals/AddValueModal2";
import UnsavedChangesModal2 from "../../../components/modals/UnsavedChangesModal2";
import ImageEditorModal2 from "../../../components/modals/ImageEditorModal2";
import ConfirmModal from "../../../components/modals/ConfirmModal";
import FormsTable3 from "../../../components/tables/FormsTable3";
const Button = ({
  children,
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  return (
    <button type={type} onClick={onClick} className={className} {...props}>
      {children}
    </button>
  );
};

// Helper function to convert file to base64
const fileToDataURL = (file) =>
  new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });

// Helper function to convert all images to base64 for API submission
const convertImagesToBase64 = async (formData) => {
  const processedFormData = { ...formData };

  // List of image fields that need to be converted
  const imageFields = Object.keys(imageCaptionFieldBySection);

  // Convert each image field to base64
  for (const field of imageFields) {
    if (processedFormData[field] && Array.isArray(processedFormData[field])) {
      const base64Images = [];

      for (const file of processedFormData[field]) {
        if (file instanceof File) {
          try {
            const base64 = await fileToDataURL(file);
            base64Images.push({
              name: file.name,
              type: file.type,
              size: file.size,
              data: base64,
            });
          } catch (error) {
            console.error(`Error converting ${file.name} to base64:`, error);
          }
        } else if (file && file.data) {
          // If it's already base64 data from API, keep it as is
          base64Images.push(file);
        }
      }

      processedFormData[field] = base64Images;
    }
  }

  return processedFormData;
};

// Helper function to convert base64 data back to File objects for document generation
const convertBase64ToFiles = (formData) => {
  const processedFormData = { ...formData };

  // List of image fields that need to be converted back to File objects
  const imageFields = [
    "aerialViewImages",
    "siteProcessImages",
    "inspectionFlowImages",
    "flowMeasurementImages",
    "surveyEquipmentImages",
    "appendixAFiles",
    "appendixBFiles",
    "appendixCFiles",
  ];

  // Convert each image field back to File objects
  for (const field of imageFields) {
    if (processedFormData[field] && Array.isArray(processedFormData[field])) {
      const fileObjects = [];

      for (const imageData of processedFormData[field]) {
        if (imageData instanceof File) {
          // Already a File object
          fileObjects.push(imageData);
        } else if (imageData && imageData.data) {
          // Convert base64 back to File object
          try {
            const byteCharacters = atob(imageData.data.split(",")[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const file = new File([byteArray], imageData.name, {
              type: imageData.type,
            });
            fileObjects.push(file);
          } catch (error) {
            console.error(
              `Error converting ${imageData.name} back to File:`,
              error
            );
          }
        }
      }

      processedFormData[field] = fileObjects;
    }
  }

  return processedFormData;
};

const Form2Page = () => {
  // State for forms data
  const [forms, setForms] = useState([]);
  const [isLoadingForms, setIsLoadingForms] = useState(true);
  const [isLoadingFormById, setIsLoadingFormById] = useState(false);
  const [isDeletingForm, setIsDeletingForm] = useState(false);
  const [isCreatingForm, setIsCreatingForm] = useState(false);
  const [error, setError] = useState(null);
  const [selectedForms, setSelectedForms] = useState(new Set());
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', ids: [], isLoading: false });
  const [successMessage, setSuccessMessage] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [limit] = useState(5); // Fixed limit as requested

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingFormId, setEditingFormId] = useState(null);
  const [formData, setFormData] = useState(() => {
    const defaultData = getDefaultFormData();

    // Load fixed field values from localStorage
    const savedReportPreparedBy = localStorage.getItem(
      "mcerts2_reportPreparedBy"
    );
    const savedFixedFields = {
      reportPreparedBy:
        (savedReportPreparedBy && savedReportPreparedBy.trim()) ||
        defaultData.reportPreparedBy ||
        "Siris Flow Inspections Ltd",
      statementOfCompliance:
        localStorage.getItem("mcerts2_statementOfCompliance") ||
        defaultData.statementOfCompliance,
      field1: localStorage.getItem("mcerts2_field1") || defaultData.field1,
      field2: localStorage.getItem("mcerts2_field2") || defaultData.field2,
      field3: localStorage.getItem("mcerts2_field3") || defaultData.field3,
    };

    return { ...defaultData, ...savedFixedFields };
  });

  // Track original form data to detect unsaved changes
  const [originalFormData, setOriginalFormData] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [compressionStatus, setCompressionStatus] = useState(null);
  const [compressionProgress, setCompressionProgress] = useState(null);
  const [downloadingFormId, setDownloadingFormId] = useState(null);

  // State for tracking created form ID and background operations
  const [createdFormId, setCreatedFormId] = useState(null);
  const [isBackgroundUpdating, setIsBackgroundUpdating] = useState(false);

  // Dropdown data and modal state
  const [inspectors, setInspectors] = useState(() => {
    const saved = localStorage.getItem("mcerts2_inspectors");

    // If there's corrupted data in localStorage, clear it and use defaults
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        } else {
          localStorage.removeItem("mcerts2_inspectors");
          return dropdownOptions.inspectors;
        }
      } catch (error) {
        localStorage.removeItem("mcerts2_inspectors");
        return dropdownOptions.inspectors;
      }
    }

    return dropdownOptions.inspectors;
  });
  const [consentList, setConsentList] = useState(() => {
    const saved = localStorage.getItem("mcerts2_consentList");
    return saved ? JSON.parse(saved) : dropdownOptions.consentList;
  });
  const [flowTypes, setFlowTypes] = useState(() => {
    const saved = localStorage.getItem("mcerts2_flowTypes");
    return saved ? JSON.parse(saved) : dropdownOptions.flowTypes;
  });
  const [siteContacts, setSiteContacts] = useState(() => {
    const saved = localStorage.getItem("mcerts2_siteContacts");
    return saved ? JSON.parse(saved) : dropdownOptions.siteContacts;
  });
  const [showModal, setShowModal] = useState(false);
  const [modalTarget, setModalTarget] = useState("");
  const [modalValue, setModalValue] = useState("");
  const [signatureIncluded, setSignatureIncluded] = useState(true);

  // Image editor modal state
  const [imageEditorModal, setImageEditorModal] = useState({
    isOpen: false,
    file: null,
    section: null,
  });

  // Dropdown open states
  const [isInspectorDropdownOpen, setIsInspectorDropdownOpen] = useState(false);
  const [isConsentDropdownOpen, setIsConsentDropdownOpen] = useState(false);
  const [isFlowTypeDropdownOpen, setIsFlowTypeDropdownOpen] = useState(false);
  const [isSiteContactDropdownOpen, setIsSiteContactDropdownOpen] =
    useState(false);

  // Sync signatureIncluded with formData
  useEffect(() => {
    setFormData((prev) => ({ ...prev, signatureIncluded }));
  }, [signatureIncluded]);

  // Background update function - calls update API without showing loader
  const performBackgroundUpdate = async (
    formDataToUpdate,
    reason = "form_change"
  ) => {
    if (!createdFormId || isBackgroundUpdating) {
      return;
    }

    try {
      setIsBackgroundUpdating(true);
      const token = localStorage.getItem("userResposne");

      // Convert images to base64 before sending
      const processedFormData = await convertImagesToBase64(formDataToUpdate);

      const result = await formsService.updateForm(
        createdFormId,
        processedFormData,
        token
      );

      if (result.success) {
        console.log(`Background update successful for ${reason}`);
      } else {
        console.error(`Background update failed for ${reason}:`, result.error);
      }
    } catch (error) {
      console.error(`Background update error for ${reason}:`, error);
    } finally {
      setIsBackgroundUpdating(false);
    }
  };

  // Note: Removed debounced background update - only update on image upload and form submission

  // Set default signature text when signature is enabled
  useEffect(() => {
    if (signatureIncluded && !formData.signatureName) {
      setFormData((prev) => ({
        ...prev,
        signatureName: "Aaron McGilligan",
        signatureCompany: "SIRIS Flow Inspections Ltd",
      }));
    }
  }, [signatureIncluded, formData.signatureName]);

  // Fetch all forms from API
  const fetchForms = useCallback(
    async (page = currentPage) => {
      try {
        setIsLoadingForms(true);
        setError(null);

        // Get token from localStorage or context if you have authentication
        const token = localStorage.getItem("authToken");
        const result = await formsService.getAllForms(
          token,
          page,
          limit,
          "desc"
        );

        if (result.success && result.data) {
          console.log("API Response:", result);

          // Handle the new pagination API response format
          if (result.data.data && result.data.pagination) {
            const paginationData = result.data.pagination;
            const currentPageFromAPI = parseInt(paginationData.page) || page;
            const totalPagesFromAPI = parseInt(paginationData.totalPages) || 1;
            const totalItemsFromAPI = parseInt(paginationData.total) || 0;

            console.log("Pagination data:", {
              currentPageFromAPI,
              totalPagesFromAPI,
              totalItemsFromAPI,
              hasNext: paginationData.hasNext,
              hasPrev: paginationData.hasPrev,
            });

            // Flatten formData fields to top level for table display
            const flattenedForms = (result.data.data || []).map((form) => ({
              ...form,
              ...(form.formData || {}),
            }));

            setForms(flattenedForms);
            setTotalPages(totalPagesFromAPI);
            setTotalItems(totalItemsFromAPI);
            setCurrentPage(currentPageFromAPI);
            setHasNext(paginationData.hasNext || false);
            setHasPrev(paginationData.hasPrev || false);
          } else if (result.data && result.data.data) {
            setForms(result.data.forms);
            setTotalPages(parseInt(result.data.totalPages) || 1);
            setTotalItems(parseInt(result.data.totalItems) || 0);
            setCurrentPage(parseInt(result.data.currentPage) || page);
            setHasNext(result.data.hasNext || false);
            setHasPrev(result.data.hasPrev || false);
          } else {
            // Fallback for non-paginated response
            setForms(result.data || []);
            setTotalPages(1);
            setTotalItems(result.data?.length || 0);
            setCurrentPage(1);
            setHasNext(false);
            setHasPrev(false);
          }
        } else {
          setError(result?.error || "Failed to fetch forms");
        }
      } catch (error) {
        setError(handleApiError(error, "Failed to fetch forms"));
      } finally {
        setIsLoadingForms(false);
      }
    },
    [currentPage, limit]
  );

  // Fetch forms on component mount
  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  // Pagination event handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      fetchForms(newPage);
    }
  };

  const handlePreviousPage = () => {
    if (hasPrev && currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNext && currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Function to check if form has unsaved changes
  const checkForUnsavedChanges = useCallback(() => {
    if (!originalFormData) return false;

    // Deep comparison of form data
    const hasChanges =
      JSON.stringify(formData) !== JSON.stringify(originalFormData);
    setHasUnsavedChanges(hasChanges);
    return hasChanges;
  }, [formData, originalFormData]);

  // Update unsaved changes when form data changes
  useEffect(() => {
    checkForUnsavedChanges();
  }, [formData, checkForUnsavedChanges]);

  const handleAddNewForm = async () => {
    try {
      setIsCreatingForm(true);

      // Reset form state
      setEditingFormId(null);
      setCreatedFormId(null);
      const defaultData = getDefaultFormData();
      setFormData(defaultData);
      setOriginalFormData(defaultData);
      setHasUnsavedChanges(false);

      // Create a new form immediately
      const token = localStorage.getItem("userResposne");
      const payload = {
        formData: defaultData,
        status: "Draft",
        userId: token,
      };

      const result = await formsService.createForm(payload, token);

      if (result.success && result.data) {
        // Handle nested response structure
        const responseData = result.data.data || result.data;
        if (responseData && responseData._id) {
          setCreatedFormId(responseData._id);
          setShowFormModal(true);
        } else {
          alert(`Error: Invalid response structure - missing form ID`);
        }
      } else {
        alert(`Error: ${result.error || "Failed to create new form"}`);
      }
    } catch (error) {
      console.error("Error creating new form:", error);
      alert(`Error: ${handleApiError(error, "Failed to create new form")}`);
    } finally {
      setIsCreatingForm(false);
    }
  };

  const handleEditForm = async (id) => {
    try {
      setIsLoadingFormById(true);

      const token = localStorage.getItem("token") || localStorage.getItem("userResposne");
      // Use getFormWithData to fetch actual form data from file storage
      const result = await formsService.getFormWithData(id, token);

      if (result.success && result.data) {
        // formData is the actual stored form data (from file storage)
        const responseData = result.data.formData || result.data.data || result.data;
        const mappedFormData = mapFormDataFromAPI(responseData);
        setFormData(mappedFormData);
        setOriginalFormData(mappedFormData); // Track original data for unsaved changes
        setHasUnsavedChanges(false);
        setSignatureIncluded(mappedFormData.signatureIncluded);
        setEditingFormId(id);
        setCreatedFormId(id); // Set created form ID for background updates
        setShowFormModal(true);
      } else {
        alert(`Error: ${result.error || "Failed to fetch form data"}`);
      }
    } catch (error) {
      console.error("Error in handleEditForm:", error); // Debug log
      alert(`Error: ${handleApiError(error, "Failed to fetch form data")}`);
    } finally {
      setIsLoadingFormById(false);
    }
  };

  const handleDeleteForm = (id) => {
    setConfirmModal({ isOpen: true, type: 'delete', ids: [id], isLoading: false });
  };

  // Custom input change handler that triggers background updates
  const handleInputChangeWithBackgroundUpdate = (e) => {
    handleFormInputChange(e, formData, setFormData);

    // Save fixed field values to localStorage
    const { name, value } = e.target;
    const fixedFields = [
      "reportPreparedBy",
      "statementOfCompliance",
      "field1",
      "field2",
      "field3",
    ];

    if (fixedFields.includes(name)) {
      saveFixedFieldToLocalStorage(name, value);
    }

    // Note: Background update removed - only update on image upload or form submission
  };

  const handleImageCaptionChange = (section, index, value) => {
    const captionField = imageCaptionFieldBySection[section];
    if (!captionField) return;

    setFormData((prev) => {
      const captions = [...(prev[captionField] || [])];
      captions[index] = value;
      const nextFormData = {
        ...prev,
        [captionField]: captions,
      };

      if (createdFormId) {
        setTimeout(() => {
          performBackgroundUpdate(
            nextFormData,
            `caption_updated_${section}_${index}`
          );
        }, 100);
      }

      return nextFormData;
    });
  };

  // Photo handling functions
  const handleRemovePhoto = (section, index) => {
    removePhoto(section, index, formData, setFormData);
    // Trigger background update after removing photo (only for image operations)
    if (createdFormId) {
      setTimeout(() => {
        performBackgroundUpdate(formData, `photo_removed_${section}`);
      }, 100);
    }
  };

  // Handler to open image editor modal
  const handleOpenImageEditor = async (file, section) => {
    const currentFiles = formData[section] || [];

    // Check if adding this file would exceed the limit of 5
    if (currentFiles.length >= 5) {
      alert(
        `You can only upload a maximum of 5 images per section. You currently have ${currentFiles.length} images.`
      );
      return;
    }

    // Open the image editor modal
    setImageEditorModal({
      isOpen: true,
      file: file,
      section: section,
    });
  };

  // Handler to save edited image from editor modal
  const handleSaveEditedImage = async (editedFile) => {
    if (!imageEditorModal.section) return;

    // Handle compression progress
    const onProgress = (progressInfo) => {
      if (progressInfo.status === "compressing") {
        setCompressionStatus("compressing");
        setCompressionProgress(null);
      } else if (progressInfo.current && progressInfo.total) {
        setCompressionProgress({
          current: progressInfo.current,
          total: progressInfo.total,
          fileName: progressInfo.fileName,
          originalSize: progressInfo.originalSize,
          compressedSize: progressInfo.compressedSize,
          compressionRatio: progressInfo.compressionRatio,
        });
      } else if (progressInfo.status === "completed") {
        setCompressionStatus("completed");
        setTimeout(() => {
          setCompressionStatus(null);
          setCompressionProgress(null);
        }, 3000);
      } else if (progressInfo.status === "error") {
        setCompressionStatus("error");
        setTimeout(() => {
          setCompressionStatus(null);
          setCompressionProgress(null);
        }, 5000);
      }
    };

    // Add the edited photo with compression
    await addEditedPhoto(
      imageEditorModal.section,
      editedFile,
      formData,
      setFormData,
      onProgress
    );

    // Trigger background update after adding photo (only for image operations)
    if (createdFormId) {
      setTimeout(() => {
        performBackgroundUpdate(
          formData,
          `photo_edited_${imageEditorModal.section}`
        );
      }, 100);
    }

    // Close the modal
    setImageEditorModal({
      isOpen: false,
      file: null,
      section: null,
    });
  };

  // Handler to cancel image editor
  const handleCancelImageEditor = () => {
    setImageEditorModal({
      isOpen: false,
      file: null,
      section: null,
    });
  };

  const handleAddPhotos = async (section, files) => {
    const fileArray = Array.from(files);
    const currentFiles = formData[section] || [];

    // Check if adding these files would exceed the limit of 5
    if (currentFiles.length + fileArray.length > 5) {
      alert(
        `You can only upload a maximum of 5 images per section. You currently have ${currentFiles.length} images and are trying to add ${fileArray.length} more.`
      );
      return;
    }

    // Handle compression progress
    const onProgress = (progressInfo) => {
      if (progressInfo.status === "compressing") {
        setCompressionStatus("compressing");
        setCompressionProgress(null);
      } else if (progressInfo.current && progressInfo.total) {
        setCompressionProgress({
          current: progressInfo.current,
          total: progressInfo.total,
          fileName: progressInfo.fileName,
          originalSize: progressInfo.originalSize,
          compressedSize: progressInfo.compressedSize,
          compressionRatio: progressInfo.compressionRatio,
        });
      } else if (progressInfo.status === "completed") {
        setCompressionStatus("completed");
        setTimeout(() => {
          setCompressionStatus(null);
          setCompressionProgress(null);
        }, 3000);
      } else if (progressInfo.status === "error") {
        setCompressionStatus("error");
        setTimeout(() => {
          setCompressionStatus(null);
          setCompressionProgress(null);
        }, 5000);
      }
    };

    // Pass the editor callback to open editor for each image
    await addPhotos(
      section,
      files,
      formData,
      setFormData,
      onProgress,
      handleOpenImageEditor
    );

    // Trigger background update after adding photos (only for image operations)
    if (createdFormId) {
      setTimeout(() => {
        performBackgroundUpdate(formData, `photos_added_${section}`);
      }, 100);
    }
  };

  // Helper function to get image preview URL
  const getImagePreview = (file) => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    } else if (file && file.data) {
      return file.data;
    }
    return null;
  };

  // localStorage persistence functions
  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const updateInspectors = (newInspectors) => {
    setInspectors(newInspectors);
    saveToLocalStorage("mcerts2_inspectors", newInspectors);
  };

  const updateConsentList = (newConsentList) => {
    setConsentList(newConsentList);
    saveToLocalStorage("mcerts2_consentList", newConsentList);
  };

  const updateFlowTypes = (newFlowTypes) => {
    setFlowTypes(newFlowTypes);
    saveToLocalStorage("mcerts2_flowTypes", newFlowTypes);
  };

  // Fixed fields localStorage functions
  const saveFixedFieldToLocalStorage = (fieldName, value) => {
    localStorage.setItem(`mcerts2_${fieldName}`, value);
  };

  const loadFixedFieldsFromLocalStorage = () => {
    const defaultData = getDefaultFormData();
    const savedReportPreparedBy = localStorage.getItem(
      "mcerts2_reportPreparedBy"
    );
    return {
      reportPreparedBy:
        (savedReportPreparedBy && savedReportPreparedBy.trim()) ||
        defaultData.reportPreparedBy ||
        "Siris Flow Inspections Ltd",
      statementOfCompliance:
        localStorage.getItem("mcerts2_statementOfCompliance") ||
        defaultData.statementOfCompliance,
      field1: localStorage.getItem("mcerts2_field1") || defaultData.field1,
      field2: localStorage.getItem("mcerts2_field2") || defaultData.field2,
      field3: localStorage.getItem("mcerts2_field3") || defaultData.field3,
    };
  };

  // Custom reset function that preserves fixed field values from localStorage
  const resetFormWithFixedFields = () => {
    const defaultData = getDefaultFormData();
    const fixedFields = loadFixedFieldsFromLocalStorage();

    setFormData({ ...defaultData, ...fixedFields });
  };

  // Custom dropdown component
  const CustomDropdown = ({
    value,
    onChange,
    options,
    defaultOptions,
    placeholder,
    isOpen,
    setIsOpen,
    onDelete,
    onAdd,
    addButtonTitle,
    className = "",
  }) => {
    return (
      <div className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-left focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {value || placeholder}
          <svg
            className={`absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
            <div className="max-h-60 overflow-y-auto">
              {options.map((option, index) => {
                const isDefault = defaultOptions.includes(option);
                return (
                  <div
                    key={index}
                    className="group flex items-center justify-between px-3 py-2 hover:bg-gray-50"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onChange(option);
                        setIsOpen(false);
                      }}
                      className="flex-1 text-left text-gray-700 hover:text-blue-600"
                    >
                      {option}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(option);
                      }}
                      className={`ml-2 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100 ${
                        isDefault
                          ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                      title={
                        isDefault
                          ? `Delete default ${option}`
                          : `Delete ${option}`
                      }
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
              <div className="border-t border-gray-200 px-3 py-2">
                <button
                  type="button"
                  onClick={onAdd}
                  className="flex w-full items-center justify-center rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-600 hover:bg-blue-100"
                  title={addButtonTitle}
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
                  Add New
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    setIsCreatingForm(true);

    try {
      const token = localStorage.getItem("userResposne");
      let result;

      // Convert images to base64 before sending
      const processedFormData = await convertImagesToBase64(formData);

      if (editingFormId) {
        // If editing existing form, just update it
        result = await formsService.updateForm(
          editingFormId,
          processedFormData,
          token
        );
      } else if (createdFormId) {
        // If we have a created form ID (from new form creation), update it
        result = await formsService.updateForm(
          createdFormId,
          processedFormData,
          token
        );
      } else {
        // Fallback: Create new form if no ID exists
        const payload = {
          formData: processedFormData,
          status: "Completed",
          userId: token,
        };
        // console.log("payload", payload);
        result = await formsService.createForm(payload, token);

        if (result.success && result.data) {
          // Handle nested response structure
          const responseData = result.data.data || result.data;
          if (responseData && responseData._id) {
            // Store the created form ID for background updates
            setCreatedFormId(responseData._id);
          }
        }
      }

      if (result.success) {
        await fetchForms();

        // Reset form state
        setShowFormModal(false);
        setEditingFormId(null);
        setCreatedFormId(null);
        setOriginalFormData(null);
        setHasUnsavedChanges(false);
        resetFormWithFixedFields();
      } else {
        // alert(`Error: ${result.error || "Failed to save form"}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // alert(`Error: ${handleApiError(error, "Failed to save form")}`);
    } finally {
      setIsCreatingForm(false);
    }
  };

  // Generate report function
  const handleGenerateReport = async () => {
    setIsGenerating(true);

    try {
      // Convert base64 data back to File objects for document generation
      const processedFormData = convertBase64ToFiles(formData);

      // Generate and download the document
      const result = await generateMCLERTSReport(processedFormData);

      if (result.success) {
        alert("Report generated and downloaded successfully!");
        await fetchForms();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("An error occurred while generating the report. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Download individual form function
  const handleDownloadForm = (formId) => {
    setConfirmModal({ isOpen: true, type: 'download', ids: [formId], isLoading: false });
  };

  const handleConfirmAction = async () => {
    const { type, ids } = confirmModal;
    setConfirmModal((prev) => ({ ...prev, isLoading: true }));

    if (type === 'delete') {
      setIsDeletingForm(true);
      try {
        const token = localStorage.getItem("userResposne");
        for (const id of ids) {
          const result = await formsService.deleteForm(id, token);
          if (
            result.success === true ||
            result.error === "Failed to execute 'json' on 'Response': Unexpected end of JSON input"
          ) {
            setForms((prev) => prev.filter((f) => (f._id || f.id) !== id));
            setSelectedForms((prev) => { const n = new Set(prev); n.delete(id); return n; });
          }
        }
        const msg = ids.length === 1 ? 'Form deleted successfully.' : `${ids.length} forms deleted successfully.`;
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(''), 4000);
      } catch (err) {
        console.error('Error deleting form(s):', err);
      } finally {
        setIsDeletingForm(false);
      }
    } else if (type === 'download') {
      try {
        const token = localStorage.getItem("token");
        for (const formId of ids) {
          setDownloadingFormId(formId);
          const formResponse = await formsService.getFormWithData(formId, token);
          if (!formResponse.success) continue;
          const processedFormData = convertBase64ToFiles(formResponse.data.formData);
          await generateMCLERTSReport(processedFormData);
        }
        const msg = ids.length === 1 ? 'Form downloaded successfully!' : `${ids.length} forms downloaded successfully!`;
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(''), 4000);
      } catch (err) {
        console.error('Error downloading form(s):', err);
      } finally {
        setDownloadingFormId(null);
      }
    }
    setConfirmModal((prev) => ({ ...prev, isOpen: false, isLoading: false }));
  };

  const handleToggleSelect = (id) => {
    setSelectedForms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedForms.size === forms.length && forms.length > 0) {
      setSelectedForms(new Set());
    } else {
      setSelectedForms(new Set(forms.map((f) => f._id || f.id)));
    }
  };

  const handleBulkDeleteClick = () => {
    if (selectedForms.size === 0) return;
    setConfirmModal({ isOpen: true, type: 'delete', ids: Array.from(selectedForms), isLoading: false });
  };

  // Modal functions
  const openModal = (target) => {
    setModalTarget(target);
    setModalValue("");
    setShowModal(true);
  };

  const closeAddModal = () => {
    setShowModal(false);
    setModalTarget("");
    setModalValue("");
  };

  const handleAddValue = () => {
    if (!modalValue.trim()) return;

    if (modalTarget === "inspector") {
      const newInspectors = [...inspectors, modalValue];
      updateInspectors(newInspectors);
      setFormData((prev) => ({ ...prev, inspector: modalValue }));
    } else if (modalTarget === "consentPermitHolder") {
      const newConsentList = [...consentList, modalValue];
      updateConsentList(newConsentList);
      setFormData((prev) => ({ ...prev, consentPermitHolder: modalValue }));
    } else if (modalTarget === "flowmeterType") {
      const newFlowTypes = [...flowTypes, modalValue];
      updateFlowTypes(newFlowTypes);
      setFormData((prev) => ({ ...prev, flowmeterType: modalValue }));
    } else if (modalTarget === "siteContact") {
      const newSiteContacts = [...siteContacts, modalValue];
      setSiteContacts(newSiteContacts);
      localStorage.setItem(
        "mcerts2_siteContacts",
        JSON.stringify(newSiteContacts)
      );
      setFormData((prev) => ({ ...prev, siteContact: modalValue }));
    } else if (modalTarget === "references") {
      const newReferences = [...(formData.references || []), modalValue];
      setFormData((prev) => ({ ...prev, references: newReferences }));
    }

    closeAddModal();
  };

  // Delete dropdown option function
  const handleDeleteDropdownOption = (target, value) => {
    if (target === "inspector") {
      const newInspectors = inspectors.filter((item) => item !== value);
      updateInspectors(newInspectors);

      if (formData.inspector === value) {
        setFormData((prev) => ({ ...prev, inspector: "" }));
      }
    } else if (target === "consentPermitHolder") {
      const newConsentList = consentList.filter((item) => item !== value);
      updateConsentList(newConsentList);

      if (formData.consentPermitHolder === value) {
        setFormData((prev) => ({ ...prev, consentPermitHolder: "" }));
      }
    } else if (target === "flowmeterType") {
      const newFlowTypes = flowTypes.filter((item) => item !== value);
      updateFlowTypes(newFlowTypes);

      if (formData.flowmeterType === value) {
        setFormData((prev) => ({ ...prev, flowmeterType: "" }));
      }
    } else if (target === "siteContact") {
      const newSiteContacts = siteContacts.filter((item) => item !== value);
      setSiteContacts(newSiteContacts);
      localStorage.setItem(
        "mcerts2_siteContacts",
        JSON.stringify(newSiteContacts)
      );

      if (formData.siteContact === value) {
        setFormData((prev) => ({ ...prev, siteContact: "" }));
      }
    }
  };

  // Excel upload functionality
  const handleExcelUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Validate file type
      if (!validateExcelFile(file)) {
        alert("Please upload a valid Excel file (.xlsx, .xls, or .csv)");
        return;
      }

      // Show loading state
      setIsGenerating(true);

      // Extract and console full uncertainty sheet data
      console.log("=== EXTRACTING FULL UNCERTAINTY SHEET DATA ===");
      const uncertaintyData = await extractUncertaintySheetData(file);
      console.log("Full Uncertainty Sheet Data:", uncertaintyData);

      // Process the Excel file
      const excelData = await processExcelFile(file);
      console.log("=== EXCEL PROCESSING DEBUG ===");
      console.log("Raw extracted Excel data:", excelData);
      console.log(
        "Looking for siteName in extracted data:",
        excelData.siteName
      );
      console.log("Looking for E4 data:", excelData);

      // Map Excel data to form structure
      const mappedData = mapExcelDataToForm(excelData);
      console.log("Mapped form data:", mappedData);
      console.log("Site name in mapped data:", mappedData.siteName);

      // Override uncertainty value with F104 rawValue from uncertainty sheet
      if (
        uncertaintyData.f104RawValue !== null &&
        uncertaintyData.f104RawValue !== undefined
      ) {
        const uncertaintyValue = String(uncertaintyData.f104RawValue);
        mappedData.uncertainty = uncertaintyValue;
        mappedData.conclusionUnCert = uncertaintyValue; // Set the same value for conclusion
        console.log(`=== OVERRIDING UNCERTAINTY VALUE ===`);
        console.log(`Using F104 rawValue: "${uncertaintyData.f104RawValue}"`);
        console.log(`Mapped uncertainty: "${mappedData.uncertainty}"`);
        console.log(
          `Mapped conclusionUnCert: "${mappedData.conclusionUnCert}"`
        );
        console.log(`=== END UNCERTAINTY OVERRIDE ===`);
      }

      // Extract F2 date from uncertainty sheet - for Conclusions 6.0 "Date used for dry weather data"
      if (
        uncertaintyData.columnData &&
        uncertaintyData.columnData["F"] &&
        uncertaintyData.columnData["F"][2]
      ) {
        const f2Cell = uncertaintyData.columnData["F"][2];
        const f2Value = f2Cell.value || f2Cell.rawValue;
        
        if (f2Value !== null && f2Value !== undefined) {
          // Handle Excel date serial numbers
          if (typeof f2Value === "number") {
            const excelDate = new Date((f2Value - 25569) * 86400 * 1000);
            mappedData.conclusionUncertaintySheetF2 = excelDate.toISOString().split("T")[0]; // YYYY-MM-DD format
          } else {
            mappedData.conclusionUncertaintySheetF2 = String(f2Value);
          }
          console.log(`=== EXTRACTING F2 DATE FROM UNCERTAINTY SHEET ===`);
          console.log(`F2 raw value: "${f2Value}"`);
          console.log(`Mapped conclusionUncertaintySheetF2: "${mappedData.conclusionUncertaintySheetF2}"`);
          console.log(`=== END F2 DATE EXTRACTION ===`);
        }
      }

      // Log conclusion date extraction
      console.log(`=== CONCLUSION DATE EXTRACTION ===`);
      console.log(`Mapped conclusionDate: "${mappedData.conclusionDate}"`);
      console.log(`Mapped conclusionUncertaintySheetF2: "${mappedData.conclusionUncertaintySheetF2}"`);
      console.log(`=== END CONCLUSION DATE EXTRACTION ===`);

      console.log("=== END DEBUG ===");

      // Update form data with extracted values
      // IMPORTANT: Preserve permanent fields (field1, field2, field3) - they should never be overwritten by Excel
      setFormData((prev) => {
        // Remove permanent fields from mappedData if they somehow got included
        const { field1, field2, field3, ...excelMappedData } = mappedData;

        return {
          ...prev,
          ...excelMappedData,
          // Explicitly preserve permanent fields from previous state (these are "Permanent" in the form)
          field1: prev.field1,
          field2: prev.field2,
          field3: prev.field3,
        };
      });

      // // Show success message
      // const extractedFields = Object.keys(mappedData).filter(
      //   (key) => !key.startsWith("_")
      // ).length;
      // const extractedFieldsList = Object.keys(mappedData)
      //   .filter((key) => !key.startsWith("_"))
      //   .map((key) => `- ${key}: ${mappedData[key]}`)
      //   .join("\n");
    } catch (error) {
      console.error("Error processing Excel file:", error);
      alert(
        `Error processing Excel file: ${error.message}\n\nPlease check that your file contains the expected data in the correct cells (E4, E7, E8, E9, E14, f104).`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const closeModal = () => {
    // Check for unsaved changes before closing
    if (hasUnsavedChanges) {
      setShowUnsavedChangesModal(true);
      return;
    }

    // Close modal if no unsaved changes
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowFormModal(false);
    setEditingFormId(null);
    setCreatedFormId(null);
    setOriginalFormData(null);
    setHasUnsavedChanges(false);
    resetFormWithFixedFields();
    setIsGenerating(false);
    setIsCreatingForm(false);
  };

  const handleSaveAndClose = async () => {
    // Save the form first, then close
    try {
      await handleSubmitForm({ preventDefault: () => {} });
      setShowUnsavedChangesModal(false);
    } catch (error) {
      console.error("Error saving form before close:", error);
      alert("Error saving form. Please try again.");
    }
  };

  const handleDiscardChanges = () => {
    setShowUnsavedChangesModal(false);
    handleCloseModal();
  };

  const handleCloseWarningModal = () => {
    setShowUnsavedChangesModal(false);
    // Don't close the form modal - just close the warning
  };

  return (
    <div className="mb-8 mt-12 flex flex-col gap-12">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Forms Management 3
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Create and manage your forms - Form 3
            </p>
          </div>
          <Button
            onClick={handleAddNewForm}
            className="rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-600"
          >
            + Add New Form
          </Button>
        </div>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="flex items-center justify-between rounded-lg bg-green-50 p-4 text-green-700 dark:bg-green-900/20 dark:text-green-400">
          <div className="flex items-center">
            <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="ml-4 text-green-600 hover:text-green-800 dark:hover:text-green-200">✕</button>
        </div>
      )}

      {/* Forms Table */}
      <FormsTable3
        isLoadingForms={isLoadingForms}
        error={error}
        fetchForms={fetchForms}
        forms={forms}
        handleEditForm={handleEditForm}
        isLoadingFormById={isLoadingFormById}
        handleDownloadForm={handleDownloadForm}
        downloadingFormId={downloadingFormId}
        handleDeleteForm={handleDeleteForm}
        isDeletingForm={isDeletingForm}
        currentPage={currentPage}
        limit={limit}
        totalItems={totalItems}
        hasPrev={hasPrev}
        handlePreviousPage={handlePreviousPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        hasNext={hasNext}
        handleNextPage={handleNextPage}
        handleAddNewForm={handleAddNewForm}
        selectedIds={selectedForms}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onBulkDelete={handleBulkDeleteClick}
      />

      {/* Form Modal */}
      <FormModal3
        isOpen={showFormModal}
        editingFormId={editingFormId}
        handleExcelUpload={handleExcelUpload}
        closeModal={closeModal}
        compressionStatus={compressionStatus}
        compressionProgress={compressionProgress}
        handleSubmitForm={handleSubmitForm}
        formData={formData}
        handleInputChangeWithBackgroundUpdate={
          handleInputChangeWithBackgroundUpdate
        }
        setFormData={setFormData}
        inspectors={inspectors}
        defaultOptions={defaultOptions}
        isInspectorDropdownOpen={isInspectorDropdownOpen}
        setIsInspectorDropdownOpen={setIsInspectorDropdownOpen}
        handleDeleteDropdownOption={handleDeleteDropdownOption}
        openModal={openModal}
        CustomDropdown={CustomDropdown}
        consentList={consentList}
        isConsentDropdownOpen={isConsentDropdownOpen}
        setIsConsentDropdownOpen={setIsConsentDropdownOpen}
        siteContacts={siteContacts}
        isSiteContactDropdownOpen={isSiteContactDropdownOpen}
        setIsSiteContactDropdownOpen={setIsSiteContactDropdownOpen}
        setModalTarget={setModalTarget}
        setModalValue={setModalValue}
        setShowModal={setShowModal}
        handleAddPhotos={handleAddPhotos}
        handleRemovePhoto={handleRemovePhoto}
        handleImageCaptionChange={handleImageCaptionChange}
        flowTypes={flowTypes}
        isFlowTypeDropdownOpen={isFlowTypeDropdownOpen}
        setIsFlowTypeDropdownOpen={setIsFlowTypeDropdownOpen}
        signatureIncluded={signatureIncluded}
        setSignatureIncluded={setSignatureIncluded}
        handleGenerateReport={handleGenerateReport}
        isCreatingForm={isCreatingForm}
        isGenerating={isGenerating}
        getImagePreview={getImagePreview}
      />

      {/* Add Value Modal */}
      <AddValueModal2
        isOpen={showModal}
        onClose={closeAddModal}
        value={modalValue}
        onChange={(e) => setModalValue(e.target.value)}
        onAdd={handleAddValue}
      />

      {/* Unsaved Changes Confirmation Modal */}
      <UnsavedChangesModal2
        isOpen={showUnsavedChangesModal}
        onClose={handleCloseWarningModal}
        onDiscard={handleDiscardChanges}
        onSave={handleSaveAndClose}
        isSaving={isCreatingForm}
      />

      {/* Image Editor Modal */}
      <ImageEditorModal2
        isOpen={imageEditorModal.isOpen}
        imageFile={imageEditorModal.file}
        onSave={handleSaveEditedImage}
        onCancel={handleCancelImageEditor}
      />

      {/* Confirm Action Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => !confirmModal.isLoading && setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAction}
        title={
          confirmModal.type === 'delete'
            ? confirmModal.ids.length > 1 ? 'Delete Forms' : 'Delete Form'
            : confirmModal.ids.length > 1 ? 'Download Forms' : 'Download Form'
        }
        message={
          confirmModal.type === 'delete'
            ? confirmModal.ids.length > 1
              ? `Are you sure you want to delete ${confirmModal.ids.length} forms? This action cannot be undone.`
              : 'Are you sure you want to delete this form? This action cannot be undone.'
            : confirmModal.ids.length > 1
              ? `Download ${confirmModal.ids.length} selected forms?`
              : 'Download this form?'
        }
        confirmLabel={confirmModal.type === 'delete' ? 'Delete' : 'Download'}
        type={confirmModal.type === 'delete' ? 'danger' : 'success'}
        isLoading={confirmModal.isLoading}
      />
    </div>
  );
};

export default Form2Page;
