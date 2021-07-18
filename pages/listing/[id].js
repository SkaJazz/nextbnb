import Head from "next/head";
import { connectToDatabase } from "../../util/mongodb";

export default function Listing({ property }) {
  return (
    <div>
      <Head>
        <title>Hotel Info</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {property && (
        <div>
          <a href="/">&larr; BACK</a>
          <h1>{property.name}</h1>
          <img styles="width: 100px" src={property.images.picture_url} />
          <p>{property.summary}</p>
          <h4>Cost per night: {property.price.$numberDecimal}</h4>
          <p>We have:</p>
          <ul>
            {property.amenities.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <style jsx>{`
        img {
          width: 100%;
        }
      `}</style>
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { db } = await connectToDatabase();

  const data = await db.collection("listingsAndReviews").findOne(
    { _id: params.id },
    {
      projection: {
        name: 1,
        images: 1,
        address: 1,
        summary: 1,
        price: 1,
        cleaning_fee: 1,
        amenities: 1,
      },
    }
  );

  return {
    props: { property: JSON.parse(JSON.stringify(data)) },
    revalidate: 1,
  };
}
