import React from "react";

// Simple Button component
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

const UnsavedChangesModal = ({
  isOpen,
  onClose,
  onDiscard,
  onSave,
  isSaving = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Unsaved Changes
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              You have unsaved changes. Do you want to save or discard them?
            </p>
          </div>
          <Button
            onClick={onClose}
            className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            title="Close"
          >
            ✕
          </Button>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            onClick={onDiscard}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Discard
          </Button>
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesModal;
