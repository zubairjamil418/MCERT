import React from "react";
import Card from "components/card";

const Settings = () => {
  return (
    <div className="mt-3 grid grid-cols-1 gap-5">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-navy-700 dark:text-white">
          Settings
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Configure your application settings here.
        </p>
      </Card>
    </div>
  );
};

export default Settings; 