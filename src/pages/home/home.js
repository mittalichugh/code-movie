import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../component/header/Header';

const Home = () => {
    const [popularMovies, setPopularMovies] = useState([]);
    const [wishlistMovies, setWishlistMovies] = useState([]);
    const [continueWatchingMovies, setContinueWatchingMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 12;

    useEffect(() => {
        fetch("https://api.themoviedb.org/3/movie/popular?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US")
            .then(res => res.json())
            .then(data => setPopularMovies(data.results))
            .catch(error => console.error("Error fetching popular movies:", error));

        setWishlistMovies(JSON.parse(localStorage.getItem('wishlist')) || []);
        setContinueWatchingMovies(JSON.parse(localStorage.getItem('continueWatching')) || []);
    }, []);

    const MovieGrid = ({ movies }) => {
        const indexOfLastMovie = currentPage * moviesPerPage;
        const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
        const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);

        return (
            <>
            <Header />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {currentMovies.map(movie => (
                        <Link key={movie.id} to={`/movies/${movie.id}`} className="relative group">
                            <img
                                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-auto rounded-lg shadow-lg transform transition-all duration-300 group-hover:scale-105"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'; }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity duration-300 flex items-end">
                                <div className="p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <h3 className="text-sm font-bold truncate">{movie.title}</h3>
                                    {movie.release_date && (
                                        <p className="text-xs">{movie.release_date.split('-')[0]}</p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <Pagination totalMovies={movies.length} />
            </>
        );
    };

    const Pagination = ({ totalMovies }) => {
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(totalMovies / moviesPerPage); i++) {
            pageNumbers.push(i);
        }

        return (
            <nav className="mt-8 flex justify-center">
                <ul className="flex space-x-2">
                    {pageNumbers.map(number => (
                        <li key={number}>
                            <button
                                onClick={() => setCurrentPage(number)}
                                className={`px-3 py-1 rounded ${currentPage === number ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                            >
                                {number}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        );
    };

    return (
        <div className="bg-black min-h-screen text-white p-4 sm:p-6">
            <main className="space-y-12 max-w-7xl mx-auto">
                {popularMovies.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Popular Now</h2>
                        <MovieGrid movies={popularMovies} />
                    </section>
                )}

                {continueWatchingMovies.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Continue Watching</h2>
                        <MovieGrid movies={continueWatchingMovies} />
                    </section>
                )}

                {wishlistMovies.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-4">My List</h2>
                        <MovieGrid movies={wishlistMovies} />
                    </section>
                )}
            </main>
        </div>
    );
};

export default Home;