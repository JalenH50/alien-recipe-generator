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
    if (error) {
      console.error('Error fetching recipes:', error);
    } else {
      setRecipes(data);
    }
  };

  // Helper function to check if search term matches recipe name or tags
  const matchesSearchTerm = (recipe) => {
    const isNameMatch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());

    const isTagMatch = recipe.tags && recipe.tags.some(tag => 
      tag?.name && tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return isNameMatch || isTagMatch;
  };

  const filteredRecipes = recipes.filter(recipe => matchesSearchTerm(recipe));

  // Function to increment the like count for a recipe
  const handleLike = async (recipeId, currentLikes) => {
    const newLikes = currentLikes + 1;

    // Update the likes count in the database
    const { data, error } = await supabase
      .from('recipes')
      .update({ likes: newLikes })
      .eq('id', recipeId)
      .select();

    if (error) {
      console.error('Error updating likes:', error);
    } else {
      // Update the state to reflect the new likes count
      const updatedRecipes = recipes.map((recipe) =>
        recipe.id === recipeId ? { ...recipe, likes: newLikes } : recipe
      );
      setRecipes(updatedRecipes);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="recipe-list">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map(recipe => (
            <div key={recipe.id} className="recipe-item">
              <div className="recipe-header">
                <Link to={`/recipe/${recipe.id}`}>
                  <h2>{recipe.name}</h2>
                </Link>

                {/* Like Button */}
                <button
                  onClick={() => handleLike(recipe.id, recipe.likes)}
                  className="like-button"
                >
                  Like {recipe.likes || 0}
                </button>
              </div>

              <img src={recipe.image_url} alt={recipe.name} />
            </div>
          ))
        ) : (
          <p>No recipes found</p>
        )}
      </div>
    </div>
  );
}

export default RecipeList;
