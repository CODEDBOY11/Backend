import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const MoviePage = () => {
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      const fetchMovieDetails = async () => {
        try {
          const response = await fetch(`/api/movies/${id}`);
          const data = await response.json();
          setMovieDetails(data);
        } catch (error) {
          console.error("Error fetching movie details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchMovieDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!movieDetails) {
    return <p>Movie not found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Head>
        <title>{movieDetails.title} - Movie Details</title>
        <meta name="description" content={movieDetails.description || "No description available."} />
        <meta name="keywords" content={`${movieDetails.title}, movie, film`} />
        <meta property="og:title" content={movieDetails.title} />
        <meta property="og:description" content={movieDetails.description} />
        <meta property="og:image" content={movieDetails.image} />
      </Head>

      <header className="p-6 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {movieDetails.title}
        </h1>
      </header>

      <main className="p-6">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <img
            src={movieDetails.image}
            alt={movieDetails.title}
            className="w-full h-80 object-cover rounded-lg"
          />
          <div className="mt-4">
            <p className="text-gray-800 dark:text-gray-200">{movieDetails.description}</p>

            {/* Display Rating */}
            {movieDetails?.rating && (
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`h-6 w-6 ${
                      index < Math.round(movieDetails.rating / 2)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.879 1.512 8.29L12 18.896l-7.448 4.579 1.512-8.29-6.064-5.879 8.332-1.151z" />
                  </svg>
                ))}
              </div>
            )}

            {/* Trailer Integration */}
            {movieDetails?.trailerId && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Watch Trailer
                </h2>
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${movieDetails.trailerId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg mt-4"
                ></iframe>
              </div>
            )}

            <div className="mt-6">
              <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
                Download Movie
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MoviePage;
