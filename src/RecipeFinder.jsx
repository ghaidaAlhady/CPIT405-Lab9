import React, { useEffect, useState } from "react";
import { getRecipeInformation, searchRecipes } from './api.js';

function RecipeDetails({ recipeId, apiKey, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // useEffect: request detailed recipe information on component load/selection.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setDetails(null);
    setError('');
    getRecipeInformation(recipeId, apiKey)
      .then(result => { if (!cancelled) setDetails(result); })
      .catch(err => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [recipeId, apiKey]);

  return <div className="overlay" role="presentation" onClick={onClose}>
    <section className="detail" role="dialog" aria-modal="true" aria-label="Recipe details" onClick={event => event.stopPropagation()}>
      <button className="close" onClick={onClose} aria-label="Close details">×</button>
      {loading && <p className="notice">Loading recipe details…</p>}
      {error && <p className="notice error" role="alert">{error}</p>}
      {details && <>
        <img className="detail-cover" src={details.image} alt={details.title}/>
        <div className="detail-body"><h2>{details.title}</h2>
          <p className="meta">Ready in {details.readyInMinutes || '—'} min · {details.servings || '—'} servings</p>
          <h3>Ingredients</h3>
          <ul>{(details.extendedIngredients || []).map((ingredient, index) => <li key={`${ingredient.id || index}-${index}`}>{ingredient.original || ingredient.name}</li>)}</ul>
          <h3>Instructions</h3>
          {details.analyzedInstructions?.[0]?.steps?.length ?
            <ol>{details.analyzedInstructions[0].steps.map(step => <li key={step.number}>{step.step}</li>)}</ol> :
            <p>{details.instructions ? details.instructions.replace(/<[^>]*>/g, ' ') : 'Instructions are not available for this recipe.'}</p>}
          {details.sourceUrl && <a href={details.sourceUrl} target="_blank" rel="noreferrer">View original recipe</a>}
        </div>
      </>}
    </section>
  </div>;
}

export default function RecipeFinder() {
  const [apiKey, setApiKey] = useState('');
  const [query, setQuery] = useState('pasta');
  const [recipes, setRecipes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  async function handleSearch(event) {
    event.preventDefault();
    setSearched(true);
    setError('');
    setSelectedId(null);
    if (!apiKey.trim()) { setError('Enter your Spoonacular API key first.'); return; }
    if (!query.trim()) { setError('Enter a recipe name to search.'); return; }
    setLoading(true);
    try {
      // Fetch triggered by a user event; results saved with useState.
      const result = await searchRecipes(query.trim(), apiKey.trim());
      setRecipes(Array.isArray(result.results) ? result.results : []);
    } catch (err) { setError(err.message); setRecipes([]); }
    finally { setLoading(false); }
  }

  return <main className="site-width">
    <section className="hero"><p className="eyebrow">EXPLORE SOMETHING DELICIOUS</p>
      <h1>Find your next <em>favorite recipe.</em></h1>
      <p>Search meals, browse photos, and discover every ingredient in one place.</p>
    </section>
    <form className="search-panel" onSubmit={handleSearch}>
      <label htmlFor="api-key">Spoonacular API key</label>
      <input id="api-key" type="password" placeholder="Enter your API key (not saved)" value={apiKey} onChange={event => setApiKey(event.target.value)} autoComplete="off"/>
      <label htmlFor="recipe-search">What would you like to cook?</label>
      <div className="search-row"><input id="recipe-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try pasta, chicken, pancakes…"/>
        <button className="primary-btn" type="submit" disabled={loading}>{loading ? 'Searching…' : 'Search recipes'}</button>
      </div>
      <small>Get an API key at <a href="https://spoonacular.com/food-api" target="_blank" rel="noreferrer">spoonacular.com</a>. It is used for these requests only; don't publish it in code.</small>
    </form>
    {error && <p className="notice error" role="alert">{error}</p>}
    <div className="results-header"><h2>Recipe results</h2><span>{recipes.length} recipes</span></div>
    {!loading && searched && !error && recipes.length === 0 && <p className="notice">No recipes found. Try a different search term.</p>}
    {!searched && <p className="notice">Enter your API key and press Search recipes to get started.</p>}
    <section className="recipe-grid" aria-label="Search results">
      {recipes.map(recipe => <article className="recipe-card" key={recipe.id}>
        {recipe.image && <img src={recipe.image} alt={recipe.title} loading="lazy"/>}
        <div className="recipe-content"><h3>{recipe.title}</h3><button className="text-btn" onClick={() => setSelectedId(recipe.id)}>View recipe details →</button></div>
      </article>)}
    </section>
    {selectedId !== null && <RecipeDetails recipeId={selectedId} apiKey={apiKey.trim()} onClose={() => setSelectedId(null)}/>}
  </main>;
}