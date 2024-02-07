"use client";
import React, { useState, Fragment } from "react";
import {
  useUserData,
  useBlockUser,
} from "@/app/hooks/react-query/management/user/useUserData";
import { Dialog, Transition } from "@headlessui/react";

type Props = {};

const TableUser = (props: Props) => {
  const { data, isLoading, isError, refetch } = useUserData();
  const [isOpenModalBan, setIsOpenModalBan] = useState<boolean>(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [selectedEmail, setSelectedEmail] = useState<string>("");
  const [statusUser, setStatusUser] = useState<boolean>(false);

  const { mutate: banUser } = useBlockUser(selectedUserId, statusUser, () => {
    refetch();
  });

  const closeModal = () => {
    setIsOpenModalBan(false);
  };

  const openModalBan = (userId: number, email: string, status: boolean) => {
    setSelectedUserId(userId);
    setSelectedEmail(email);
    setStatusUser(!status);
    setIsOpenModalBan(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading user data</div>;
  }

  // Ban-Unban user
  const handleClickBan = () => {
    banUser({});
    setIsOpenModalBan(false);
  };

  return (
    <>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 table-auto">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th
              scope="col"
              className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
            >
              Display name
            </th>
            <th
              scope="col"
              className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
            >
              Email
            </th>
            <th
              scope="col"
              className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
            >
              Role
            </th>
            <th
              scope="col"
              className="p-4 text-xs text-center font-medium text-gray-500 uppercase dark:text-gray-400"
            >
              Status
            </th>
            <th
              scope="col"
              className="p-4 text-xs font-medium text-center text-gray-500 uppercase dark:text-gray-400"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {data.map((user) => (
            <tr
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
              key={user.id}
            >
              <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {user.display_name}
              </td>
              <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {user.email}
              </td>
              <td className="p-4 text-base font-light text-gray-900 whitespace-nowrap dark:text-white">
                {user.roles.map((role) => (
                  <div key={role.id}>{role.name}</div>
                ))}
              </td>
              <td className="p-4 text-sm text-center font-extralight text-gray-900 whitespace-nowrap dark:text-white">
                <div className="flex items-center justify-center">
                  {!user.block ? (
                    <div className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-600">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div>
                      Active
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-600 mr-2"></div>
                      Banned
                    </div>
                  )}
                </div>
              </td>
              <td className="p-4 text-base text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {user.id !== 1 && (
                  <>
                    <button
                      type="button"
                      className=" text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-3 py-2. text-center mr-2 mb-2"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className=" text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-3 py-2. text-center mr-2 mb-2"
                      onClick={() =>
                        openModalBan(user.id, user.email, user.block)
                      }
                    >
                      {!user.block ? <div>Ban</div> : <div>Unban</div>}
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal edit user */}
      {/* Modal confirm Delete */}
      <Transition appear show={isOpenModalBan} as={Fragment}>
        <Dialog as="div" className="relative z-20" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-center text-lg font-medium leading-6 text-gray-900"
                  >
                    Notification
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Bạn chắc chắn thay đổi trạng thái của [{" "}
                      <strong>{selectedEmail}</strong> ] ?
                    </p>
                  </div>

                  <div className="mt-8 text-end">
                    <button
                      type="button"
                      className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => handleClickBan()}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      No
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default TableUser;
