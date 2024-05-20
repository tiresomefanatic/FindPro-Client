import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import customAxios from "@/lib/customAxios";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const { category, subCategory, page, limit, searchTerm } = req.query;
      const response = await customAxios.get("/gigs", {
        params: {
          category: category as string,
          subCategory: subCategory as string,
          limit: limit as string,
          page: page as string,
          searchTerm: searchTerm as string,
        },
        withCredentials: true, 

      });

      const data = response.data;
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Max Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;