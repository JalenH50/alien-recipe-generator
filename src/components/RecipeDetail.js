import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../services/supabaseClient'; // Adjust the import path if necessary
import '../styles/RecipeDetail.css';

function RecipeDetail() {
  const { id } = useParams();  // Get the recipe id from the URL
  const [recipe, setRecipe] = useState(null);
  const [likes, setLikes] = useState(0);  // State to track likes

  // Fetch recipe details from Supabase
  useEffect(() => {
    const fetchRecipe = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();  // Fetch the recipe by id

      if (error) {
        console.error('Error fetching recipe:', error);
      } else {
        setRecipe(data);  // Store recipe data
        setLikes(data.likes || 0);  // Set initial likes
      }
    };

    fetchRecipe();
  }, [id]);

  // Handle the "like" button click
  const handleLike = async () => {
    const updatedLikes = likes + 1;
    setLikes(updatedLikes);  // Update local state to immediately reflect the like count

    // Update the likes count in Supabase
    const { error } = await supabase
      .from('recipes')
      .update({ likes: updatedLikes })
      .eq('id', id);  // Update the likes for the recipe with the given id

    if (error) {
      console.error('Error updating likes:', error);
    }
  };

  if (!recipe) {
    return <p>Loading recipe...</p>;  // Loading state
  }

  return (
    <div>
      <h2>{recipe.name}</h2>
      {/* Display image if available */}
      {recipe.image_url && <img src={recipe.image_url} alt={recipe.name} />}
      <p><strong>Tags:</strong> {recipe.tags.join(', ')}</p>
      <p><strong>Steps:</strong></p>
      <ul>
        {recipe.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ul>

      {/* Like button */}
      <div>
        <p><strong>Likes:</strong> {likes}</p>
        <button onClick={handleLike}>Like</button> {/* On click, increments likes */}
      </div>
    </div>
  );
}

export default RecipeDetail;
