import useAxios from "@/app/services/useAxios";

export const getListFileAxios = async (
  currentPage: number,
  pageSize: number
) => {
  const { data } = await useAxios.post("/list-candidate", {
    page_size: pageSize,
    page: currentPage,
  });
  return data;
};

export const getListFileDetailAxios = async (fileId: string) => {
  const { data } = await useAxios.get(`/candidate/${fileId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const getMatchingDetailAxios = async (
  candidateId: string,
  jobId: string
) => {
  const { data } = await useAxios.get(
    `/candidate/${candidateId}/job/${jobId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return data;
};

export const uploadFileAxios = async (formData: FormData) => {
  const { data } = await useAxios.post("/upload-cv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const deleteFileAxios = async (fileId: string) => {
  const { data } = await useAxios.delete(`/candidate/${fileId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
};
