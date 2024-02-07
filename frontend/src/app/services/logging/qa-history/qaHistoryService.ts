import useAxios from "@/app/services/useAxios";

export const getListQAHistoryAxios = async (
  currentPage: number,
  pageSize: number
) => {
  const { data } = await useAxios.post("/qa-history-page", {
    page_size: pageSize,
    page: currentPage,
  });
  return data;
};

export const getDetailQAHistoryAxios = async (questionId: number) => {
  const { data } = await useAxios.get(`/qa-history/${questionId}`);
  return data;
};
