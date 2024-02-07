import { ReactNode } from "react";
import { MdWork, MdPersonSearch, MdPeopleAlt } from "react-icons/md";

interface Menu {
  title: string;
  link?: string;
  icon: ReactNode;
  subMenu?: SubMenu[];
}

interface SubMenu {
  title: string;
  link: string;
  icon: ReactNode;
}

export const SidebarDataDashboard: Menu[] = [
  {
    title: "Jobs",
    link: "/dashboard/jobs",
    icon: <MdWork style={{ width: "24px", height: "24px" }} />,
  },
  {
    title: "Candidates",
    link: "/dashboard/candidates",
    icon: <MdPeopleAlt style={{ width: "24px", height: "24px" }} />,
  },
  {
    title: "Matching",
    link: "/dashboard/matching",
    icon: <MdPersonSearch style={{ width: "24px", height: "24px" }} />,
  },
];
