import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";

export function usePermissionData(): UseQueryResult<PermissionModel[]> {
  return useQuery(["permission"], () => getPermissionData());
}

export async function getPermissionData(): Promise<PermissionModel[]> {
  const url: string = `${process.env.NEXT_PUBLIC_API_URL}/permission`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
