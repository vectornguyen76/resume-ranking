import React, { PropsWithChildren } from "react";
import "./dashboard.css"; // Import CSS stylesheet for styling

import SidebarDashboard from "./components/layouts/SidebarDashboard";
import FooterDashboard from "./components/layouts/FooterDashboard";
import NavbarDashboard from "./components/layouts/NavbarDashboard";

const DashboardLayout = async (props: PropsWithChildren) => {
  return (
    <>
      {/* Display the top navbar */}
      <NavbarDashboard />

      {/* Main dashboard layout */}
      <div className="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Display the sidebar */}
        <SidebarDashboard />

        {/* Main content area */}
        <div
          id="main-content"
          className="relative w-full h-full overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900"
        >
          <main>
            {props.children} {/* Render the children components */}
          </main>

          {/* Display the footer */}
          <FooterDashboard />
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
