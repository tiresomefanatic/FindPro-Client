import customAxios from "@/lib/customAxios";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
        const id = "6641214d7f491783dbdaaf89"
     // const { }= req.query;
      const response = await customAxios.get(
        `http://localhost:8080/gigs/userGigs/${id}`
        
      );
      const data = await response.data;
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;
