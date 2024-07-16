import React, { useEffect, useState } from 'react';
import "./home.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';
import Footer from '../../component/footer/Footer.js';
import Header1 from '../../component/Header1.js';
const Home = () => {
    const [popularMovies, setPopularMovies] = useState([]);
    const [wishlistMovies, setWishlistMovies] = useState([]);
    const [continueWatchingMovies, setContinueWatchingMovies] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    useEffect(() => {
        fetch("https://api.themoviedb.org/3/movie/popular?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US")
            .then(res => res.json())
            .then(data => {
                console.log("Fetched popular movies:", data.results); 
                setPopularMovies(data.results);
            })
            .catch(error => console.error("Error fetching popular movies:", error));
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        setWishlistMovies(storedWishlist);
        const storedContinueWatching = JSON.parse(localStorage.getItem('continueWatching')) || [];
        setContinueWatchingMovies(storedContinueWatching);
    }, []);
    const chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };
    return (
        <>
            <Header1 />
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <button className='close-btn' onClick={() => setSidebarOpen(false)}>X</button>
                <ul>
                    <li><Link to="/Home">Home</Link></li>
                    <li><Link to="/New&Popular">New&Popular</Link></li>
                    <li><Link to="/TV Shows">TV Shows</Link></li>
                    <li><Link to="/Movies">Movies</Link></li>
                    <li><Link to="/Categories">Categories</Link></li>
                    <li><Link to="/Downloads">Downloads</Link></li>
                    <li><Link to="/Notifications">Notifications</Link></li>
                </ul>
            </div>
            <div className='sideclick' onClick={() => setSidebarOpen(true)}>
                <div className='line'></div>
                <div className='line'></div>
                <div className='line'></div>
            </div>
            <div className='poster'>
                <Carousel
                    showThumbs={false}
                    autoPlay={true}
                    transitionTime={1}
                    infiniteLoop={true}
                    showStatus={false}
                >
                    {popularMovies.length > 0 ? (
                        chunkArray(popularMovies, 5).map((movieChunk, index) => (
                            <div key={index} className='poster-chunk'>
                                {movieChunk.map(movie => (
                                    <Link key={movie.id} to={`/movies/${movie.id}`} className='poster-item'>
                                        <div className='poster-image'>
                                            <img 
                                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                                                alt={movie.title}
                                                onError={(e) => { e.target.src = '/path_to_default_image.jpg'; }} 
                                            />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ))
                    ) : (
                        <p>Loading popular movies...</p>
                    )}
                </Carousel>
            </div>
            <div className='wishlist-section'>
                <h2>Watchlist</h2>
                <div className='wishlist-movies'>
                    {wishlistMovies.length > 0 && (
                        wishlistMovies.map(movie => (
                            <Link key={movie.id} to={`/movies/${movie.id}`} className='wishlist-movie'>
                                <img 
                                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                                    alt={movie.title}
                                    onError={(e) => { e.target.src = '/path_to_default_image.jpg'; }} 
                                />
                            </Link>
                        ))
                    )}
                </div>
            </div>
            <div className='continue-watching-section'>
                <h2>Continue Watching</h2>
                <div className='continue-watching-movies'>
                    {continueWatchingMovies.length > 0 && (
                        continueWatchingMovies.map(movie => (
                            <Link key={movie.id} to={`/movies/${movie.id}`} className='continue-watching-movie'>
                                <img 
                                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                                    alt={movie.title}
                                    onError={(e) => { e.target.src = '/path_to_default_image.jpg'; }} 
                                />
                            </Link>
                        ))
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};
export default Home;
