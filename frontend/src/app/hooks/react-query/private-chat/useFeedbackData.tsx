import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { feedbackAnswerAxios } from "@/app/services/private-chat/chatService";

export function useFeedbackData(
  answerId: number,
  data: FeedbackModel
): UseMutationResult<any> {
  return useMutation(["feedback-answer"], () =>
    feedbackAnswerAxios(answerId, data)
  );
}
