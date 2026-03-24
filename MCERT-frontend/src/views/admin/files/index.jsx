import React, { useState, useRef } from "react";
import {
  MdFileUpload,
  MdFolder,
  MdInsertDriveFile,
  MdDelete,
  MdDownload,
  MdVisibility,
} from "react-icons/md";
import Card from "components/card";

const Files = () => {
  const [files, setFiles] = useState([
    {
      id: 1,
      name: "document.pdf",
      size: "2.4 MB",
      type: "pdf",
      uploadDate: "2024-01-15",
    },
    {
      id: 2,
      name: "spreadsheet.xlsx",
      size: "1.2 MB",
      type: "xlsx",
      uploadDate: "2024-01-14",
    },
    {
      id: 3,
      name: "presentation.pptx",
      size: "5.8 MB",
      type: "pptx",
      uploadDate: "2024-01-13",
    },
    {
      id: 4,
      name: "image.jpg",
      size: "800 KB",
      type: "jpg",
      uploadDate: "2024-01-12",
    },
  ]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFiles = (fileList) => {
    const newFiles = fileList.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.name.split(".").pop().toLowerCase(),
      uploadDate: new Date().toISOString().split("T")[0],
    }));

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type) => {
    const iconClass = "h-8 w-8";
    switch (type) {
      case "pdf":
        return <MdInsertDriveFile className={`${iconClass} text-red-500`} />;
      case "xlsx":
      case "xls":
        return <MdInsertDriveFile className={`${iconClass} text-green-500`} />;
      case "pptx":
      case "ppt":
        return <MdInsertDriveFile className={`${iconClass} text-orange-500`} />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <MdInsertDriveFile className={`${iconClass} text-purple-500`} />;
      default:
        return <MdInsertDriveFile className={`${iconClass} text-gray-500`} />;
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const deleteFile = (id) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const downloadFile = (fileName) => {
    // Simulate file download
    alert(`Downloading ${fileName}...`);
  };

  const viewFile = (fileName) => {
    // Simulate file preview
    alert(`Viewing ${fileName}...`);
  };

  return (
    <div className="mt-3 grid grid-cols-1 gap-5">
      {/* Upload Section */}
      <Card className="p-6">
        <h2 className="mb-4 text-2xl font-bold text-navy-700 dark:text-white">
          File Manager
        </h2>

        {/* Upload Area */}
        <div
          className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            dragActive
              ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
              : "border-gray-300 hover:border-brand-400 dark:border-gray-600"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInputChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />

          <MdFileUpload className="mx-auto mb-4 h-16 w-16 text-gray-400 dark:text-gray-300" />
          <h3 className="mb-2 text-lg font-medium text-gray-700 dark:text-gray-200">
            Drop files here or click to upload
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Support for all file types up to 10MB
          </p>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 rounded-lg bg-brand-500 px-6 py-2 text-white transition-colors hover:bg-brand-600"
          >
            Choose Files
          </button>
        </div>
      </Card>

      {/* Files List */}
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-navy-700 dark:text-white">
            Uploaded Files ({files.length})
          </h3>
          <div className="flex items-center space-x-2">
            <MdFolder className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Total:{" "}
              {files
                .reduce((acc, file) => acc + parseFloat(file.size), 0)
                .toFixed(1)}{" "}
              MB
            </span>
          </div>
        </div>

        {files.length === 0 ? (
          <div className="py-12 text-center">
            <MdFolder className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">
              No files uploaded yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:bg-navy-700 dark:hover:bg-navy-600"
              >
                <div className="flex items-center space-x-4">
                  {getFileIcon(file.type)}
                  <div>
                    <h4 className="font-medium text-navy-700 dark:text-white">
                      {file.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {file.size} • Uploaded on {file.uploadDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => viewFile(file.name)}
                    className="rounded-lg p-2 text-blue-500 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    title="View file"
                  >
                    <MdVisibility className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => downloadFile(file.name)}
                    className="rounded-lg p-2 text-green-500 transition-colors hover:bg-green-100 dark:hover:bg-green-900/30"
                    title="Download file"
                  >
                    <MdDownload className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-100 dark:hover:bg-red-900/30"
                    title="Delete file"
                  >
                    <MdDelete className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Files;
