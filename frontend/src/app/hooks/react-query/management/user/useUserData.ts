import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export function useUserData(): UseQueryResult<UserModel[], unknown> {
  return useQuery(["user"], () => getUserData());
}

export async function getUserData(): Promise<UserModel[]> {
  const url: string = `${API_URL}/user`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export function useBlockUser(
  userId: number,
  status: boolean,
  onSuccess?: () => void
): UseMutationResult<string, unknown> {
  return useMutation(["block-user"], () => blockUser(userId, status), {
    onSuccess: (data) => {
      console.log(data);
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export async function blockUser(userId: number, status: boolean): Promise<any> {
  const url: string = `${API_URL}/block-user/${userId}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ block: status }),
  });
}
