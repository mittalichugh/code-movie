import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./movieDetails.css";
import Header1 from '../../component/Header1';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [videoKey, setVideoKey] = useState("");
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isInContinueWatching, setIsInContinueWatching] = useState(false);
<Header1/>
    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`)
            .then(res => res.json())
            .then(data => {
                console.log("Movie data:", data);
                setMovie(data);
                checkWishlistStatus(data.id);
                checkContinueWatchingStatus(data.id);
            })
            .catch(error => console.error("Error fetching movie details:", error));

        fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`)
            .then(res => res.json())
            .then(data => {
                console.log("Video data:", data);
                if (data.results.length > 0) {
                    setVideoKey(data.results[0].key);
                } else {
                    console.warn("No videos found for this movie.");
                }
            })
            .catch(error => console.error("Error fetching movie videos:", error));
    }, [id]);

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

    const handleContinueWatching = () => {
        if (!movie) return;
        const continueWatching = JSON.parse(localStorage.getItem('continueWatching')) || [];
        const updatedContinueWatching = isInContinueWatching
            ? continueWatching.filter(item => item.id !== movie.id)
            : [...continueWatching, { id: movie.id, title: movie.title, poster_path: movie.poster_path }];
        localStorage.setItem('continueWatching', JSON.stringify(updatedContinueWatching));
        setIsInContinueWatching(!isInContinueWatching);
        alert(isInContinueWatching ? "Movie removed from Continue Watching!" : "Movie added to Continue Watching!");
    };

    return (
        
        <div className="movie-details">
            {movie ? (
                <>
                    {videoKey ? (
                        <iframe
                            width="100%"
                            height="300px"
                            src={`https://www.youtube.com/embed/${videoKey}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="video"
                        >
                        </iframe>
                    ) : (
                        <p>No video available for this movie.</p>
                    )}
                    <button className="wishlist-button" onClick={handleWishlist}>
                        {isInWishlist ? "Remove from Watchlist" : "Add to Watchlist"}
                    </button>
                    <button className="continue-watching-button" onClick={handleContinueWatching}>
                        {isInContinueWatching ? "Remove from Continue Watching" : "Add to Continue Watching"}
                    </button>
                </>
            ) : (
                <p>Loading movie details...</p>
            )}
        </div>
    );
};
export default MovieDetails;
