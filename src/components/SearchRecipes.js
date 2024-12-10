import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../services/supabaseClient'; // Adjust the import path if necessary
import '../styles/SearchRecipes.css';

function SearchRecipes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [tags, setTags] = useState([]);

  // Fetch tags from the database
  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase.from('tags').select('*');
      if (error) {
        console.error('Error fetching tags:', error);
      } else {
        setTags(data);
      }
    };

    fetchTags();
  }, []);

  // Fetch recipes based on search term
  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      alert('Please enter a search term.');
      return;
    }

    // Query the recipes by name or tag
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .ilike('name', `%${searchTerm}%`) // Search by recipe name (case-insensitive)
      .or(`tags.ilike.%${searchTerm}%`); // Search by tag (case-insensitive)

    if (error) {
      console.error('Error fetching recipes:', error);
    } else {
      setRecipes(data);
    }
  };

  return (
    <div>
      <h2>Search Recipes</h2>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Search by name or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Search Results */}
      <div>
        {recipes.length > 0 ? (
          <div>
            <h3>Search Results</h3>
            <ul>
              {recipes.map((recipe) => (
                <li key={recipe.id}>
                  <Link to={`/recipe/${recipe.id}`}>
                    <h4>{recipe.name}</h4>
                  </Link>
                  {/* Display tags for the recipe */}
                  <p>Tags: {recipe.tags.join(', ')}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No recipes found for "{searchTerm}".</p>
        )}
      </div>
    </div>
  );
}

export default SearchRecipes;
