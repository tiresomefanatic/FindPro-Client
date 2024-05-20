import customAxios from "@/lib/customAxios";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "PUT") {
    try {
      const { gigId } = req.query;
      const updateData = req.body;
      const response = await customAxios.put(`http://localhost:8080/gigs/${gigId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      const data = await response.data;
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Full Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

export default handler;