import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

type AddRoleModel = {
  name: string;
  description: string;
  permissions: number[] | [];
};

export function useRoleData(): UseQueryResult<RoleModel[], unknown> {
  return useQuery(["roles"], () => getRoleData());
}

export async function getRoleData(): Promise<RoleModel[]> {
  const url: string = `${API_URL}/role`;
  const response = await fetch(url);
  const result = await response.json();
  return result;
}

export function useAddRole(
  data: AddRoleModel,
  onSuccess?: () => void
): UseMutationResult<any, unknown> {
  return useMutation(["add-role"], () => addRole(data), {
    onSuccess: (data) => {
      if (onSuccess) {
        console.log(data);
        onSuccess();
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export async function addRole(data: AddRoleModel): Promise<any> {
  const url: string = `${API_URL}/role`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}

export function useDeleteRole(
  idRole: number,
  onSuccess?: () => void
): UseMutationResult<string, unknown> {
  return useMutation(["delete-role"], () => deleteRole(idRole), {
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });
}

export async function deleteRole(idRole: number): Promise<any> {
  const url: string = `${API_URL}/role/${idRole}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();
  return result;
}
