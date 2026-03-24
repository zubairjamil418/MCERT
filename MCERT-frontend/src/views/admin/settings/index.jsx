import React from "react";

const Settings = () => {
  return (
    <div className="mt-3 grid grid-cols-1 gap-5">
      <div className="rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:shadow-none">
        <h2 className="text-xl font-bold text-navy-700 dark:text-white">
          Settings
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Configure your application settings here.
        </p>
      </div>
    </div>
  );
};

export default Settings; 