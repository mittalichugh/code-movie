import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../component/header/Header';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [videoKey, setVideoKey] = useState("");
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isInContinueWatching, setIsInContinueWatching] = useState(false);
    const [loading, setLoading] = useState(true);
    const playerRef = useRef(null);
    const iframeRef = useRef(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`);
                const data = await res.json();
                setMovie(data);
                checkWishlistStatus(data.id);
                checkContinueWatchingStatus(data.id);
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }

            try {
                const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`);
                const data = await res.json();
                if (data.results.length > 0) {
                    setVideoKey(data.results[0].key);
                }
            } catch (error) {
                console.error("Error fetching movie videos:", error);
            }

            setLoading(false);
        };

        fetchMovieDetails();
    }, [id]);

    useEffect(() => {
        const loadYouTubeAPI = () => {
            if (!window.YT) {
                const script = document.createElement('script');
                script.src = "https://www.youtube.com/iframe_api";
                document.body.appendChild(script);
            } else {
                createPlayer();
            }
        };

        const createPlayer = () => {
            if (videoKey) {
                playerRef.current = new window.YT.Player(iframeRef.current, {
                    videoId: videoKey,
                    events: {
                        onReady: () => {
                            console.log('YouTube Player is ready');
                        },
                        onStateChange: (event) => {
                            if (event.data === window.YT.PlayerState.PLAYING) {
                                handleVideoPlay();
                            }
                        }
                    }
                });
            }
        };

        window.onYouTubeIframeAPIReady = createPlayer;
        loadYouTubeAPI();
    }, [videoKey]);

    const checkWishlistStatus = (movieId) => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        setIsInWishlist(wishlist.some(item => item.id === movieId));
    };

    const handleWishlist = () => {
        if (!movie) return;
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const updatedWishlist = isInWishlist
            ? wishlist.filter(item => item.id !== movie.id)
            : [...wishlist, { id: movie.id, title: movie.title, poster_path: movie.poster_path }];
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        setIsInWishlist(!isInWishlist);
    };

    const checkContinueWatchingStatus = (movieId) => {
        const continueWatching = JSON.parse(localStorage.getItem('continueWatching')) || [];
        setIsInContinueWatching(continueWatching.some(item => item.id === movieId));
    };

    const handleVideoPlay = () => {
        if (!movie || isInContinueWatching) return;
        console.log(`Playing video: ${movie.title}`);
        const continueWatching = JSON.parse(localStorage.getItem('continueWatching')) || [];
        const updatedContinueWatching = [...continueWatching, { id: movie.id, title: movie.title, poster_path: movie.poster_path }];
        localStorage.setItem('continueWatching', JSON.stringify(updatedContinueWatching));
        setIsInContinueWatching(true);
    };

    if (loading) {
        return (
            <div className="bg-black text-white min-h-screen flex items-center justify-center">
                <p className="text-2xl">Loading...</p>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="bg-black text-white min-h-screen">
                <div className="container mx-auto px-4 py-8 mt-16">
                    {movie ? (
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-2/3 pr-8">
                                {videoKey ? (
                                    <div className="aspect-w-16 aspect-h-9 mb-8" style={{ height: '400px', width: '100%' }}>
                                        <div ref={iframeRef} className="w-full h-full" />
                                    </div>
                                ) : (
                                    <p className="text-gray-400 mb-4">No video available for this movie.</p>
                                )}
                                <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
                                <p className="text-gray-300 mb-4">{movie.overview}</p>
                                <div className="flex space-x-4 mb-8">
                                    <button
                                        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition duration-300"
                                        onClick={handleWishlist}
                                    >
                                        {isInWishlist ? "Remove from Watchlist" : "Add to Watchlist"}
                                    </button>
                                </div>
                            </div>
                            <div className="md:w-1/3">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-full rounded-lg shadow-lg"
                                />
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-2xl">Error loading movie details.</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default MovieDetails;
