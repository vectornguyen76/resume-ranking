import useAxios from "@/app/services/useAxios";

export const feedbackAnswerAxios = async (
  answerId: number,
  dataFeedback: FeedbackModel
) => {
  const { data } = await useAxios.put(
    `/qa-history-feedback/${answerId}`,
    dataFeedback,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return data;
};
