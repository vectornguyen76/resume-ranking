import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";

type Props = {
  isOpenModalUpdate: boolean;
  setIsOpenModalUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  closeModal: () => void;
  refetch: () => void;
  refetchDetail: () => void;
  faqId: number;
  data?: JobModel;
  isLoading: boolean;
};

type FormModel = {
  job_name: string;
  job_description: string;
};

const FormUpdateFAQ = (props: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormModel>({});
  const [inputs, setInputs] = React.useState<InputItem[] | []>([]);
  const [dataForm, setDataForm] = React.useState<DataFormModel>({
    job_name: "",
    job_description: "",
  });

  const addInput = (): void => {
    setInputs([...inputs, { documentname: "", number: 0 }]);
  };

  const handleInputChange = (index: number, event: any) => {
    const { name, value } = event.target;
    const updatedInputs = [...inputs];
    updatedInputs[index] = { ...updatedInputs[index], [name]: value };
    setInputs(updatedInputs);
  };

  const validateDocumentName = (documentname: string) => {
    return documentname.trim().length > 0;
  };

  const confirmAddFAQ = () => {};

  return (
    <>
      {/* Modal Add FAQ */}
      <Transition appear show={props.isOpenModalUpdate} as={React.Fragment}>
        <Dialog as="div" className="relative z-20" onClose={props.closeModal}>
          <Transition.Child
            as={React.Fragment}
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
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-center text-lg font-medium leading-6 text-gray-900"
                  >
                    Update Job
                  </Dialog.Title>
                  {props.isLoading ? (
                    <>Loading ...</>
                  ) : (
                    <form
                      className="w-full"
                      onSubmit={handleSubmit(confirmAddFAQ)}
                    >
                      <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5 mt-8">
                        <div className="sm:col-span-2">
                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Job Name
                          </label>
                          <input
                            type="text"
                            // {...register("job_name")}
                            value={props.data?.job_name}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                        <div className="sm:col-span-2">
                          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Job Description
                          </label>
                          <input
                            type="text"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            {...register("job_description")}
                          />
                        </div>
                      </div>
                      {/* <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
												<div className="sm:col-span-2">
													<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
													<input
														type="text"
														className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
														value="FAQ Category 1"
														disabled
													/>
												</div>
											</div>
											<div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
												<div className="sm:col-span-2">
													<label className="inline-block mb-2 text-sm font-medium text-gray-900 dark:text-white">
														Documents
													</label>
													<button
														onClick={addInput}
														type="button"
														className="inline-block ml-2 px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
													>
														+
													</button>
													{inputs.map((input, index) => (
														<div className="flex space-x-4 mt-2" key={index}>
															<div className="w-3/4">
																<input
																	type="text"
																	name="documentname"
																	value={input.documentname}
																	onChange={(event) => handleInputChange(index, event)}
																	className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
																/>
																{!validateDocumentName(input.documentname) && (
																	<p className="error-message text-sm text-red-600">* Document name is required.</p>
																)}
															</div>
															<div className="w-1/4">
																<input
																	type="number"
																	name="number"
																	value={input.number}
																	onChange={(event) => handleInputChange(index, event)}
																	className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
																/>
															</div>
														</div>
													))}
												</div>
											</div> */}
                      <div className="mt-8 text-end">
                        <button
                          type="submit"
                          className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={props.closeModal}
                        >
                          No
                        </button>
                      </div>
                    </form>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default FormUpdateFAQ;
