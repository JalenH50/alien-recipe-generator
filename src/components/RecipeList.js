import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../services/supabaseClient';

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    const { data, error } = await supabase.from('recipes').select('*');
    if (error) console.error('Error fetching recipes:', error);
    else setRecipes(data);
  };

  const filteredRecipes = recipes.filter(recipe => recipe.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="recipe-list">
        {filteredRecipes.map(recipe => (
          <div key={recipe.id}>
            <Link to={`/recipe/${recipe.id}`}>
              <h2>{recipe.name}</h2>
            </Link>
            <img src={recipe.image_url} alt={recipe.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipeList;
