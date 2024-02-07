import { useQuery, UseQueryResult } from "@tanstack/react-query";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

type ListRoomModel = {
  id: string;
  name: string;
};

export function useListRoomData(): UseQueryResult<ListRoomModel[], unknown> {
  return useQuery(["roles"], () => getListRoomData());
}

export async function getListRoomData(): Promise<ListRoomModel[]> {
  const url: string = `${API_URL}/list-room`;
  const response = await fetch(url);
  const result = await response.json();
  return result;
}
