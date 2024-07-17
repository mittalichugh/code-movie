import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-black text-white py-4 px-6 fixed top-0 left-0 right-0 z-50">
            <div className="container mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    <img 
                        className="h-8 w-auto mr-2" 
                        src="https://img.freepik.com/premium-vector/tv-talk-logo-neon-signs-style-text_118419-3132.jpg" 
                        alt="TV Talk Logo"
                    />
                    <span className="text-red-600 text-2xl font-bold">Netflix</span>
                </Link>
                
                <nav>
                    <ul className="flex space-x-6">
                        <li><Link to="/Latest Movies" className="hover:text-red-600 transition-colors duration-200">Latest Movies</Link></li>
                        <li><Link to="/Watch Trailer" className="hover:text-red-600 transition-colors duration-200">Watch Trailer</Link></li>
                        <li><Link to="/New Releases" className="hover:text-red-600 transition-colors duration-200">New Releases</Link></li>
                    </ul>
                </nav>
                
                
            </div>
        </header>
    );
};

export default Header;