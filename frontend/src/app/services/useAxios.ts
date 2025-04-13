import axios from "axios";

const useAxios = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

// Simple error handling without auth
useAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default useAxios;
