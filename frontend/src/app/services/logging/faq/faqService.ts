import useAxios from "@/app/services/useAxios";

export const getFAQAxios = async (currentPage: number, pageSize: number) => {
  const { data } = await useAxios.post("/job-page", {
    page_size: pageSize,
    page: currentPage,
  });
  return data;
};

export const getMatchingPage = async (
  jobName: string,
  currentPage: number,
  pageSize: number
) => {
  const { data } = await useAxios.post("/data-matching", {
    job_name: jobName,
    page_size: pageSize,
    page: currentPage,
  });
  return data;
};

export const getMatchingCandidate = async (jobName: string) => {
  const { data } = await useAxios.post("/process-matching", {
    job_name: jobName,
  });
  return data;
};

export const getJobDetailAxios = async (jobId: string) => {
  const { data } = await useAxios.get(`/job/${jobId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const getDetailFAQAxios = async (faqId: number) => {
  const { data } = await useAxios.get(`/job/${faqId}`);
  return data;
};

export const getAllJob = async () => {
  const { data } = await useAxios.get(`/job`);
  return data;
};

export const deleteFAQAxios = async (faqId: number) => {
  const { data } = await useAxios.delete(`/job/${faqId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const addFAQAxios = async (formData: ModifyFAQModel) => {
  const { data } = await useAxios.post(
    "/job",
    {
      job_name: formData.job_name,
      job_description: formData.job_description,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return data;
};

export const updateFAQAxios = async (
  formData: ModifyFAQModel,
  faqId: number
) => {
  const { data } = await useAxios.put(
    `/job/${faqId}`,
    {
      job_name: formData.job_name,
      job_description: formData.job_description,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return data;
};
