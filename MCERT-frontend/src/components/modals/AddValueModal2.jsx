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

const AddValueModal = ({ isOpen, onClose, value, onChange, onAdd }) => {
  if (!isOpen) return null;

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onAdd();
    }
  };

  return (
    <div className="bg-black fixed inset-0 z-[9999] flex items-center justify-center bg-opacity-35">
      <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg">
        <h4 className="mb-2 text-lg font-semibold text-gray-800">Add item</h4>
        <div className="mb-3 text-xs text-gray-500">
          Add a new value to the list. This updates only the demo list in this
          session.
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder="Enter value"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            onKeyPress={handleKeyPress}
          />
          <Button
            onClick={onAdd}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Add
          </Button>
        </div>
        <div className="mt-3 flex justify-end">
          <Button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddValueModal;
