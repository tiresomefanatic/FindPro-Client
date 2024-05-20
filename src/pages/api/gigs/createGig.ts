import { NextApiRequest, NextApiResponse } from "next";
import customAxios from '@/lib/customAxios';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      const response = await customAxios.post("/gigs/createGig", req.body);
      const data = response.data;
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: "Full Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;