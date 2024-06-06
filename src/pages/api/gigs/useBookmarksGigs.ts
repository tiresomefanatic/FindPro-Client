import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL


const fetchBookmarkedGigs = async () => {
  const response = await axios.get("http://localhost:8080/gigs/getBookmarkedGigs", {
    baseURL: baseURL, // Set your API base URL, does not work without it
    withCredentials: true, // To let axios send cookies in header

  });
  return response.data;
};

const bookmarkGig = async (gigId: string) => {
  const response = await axios.post(`http://localhost:8080/gigs/bookmarkGig/${gigId}`, {
    baseURL: baseURL, // Set your API base URL, does not work without it
    withCredentials: true, // To let axios send cookies in header
  });
  return response.data;
};

export const useBookmarkedGigs = () => {
  return useQuery({
    queryKey: ["bookmarkedGigs"],
    queryFn: fetchBookmarkedGigs,
  });
};

export const useBookmarkGig = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, string>({
      mutationFn: async (gigId: string) => {
        const response = await axios.post(
          `http://localhost:8080/gigs/bookmarkGig/${gigId}`,
          null,
          {
            baseURL: baseURL,
            withCredentials: true,
          }
        );
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["bookmarkedGigs"] });
      },
    });
  };