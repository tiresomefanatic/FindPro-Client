import customAxios from '@/lib/customAxios';
import { NextApiRequest, NextApiResponse } from 'next';
 // Update the path to your axios.js file

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;
      console.log("from new id api page", id);

      const response = await customAxios.get(`/gigs/${encodeURIComponent(id as string)}`);
      const data = response.data;
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default handler;