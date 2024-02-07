import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  getListQAHistoryAxios,
  getDetailQAHistoryAxios,
} from "@/app/services/logging/qa-history/qaHistoryService";

export function useQAHistoryData(
  currentPage: number,
  pageSize: number
): UseQueryResult<GetListQAHistoryModel, unknown> {
  return useQuery(
    ["qa-history", currentPage, pageSize],
    () => getListQAHistoryAxios(currentPage, pageSize),
    { keepPreviousData: true }
  );
}

export function useQAHistoryDetailData(
  questionId: number
): UseQueryResult<QAHistoryModel, unknown> {
  return useQuery(
    ["qa-history-detail", questionId],
    () => getDetailQAHistoryAxios(questionId),
    { enabled: false }
  );
}
