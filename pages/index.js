import Head from "next/head";
import { connectToDatabase } from "../util/mongodb";

export default function Home({ hotelsInfo }) {
  console.log(hotelsInfo[0]);

  return (
    <div className="container">
      <Head>
        <title>NextBnB</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">NextBnB App</h1>

        {hotelsInfo && (
          <ul>
            {hotelsInfo.map((hotel, i) => (
              <li className="list-item" key={i}>
                <div className="card">
                  <img src={hotel.image} />
                  <h4>{hotel.name}</h4>
                  <p>{hotel.summary}</p>
                  <a href={`/listing/${hotel.id}`}>
                    <button>More Info</button>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className="logo" />
        </a>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer img {
          margin-left: 0.5rem;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .subtitle {
          font-size: 2rem;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          cursor: pointer;
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card img {
          width: 380px;
        }

        .card button {
          cursor: pointer;
          margin-top: 20px;
          width: 50%;
          height: 30px;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h4 {
          margin: 2rem 0 0.7rem 0;
          font-size: 1.1rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .logo {
          height: 1em;
        }

        .list-item {
          list-style: none;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { db } = await connectToDatabase();

  const data = await db
    .collection("listingsAndReviews")
    .find()
    .sort({ _id: 1 })
    .limit(20)
    .toArray();

  const hotelsInfo = data.map(property => {
    const toNumber = notNumber =>
      JSON.parse(JSON.stringify(notNumber)).$numberDecimal;

    return {
      id: property._id,
      name: property.name,
      image: property.images.picture_url,
      summary: property.summary,
      address: property.address,
      amenities: property.amenities,
      guests: property.accommodates,
      price: toNumber(property.price),
      cleaning_fee: property.cleaning_fee ? toNumber(property.cleaning_fee) : 0,
    };
  });

  return {
    props: { hotelsInfo },
  };
}
