const BASE = 'https://api.spoonacular.com';

async function request(endpoint, apiKey, params = {}) {
  const url = new URL(BASE + endpoint);
  url.searchParams.set('apiKey', apiKey);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 401 || response.status === 402) throw new Error('Invalid API key or daily API limit reached.');
    throw new Error(`Request failed (${response.status}). Please try again.`);
  }
  return response.json();
}

export function searchRecipes(query, apiKey) {
  return request('/recipes/complexSearch', apiKey, { query, number: 9 });
}

export function getRecipeInformation(id, apiKey) {
  return request(`/recipes/${encodeURIComponent(id)}/information`, apiKey);
}