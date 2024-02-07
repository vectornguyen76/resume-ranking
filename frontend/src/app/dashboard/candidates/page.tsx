// Import required modules and components
"use client";
import React, { useEffect } from "react";
import HeadMain from "@/app/components/HeadMain";
import BreadcrumbDashboard from "@/app/dashboard/components/layouts/BreadcrumbDashboard";
import UploadZoneComponent from "@/app/dashboard/components/upload/UploadZoneComponent";
import { useListCandidateData } from "@/app/hooks/react-query/management/file/useFilesUploadData";
import { Skeleton } from "@mui/material";
import dynamic from "next/dynamic";

// Dynamically import the TableListFile component
const TableListFile = dynamic(() =>
  import("../components/table/TableCandidates").then((mod) => mod.default)
);

// FilesManagementDetail2 component
const FilesManagementDetail = () => {
  // Fetch file data using the useListFileData hook
  const { data, isLoading, isError, refetch } = useListCandidateData(1, 10);

  return (
    <>
      {/* Set the title and meta description of the page */}
      <HeadMain
        title="Candidates - Management | Dashboard - Jobfit"
        description="Dashboard - Jobfit"
      />

      {/* Display the breadcrumb */}
      <BreadcrumbDashboard title={`Candidates`} />

      {/* Main content of the CV management detail page */}
      <div className="px-4 pt-6">
        {/* UploadZoneComponent for uploading files */}
        <UploadZoneComponent refetch={refetch} />

        <div className="mt-4 p-4 text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-white dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <div className="font-bold text-lg">List candidates uploaded</div>
          <div id="list-candidate" className="mt-4">
            <div className="flex flex-col mt-6">
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden shadow">
                    {/* Conditionally render loading state or TableListFile */}
                    {isLoading || isError ? (
                      <>
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height={200}
                        />
                      </>
                    ) : (
                      <TableListFile data={data} refetch={refetch} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilesManagementDetail;
