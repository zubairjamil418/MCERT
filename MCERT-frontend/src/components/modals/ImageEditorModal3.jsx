import React, { useEffect, useRef, useState } from "react";
import ImageEditor from "tui-image-editor";
import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";

const ImageEditorModal = ({ isOpen, imageFile, onSave, onCancel }) => {
  const editorRef = useRef(null);
  const imageEditorRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const initializeEditor = async () => {
      try {
        // Convert file to data URL
        const dataUrl = await fileToDataURL(imageFile);

        const options = {
          includeUI: {
            loadImage: {
              path: dataUrl,
              name: imageFile.name,
            },
            theme: {
              "common.bi.image": "",
              "common.bisize.width": "251px",
              "common.bisize.height": "21px",
              "common.backgroundImage": "none",
              "common.backgroundColor": "#fff",
              "common.border": "1px solid #c1c1c1",
              "header.backgroundImage": "none",
              "header.backgroundColor": "transparent",
              "header.border": "0px",
              "loadButton.backgroundColor": "#fff",
              "loadButton.border": "1px solid #ddd",
              "loadButton.color": "#222",
              "loadButton.fontFamily": "'Noto Sans', sans-serif",
              "loadButton.fontSize": "12px",
              "downloadButton.backgroundColor": "#fdba3b",
              "downloadButton.border": "1px solid #fdba3b",
              "downloadButton.color": "#fff",
              "downloadButton.fontFamily": "'Noto Sans', sans-serif",
              "downloadButton.fontSize": "12px",
              "menu.normalIcon.color": "#8a8a8a",
              "menu.activeIcon.color": "#555555",
              "menu.disabledIcon.color": "#434343",
              "menu.hoverIcon.color": "#e9e9e9",
              "menu.iconSize.width": "24px",
              "menu.iconSize.height": "24px",
              "menu.submenu.backgroundColor": "#1e1e1e",
              "menu.submenu.partition.color": "#858585",
              "menu.submenu.normalIcon.color": "#8a8a8a",
              "menu.submenu.normalLabel.color": "#8a8a8a",
              "menu.submenu.normalLabel.fontWeight": "lighter",
              "menu.submenu.activeIcon.color": "#e9e9e9",
              "menu.submenu.activeLabel.color": "#fff",
              "menu.submenu.activeLabel.fontWeight": "lighter",
              "menu.submenu.hoverIcon.color": "#e9e9e9",
              "menu.submenu.hoverLabel.color": "#fff",
              "menu.submenu.hoverLabel.fontWeight": "lighter",
              "menu.submenu.disabledIcon.color": "#434343",
              "menu.submenu.disabledLabel.color": "#434343",
              "menu.submenu.disabledLabel.fontWeight": "lighter",
              "menu.submenu.separator.color": "#858585",
              "menu.submenu.separator.border": "1px solid #858585",
              "checkbox.border": "1px solid #ccc",
              "checkbox.backgroundColor": "#fff",
              "range.pointer.color": "#fff",
              "range.pointer.border": "1px solid #ccc",
              "range.bar.color": "#666",
              "range.subbar.color": "#d1d1d1",
              "range.disabledPointer.color": "#ccc",
              "range.disabledBar.color": "#444",
              "range.disabledSubbar.color": "#444",
              "range.value.color": "#000",
              "range.value.fontWeight": "lighter",
              "range.value.fontSize": "11px",
              "range.value.border": "1px solid #ccc",
              "range.value.backgroundColor": "#f5f5f5",
              "range.title.color": "#000",
              "range.title.fontWeight": "lighter",
              "colorpicker.button.border": "1px solid #1e1e1e",
              "colorpicker.title.color": "#fff",
            },
            menu: [
              "crop",
              // "flip",
              "rotate",
              // "draw",
              // "shape",
              // "icon",
              // "text",
              // "mask",
              "filter",
            ],
            initMenu: "crop",
            uiSize: {
              width: "100%",
              height: "700px",
            },
            menuBarPosition: "bottom",
          },
          cssMaxWidth: 1000,
          cssMaxHeight: 1000,
          selectionStyle: {
            cornerSize: 20,
            rotatingPointOffset: 70,
          },
        };

        imageEditorRef.current = new ImageEditor(editorRef.current, options);
      } catch (error) {
        console.error("Error initializing image editor:", error);
        alert("Failed to load image editor. Please try again.");
        onCancel();
      }
    };

    if (isOpen && imageFile && !imageEditorRef.current) {
      initializeEditor();
    }

    return () => {
      if (imageEditorRef.current) {
        imageEditorRef.current.destroy();
        imageEditorRef.current = null;
      }
    };
  }, [isOpen, imageFile, onCancel]);

  const fileToDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSave = async () => {
    if (!imageEditorRef.current) {
      alert("No image to save");
      return;
    }

    try {
      setIsSaving(true);

      // Get the edited image as a data URL
      const dataURL = imageEditorRef.current.toDataURL();

      // Convert data URL to blob
      const response = await fetch(dataURL);
      const blob = await response.blob();

      // Create a new File object
      const editedFile = new File([blob], imageFile.name, {
        type: imageFile.type,
        lastModified: Date.now(),
      });

      await onSave(editedFile);
    } catch (error) {
      console.error("Error saving edited image:", error);
      alert("Failed to save edited image. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isSaving) return;
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="bg-black/80 fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="w-full max-w-7xl rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-2">
          <h2 className="text-xl font-bold text-gray-800">Edit Image</h2>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* TUI Image Editor */}
        <div className="p-2">
          <div ref={editorRef} className="tui-image-editor"></div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSaving}
            className="rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg bg-blue-500 px-6 py-2 font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
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
                <span>Processing...</span>
              </div>
            ) : (
              "Save & Continue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorModal;
