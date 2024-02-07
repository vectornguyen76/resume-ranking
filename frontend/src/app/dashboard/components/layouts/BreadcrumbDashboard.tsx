import React from "react";

type Props = {
  title: string;
};

const BreadcrumbDashboard = (props: Props) => {
  return (
    <div className="px-4 pt-6 mt-2">
      <div className="font-bold text-xl p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-white dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <h1>{props.title}</h1>
      </div>
    </div>
  );
};

export default BreadcrumbDashboard;
