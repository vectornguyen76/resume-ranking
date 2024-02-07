import axios from "axios";
import { error } from "console";
import { getSession, useSession } from "next-auth/react";

const useAxios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

useAxios.interceptors.request.use(
  async (config) => {
    // const session = await getSession();
    const session = await getSession({ req: config.headers.referer });
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

useAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("trietcn");
      const session = await useSession();
      const refresh_token = session.data?.refresh_token;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/refresh`,
        null,
        {
          headers: {
            Authorization: `Bearer ${refresh_token}`,
          },
        }
      );
      if (response.status === 200) {
        session.update(response.data.access_token);
        originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
        return axios(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default useAxios;
