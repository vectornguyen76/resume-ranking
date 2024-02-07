"use client";

import React, { useState, ReactNode, useEffect } from "react";
import { SidebarDataDashboard } from "../data/SidebarDataDashboard";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCommentAlt } from "react-icons/fa";

type Props = {};

const ActiveLink = ({
  href,
  icon,
  title,
  isChild,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  isChild?: boolean;
}) => {
  const routerPath = usePathname();
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    setIsActive(routerPath === href);
  }, [routerPath, href]);

  const classNameInActive =
    "flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700";
  const classNameActive =
    "flex items-center p-2 text-base font-bold text-white bg-sky-600 dark:bg-gray-700 rounded-lg hover:bg-blue-600 group dark:text-gray-200 dark:hover:bg-gray-700";

  const classNameChildActive =
    "flex items-center p-2 text-base font-bold text-white bg-sky-600 dark:bg-gray-700 transition duration-75 rounded-lg pl-11 group hover:bg-blue-600 dark:text-gray-200 dark:hover:bg-gray-700";
  const classNameInChildActive =
    "flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700";

  return (
    <>
      {!isChild ? (
        <Link
          href={href}
          className={isActive ? classNameActive : classNameInActive}
        >
          {icon}
          <span className="ml-3">{title}</span>
        </Link>
      ) : (
        <Link
          href={href}
          className={isActive ? classNameChildActive : classNameInChildActive}
        >
          <div className="mr-2">{icon}</div>
          {title}
        </Link>
      )}
    </>
  );
};

const SidebarDashboard = (props: Props) => {
  const [updatedSubMenuLS, setUpdatedSubMenuLS] = useState<number[]>([]);
  const [isLocalStorageUpdated, setIsLocalStorageUpdated] =
    useState<boolean>(false);
  const [showSubMenu, setShowSubMenu] = useState(
    new Array(SidebarDataDashboard.length).fill(false)
  );

  const setLocalStorage = (value: number[]) => {
    localStorage.setItem("updatedSubMenu", JSON.stringify(value));
    setUpdatedSubMenuLS(value);
  };

  const handleParentClick = async (index: number) => {
    const updatedSubMenu = [...showSubMenu];
    updatedSubMenu[index] = !updatedSubMenu[index];
    setShowSubMenu(updatedSubMenu);

    if (updatedSubMenu[index]) {
      setLocalStorage([...updatedSubMenuLS, index]);
    } else {
      setLocalStorage(updatedSubMenuLS.filter((i) => i !== index));
    }
  };

  useEffect(() => {
    const updatedSubMenuLS = JSON.parse(
      localStorage.getItem("updatedSubMenu") || "[]"
    );
    if (updatedSubMenuLS.length > 0) {
      setShowSubMenu(
        new Array(SidebarDataDashboard.length)
          .fill(false)
          .map((_, index) => updatedSubMenuLS.includes(index))
      );
      setUpdatedSubMenuLS(updatedSubMenuLS);
      setIsLocalStorageUpdated(true);
    }
  }, []);

  useEffect(() => {
    if (!isLocalStorageUpdated) {
      const updatedSubMenuLS = JSON.parse(
        localStorage.getItem("updatedSubMenu") || "[]"
      );
      setShowSubMenu(
        new Array(SidebarDataDashboard.length)
          .fill(false)
          .map((_, index) => updatedSubMenuLS.includes(index))
      );
    }
  }, [isLocalStorageUpdated]);

  return (
    <>
      <div className="flex">
        <aside
          id="sidebar"
          className="fixed top-0 left-0 z-20  flex-col flex-shrink-0 hidden w-64 h-full pt-16 font-normal duration-75 lg:flex transition-width"
        >
          <div className="relative flex flex-col flex-1 min-h-0 pt-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
              <div className="flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {/* Sidebar Menu */}
                <ul className="pb-2 space-y-2">
                  {/* <a
                    href="/private-chat"
                    className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    <FaCommentAlt />
                    <span className="ml-3">Private Chatbot</span>
                  </a> */}
                  {SidebarDataDashboard.map((item, index) => (
                    <React.Fragment key={index}>
                      {!item.link ? (
                        <li>
                          <button
                            type="button"
                            className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                            aria-controls={`dropdown-${index}`}
                            data-collapse-toggle={`dropdown-${index}`}
                            onClick={() => handleParentClick(index)}
                          >
                            {item.icon}
                            <span className="flex-1 ml-3 text-left whitespace-nowrap">
                              {item.title}
                            </span>
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </button>
                          {showSubMenu[index] && (
                            <ul className="py-2 space-y-2">
                              {item.subMenu?.map((item) => (
                                <li key={item.link}>
                                  <ActiveLink
                                    href={item.link}
                                    icon={item.icon}
                                    title={item.title}
                                    isChild={true}
                                  />
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ) : (
                        <li>
                          <ActiveLink
                            href={item.link}
                            icon={item.icon}
                            title={item.title}
                          />
                        </li>
                      )}
                    </React.Fragment>
                  ))}
                </ul>
              </div>
            </div>
            {/* Sidebar bottom menu */}
            {/* <div className="absolute bottom-0 left-0 justify-center hidden w-full p-4 space-x-4 bg-white lg:flex dark:bg-gray-800">
              <a
                href="#"
                className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"></path>
                </svg>
              </a>
              <a
                href="#"
                data-tooltip-target="tooltip-settings"
                className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              <button
                type="button"
                data-dropdown-toggle="language-dropdown"
                className="inline-flex justify-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <svg
                  className="h-5 w-5 rounded-full mt-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 3900 3900"
                >
                  <path fill="#b22234" d="M0 0h7410v3900H0z" />
                  <path
                    d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0"
                    stroke="#fff"
                    strokeWidth="300"
                  />
                  <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
                  <g fill="#fff">
                    <g id="d">
                      <g id="c">
                        <g id="e">
                          <g id="b">
                            <path
                              id="a"
                              d="M247 90l70.534 217.082-184.66-134.164h228.253L176.466 307.082z"
                            />
                            <use xlinkHref="#a" y="420" />
                            <use xlinkHref="#a" y="840" />
                            <use xlinkHref="#a" y="1260" />
                          </g>
                          <use xlinkHref="#a" y="1680" />
                        </g>
                        <use xlinkHref="#b" x="247" y="210" />
                      </g>
                      <use xlinkHref="#c" x="494" />
                    </g>
                    <use xlinkHref="#d" x="988" />
                    <use xlinkHref="#c" x="1976" />
                    <use xlinkHref="#e" x="2470" />
                  </g>
                </svg>
              </button>
            </div> */}
          </div>
        </aside>
      </div>
    </>
  );
};

export default SidebarDashboard;
