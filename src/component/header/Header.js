import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
        <header>
            <nav>
                <ul>
                    <li><Link to="/Latest Movies">Latest Movies</Link></li>
                    <li><Link to="/Watch Trailer">Watch Trailer</Link></li>
                    <li><Link to="/New Releases">New Releases</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;