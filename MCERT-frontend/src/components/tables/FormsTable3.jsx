import React from "react";
import Card from "../card";

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

const FormsTable = ({
  isLoadingForms,
  error,
  fetchForms,
  forms,
  handleEditForm,
  isLoadingFormById,
  handleDownloadForm,
  downloadingFormId,
  handleDeleteForm,
  isDeletingForm,
  currentPage,
  limit,
  totalItems,
  hasPrev,
  handlePreviousPage,
  totalPages,
  handlePageChange,
  hasNext,
  handleNextPage,
  handleAddNewForm,
  selectedIds = new Set(),
  onToggleSelect,
  onToggleSelectAll,
  onBulkDelete,
}) => {
  const allSelected = forms.length > 0 && selectedIds.size === forms.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < forms.length;
  return (
    <Card extra="w-full p-6">
      {isLoadingForms && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <svg
              className="h-6 w-6 animate-spin text-blue-500"
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
            <span className="text-gray-600 dark:text-gray-300">
              Loading forms...
            </span>
          </div>
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          <div className="flex items-center">
            <svg
              className="mr-2 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
          <button
            onClick={fetchForms}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}
      {!isLoadingForms && !error && (
        <>
          {selectedIds.size > 0 && (
            <div className="mb-4 flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3 dark:bg-blue-900/20">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {selectedIds.size} form{selectedIds.size !== 1 ? "s" : ""} selected
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={onBulkDelete}
                  disabled={isDeletingForm}
                  className="rounded-md bg-red-100 px-3 py-1.5 text-sm text-red-700 transition-colors hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-800/40"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="w-10 px-4 py-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected; }}
                    onChange={onToggleSelectAll}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                  />
                </th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Site Name
                </th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Inspector
                </th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Date of Inspection
                </th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Created Date
                </th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {forms.map((form) => (
                <tr
                  key={form._id}
                  className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
                >
                  <td className="w-10 px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(form._id || form.id)}
                      onChange={() => onToggleSelect(form._id || form.id)}
                      className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {form?.siteName?.charAt(0) || "F"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {form?.siteName || "Unnamed Site"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {form._id || form.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {form?.inspector || "Not specified"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        form.status === "approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : form.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {form.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {form?.dateOfInspection || "Not specified"}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {form.createdDate}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleEditForm(form._id || form.id)}
                        disabled={isLoadingFormById}
                        className={`rounded-md px-3 py-1.5 text-sm transition-colors duration-200 ${
                          isLoadingFormById
                            ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                        }`}
                      >
                        {isLoadingFormById ? "Loading..." : "Edit"}
                      </Button>
                      <Button
                        onClick={() => handleDownloadForm(form._id || form.id)}
                        disabled={downloadingFormId === (form._id || form.id)}
                        className={`rounded-md px-3 py-1.5 text-sm transition-colors duration-200 ${
                          downloadingFormId === (form._id || form.id)
                            ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
                            : "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                        }`}
                      >
                        {downloadingFormId === (form._id || form.id)
                          ? "Downloading..."
                          : "Download"}
                      </Button>
                      <Button
                        onClick={() => handleDeleteForm(form._id || form.id)}
                        disabled={isDeletingForm}
                        className={`rounded-md px-3 py-1.5 text-sm transition-colors duration-200 ${
                          isDeletingForm
                            ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
                            : "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                        }`}
                      >
                        {isDeletingForm ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
      {forms.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-4 dark:border-gray-700">
          {/* Pagination Info */}
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {(currentPage - 1) * limit + 1} to{" "}
            {Math.min(currentPage * limit, totalItems)} of {totalItems} results
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={handlePreviousPage}
              disabled={!hasPrev || currentPage <= 1}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                !hasPrev || currentPage <= 1
                  ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  const isActive = page === currentPage;
                  console.log(
                    `Page ${page}: isActive=${isActive}, currentPage=${currentPage}, type: ${typeof currentPage}`
                  );
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white dark:bg-blue-500"
                          : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextPage}
              disabled={!hasNext || currentPage >= totalPages}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                !hasNext || currentPage >= totalPages
                  ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoadingForms && !error && forms.length === 0 && (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
            No forms yet
          </h3>
          <p className="mb-4 text-gray-500 dark:text-gray-400">
            Get started by creating your first form
          </p>
          <Button
            onClick={handleAddNewForm}
            className="rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-600"
          >
            Create Your First Form
          </Button>
        </div>
      )}
    </Card>
  );
};

export default FormsTable;
