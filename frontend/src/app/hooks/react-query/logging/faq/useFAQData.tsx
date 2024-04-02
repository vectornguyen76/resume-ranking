import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import {
  getJobDetailAxios,
  getFAQAxios,
  getMatchingPage,
  getMatchingCandidate,
  getAllJob,
  getDetailFAQAxios,
  deleteFAQAxios,
  addFAQAxios,
  updateFAQAxios,
} from "@/app/services/logging/faq/faqService";

export function useFAQData(
  currentPage: number,
  pageSize: number
): UseQueryResult<FAQResponeModel, unknown> {
  return useQuery(
    ["faq-list", currentPage, pageSize],
    () => getFAQAxios(currentPage, pageSize),
    { keepPreviousData: true }
  );
}

export function useMatchingPageData(
  jobName: string,
  currentPage: number,
  pageSize: number
): UseQueryResult<JobMatchingResponeModel, unknown> {
  return useQuery(
    ["matching-page-data", currentPage, pageSize],
    () => getMatchingPage(jobName, currentPage, pageSize),
    { keepPreviousData: true }
  );
}

export function useAllJobData(): UseQueryResult<JobModel[], unknown> {
  return useQuery(["all-job-data"], () => getAllJob(), {
    keepPreviousData: true,
  });
}

export function useJobDetailData(
  jobId: string
): UseQueryResult<JobDetailModel> {
  return useQuery(["list-job-detail"], () => getJobDetailAxios(jobId), {
    enabled: false,
  });
}

export function useDetailFAQData(
  faqId: number
): UseQueryResult<JobModel, unknown> {
  return useQuery(["faq-detail", faqId], () => getDetailFAQAxios(faqId), {
    enabled: false,
  });
}

export function useDeleteFAQData(faqId: number): UseMutationResult<any> {
  return useMutation(["faq-delete"], () => deleteFAQAxios(faqId));
}

export function useMachingData(jobName: string): UseMutationResult<any> {
  return useMutation(["matching-candidate"], () =>
    getMatchingCandidate(jobName)
  );
}

export function useAddFAQData(
  formData: ModifyFAQModel
): UseMutationResult<any> {
  return useMutation(["faq-add"], () => addFAQAxios(formData));
}

export function useUpdateFAQData(
  formData: ModifyFAQModel,
  faqId: number
): UseMutationResult<any> {
  return useMutation(["faq-update"], () => updateFAQAxios(formData, faqId));
}
