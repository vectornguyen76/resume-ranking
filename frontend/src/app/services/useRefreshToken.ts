"use client";

import axios from "axios";
import { useSession } from "next-auth/react";

export const useRefreshToken = () => {
  const { data: session } = useSession();

  const refreshToken = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/refresh`,
      null,
      {
        headers: {
          Authorization: `Bearer ${session?.refresh_token}`,
        },
      }
    );

    if (session) {
      session.access_token = response.data.access_token;
      session.refresh_token = response.data.refresh_token;
    }
    return refreshToken;
  };
};
