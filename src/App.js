import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './component/header/Header';
import Home from './pages/home/home';
import MovieList from './component/movielist/movielist';
import MovieDetails from './pages/MovieDetails/MovieDetails'; 
function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route index element={<Home />} />
          <Route path="movies/:id" element={<MovieDetails />} />
          <Route path="movies/:type" element={<MovieList />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;