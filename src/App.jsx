import { BrowserRouter, HashRouter, Link, NavLink, Route, Routes } from 'react-router';
import RecipeFinder from './RecipeFinder.jsx';

function About() {
  return <main className="site-width about-page">
    <p className="eyebrow">ABOUT THIS PROJECT</p>
    <h1>About Recipe Finder</h1>
    <p>Recipe Finder is a CPIT405 Lab 9 React project. Search for food ideas and open any recipe to explore the ingredients and cooking instructions.</p>
    <p>It uses React state, event handlers, fetch with useState when the user searches, and useEffect to request recipe details when a recipe is selected.</p>
    <p>Data is provided by the <a href="https://spoonacular.com/food-api" target="_blank" rel="noreferrer">Spoonacular API</a>. You need your own API key.</p>
    <Link className="primary-btn" to="/">Back to recipes</Link>
  </main>;
}

const Router = HashRouter;
export default function App() {
  return <Router>
    <header className="topbar"><div className="site-width bar-inner">
      <Link className="brand" to="/">Recipe<span>Finder</span></Link>
      <nav aria-label="Main navigation"><NavLink end to="/">Home</NavLink><NavLink to="/about">About us</NavLink></nav>
    </div></header>
    <Routes>
      <Route path="/" element={<RecipeFinder/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="*" element={<main className="site-width"><h1>Page not found</h1><Link to="/">Home</Link></main>}/>
    </Routes>
    <footer className="site-width foot">CPIT405 · Lab 9 · React and Spoonacular API</footer>
  </Router>;
}