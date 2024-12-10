import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../services/supabaseClient';

function RecipeDetails() {
  const { id } = useParams(); // Get the recipe ID from the URL
  const [recipe, setRecipe] = useState(null);
  const [steps, setSteps] = useState([]);

  // Define the fetch function outside useEffect to avoid the warning
  const fetchRecipeDetails = async () => {
    // Fetch recipe details based on the recipe ID
    const { data: recipeData, error: recipeError } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (recipeError) {
      console.error('Error fetching recipe details:', recipeError);
    } else {
      setRecipe(recipeData);
      // If the steps column is available, store it as an array
      setSteps(recipeData.steps || []); // `steps` will already be an array of strings
    }
  };

  useEffect(() => {
    fetchRecipeDetails();
  }, [id]); // Only re-run when `id` changes

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{recipe.name}</h2>
      <img src={recipe.image_url} alt={recipe.name} />
      <h3>Steps</h3>
      <ol>
        {steps.length > 0 ? (
          steps.map((step, index) => (
            <li key={index}>
              {step}
            </li>
          ))
        ) : (
          <li>No steps available</li>
        )}
      </ol>
    </div>
  );
}

export default RecipeDetails;
