import { connectToDatabase } from "../../util/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  const term = req.query.term;

  const data = await db.collection("listingsAndReviews").aggregate([
    {
      $search: {
        search: {
          query: term,
          path: ["description", "amenities"]
        }
      }
    }, {
      $limit: 20
    }
  ]).toArray()

  res.json(data.map(e => e.summary));
}
