"use client";

import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { FaMoon, FaSun, FaSearch } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useGlobalContext } from "@/app/context/ContextProvider";

const NavbarDashboard = () => {
  const { isDarkMode, toggleDarkMode } = useGlobalContext();

  return (
    <nav className="fixed z-30 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            {/* Toggle mobile menu */}
            <button
              id="toggleSidebarMobile"
              className="p-2 text-gray-600 rounded cursor-pointer lg:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <svg
                id="toggleSidebarMobileHamburger"
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                id="toggleSidebarMobileClose"
                className="hidden w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            {/* Logo */}
            <Link href="/" className="flex ml-2 md:mr-24">
              <Image
                src="/media/svg/logo2.svg"
                alt="Logo"
                width={48}
                height={40}
                priority
              />
              <span className="ml-2 self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                {/* Dashboard */}
              </span>
            </Link>
            {/* Form Search */}
            {/* <div className='hidden lg:block lg:pl-3.5'>
              <form className="flex items-center ">
                <input
                  type="text"
                  placeholder="Search"
                  className="px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-600 h-8 w-[500px]"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <FaSearch />
                </button>
              </form>
            </div> */}
          </div>

          <div className="flex items-center">
            <div className="hidden mr-3 -mb-1 sm:block">{/*  */}</div>
            {/* Search mobile */}
            <button
              id="toggleSidebarMobileSearch"
              type="button"
              className="p-2 text-gray-500 rounded-lg lg:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Search</span>
              {/* Search icon */}
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            {/* Notification */}
            {/* <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 mr-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" aria-hidden="true"></path></svg>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none min-w-[400px] dark:bg-gray-700">
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      <div className="block px-4 py-2 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-600 dark:text-gray-200">
                        Notifications
                      </div>
                    </Menu.Item>
                    <Menu.Item>
                      <Link href="/dashboard" className='flex px-4 py-3 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600'>
                        <div className="flex-shrink-0">
                          <Image
                            className='rounded-full'
                            src="/media/png/users/bonnie-green.png"
                            alt="Jese image"
                            width={30}
                            height={25}
                            priority
                          />
                        </div>
                        <div className="w-full pl-3">
                          <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">New message from <span className="font-semibold text-gray-900 dark:text-white">Bonnie Green</span>: "Hey, what's up? All set for the presentation?"</div>
                          <div className='p-2 bg-gray-900 rounded-md text-center'>
                            <div className="text-white text-xs font-medium text-primary-700 dark:text-primary-400">a few moments ago</div>
                          </div>
                        </div>
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link href="/dashboard" className='flex px-4 py-3 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600'>
                        <div className="flex-shrink-0">
                          <Image
                            className='rounded-full'
                            src="/media/png/users/bonnie-green.png"
                            alt="Jese image"
                            width={30}
                            height={25}
                            priority
                          />
                        </div>
                        <div className="w-full pl-3">
                          <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">New message from <span className="font-semibold text-gray-900 dark:text-white">Bonnie Green</span>: "Hey, what's up? All set for the presentation?"</div>
                          <div className='p-2 bg-gray-900 rounded-md text-center'>
                            <div className="text-white text-xs font-medium text-primary-700 dark:text-primary-400">5 minutes ago</div>
                          </div>
                        </div>
                      </Link>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu> */}
            {/* Toggle dark mode */}
            <button
              onClick={toggleDarkMode}
              type="button"
              className="text-gray-500 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 border"
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarDashboard;
