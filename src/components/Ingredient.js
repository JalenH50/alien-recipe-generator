import React, { useState, useEffect } from 'react';
import supabase from '../services/supabaseClient'; // Assuming you're using Supabase

function Ingredients() {
  const [ingredientName, setIngredientName] = useState('');
  const [tags, setTags] = useState([]); // Store selected tag objects
  const [allTags, setAllTags] = useState([]); // To fetch available tags
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState([]); // State to store ingredients
  const [error, setError] = useState(null); // For handling errors

  // Function to fetch ingredients from Supabase
  const fetchIngredients = async () => {
    setLoading(true);
    setError(null); // Reset errors before the fetch
    try {
      const { data, error } = await supabase.from('ingredients').select('*');
      if (error) {
        setError('Error fetching ingredients: ' + error.message);
      } else {
        const ingredientsWithTags = await Promise.all(
          data.map(async (ingredient) => {
            const { data: tagsData } = await supabase
              .from('tags')
              .select('*')
              .in('id', ingredient.tags || []); // Get the tags for the ingredient by their IDs
            return {
              id: ingredient.id,
              name: ingredient.name,
              tags: tagsData || [],
            };
          })
        );
        setIngredients(ingredientsWithTags); // Update the ingredients state
      }
    } catch (err) {
      setError('Unexpected error: ' + err.message);
    }
    setLoading(false);
  };

  // Function to fetch tags from Supabase
  const fetchTags = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('tags').select('*');
      if (error) {
        setError('Error fetching tags: ' + error.message);
      } else {
        setAllTags(data); // Set available tags
      }
    } catch (err) {
      setError('Unexpected error: ' + err.message);
    }
    setLoading(false);
  };

  // Fetch ingredients and tags when the component mounts
  useEffect(() => {
    fetchIngredients();
    fetchTags();
  }, []);

  // Handle the tag selection (ensure tags are set correctly)
  const handleTagChange = (e) => {
    const selectedTagIds = [...e.target.selectedOptions].map(option => option.value);
    const selectedTagObjects = allTags.filter(tag => selectedTagIds.includes(tag.id.toString()));
    setTags(selectedTagObjects); // Set the full tag objects, not just ids
  };

  // Handle the form submission to create a new ingredient
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ingredientName || tags.length === 0) {
      alert('Please provide an ingredient name and select tags.');
      return;
    }

    setLoading(true);
    setError(null); // Reset errors before submitting

    const tagIds = tags.map(tag => tag.id); // Map selected tags to their ids

    try {
      // Insert new ingredient
      const { data, error } = await supabase.from('ingredients').insert([
        { name: ingredientName, tags: tagIds }, // Store tags as jsonb array of IDs
      ]);

      if (error) {
        setError('Error adding ingredient: ' + error.message);
      } else {
        // Check if data is empty or null before accessing [0]
        if (data && data.length > 0) {
          const ingredientId = data[0].id;

          // Fetch the corresponding tags for the new ingredient
          const { data: tagsData, error: tagFetchError } = await supabase
            .from('tags')
            .select('*')
            .in('id', tagIds);

          if (tagFetchError) {
            setError('Error fetching tags: ' + tagFetchError.message);
          } else {
            // Update the ingredients state with the newly added ingredient
            setIngredients((prevIngredients) => [
              ...prevIngredients,
              {
                id: ingredientId,
                name: ingredientName,
                tags: tagsData, // Use full tag objects
              },
            ]);
          }
        }
      }

      // Reset form and refetch the ingredients
      setIngredientName('');
      setTags([]);
      fetchIngredients(); // Refetch ingredients to ensure the list is updated
    } catch (err) {
      setError('Unexpected error: ' + err.message);
    }
    setLoading(false); // Stop the loading state after operation
  };

  // Handle deleting an ingredient
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('ingredients')
        .delete()
        .eq('id', id);

      if (error) {
        setError('Error deleting ingredient: ' + error.message);
      } else {
        // After deleting, refetch the ingredients to update the list
        fetchIngredients();
      }
    } catch (err) {
      setError('Unexpected error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Ingredients</h2>

      {/* Display the list of ingredients in a table */}
      <table>
        <thead>
          <tr>
            <th>Ingredient Name</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient) => (
            <tr key={ingredient.id}>
              <td>{ingredient.name}</td>
              <td>{(ingredient.tags || []).map(tag => tag.name).join(', ')}</td>
              <td>
                <button onClick={() => handleDelete(ingredient.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form to create a new ingredient */}
      <h3>Create New Ingredient</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ingredient Name:</label>
          <input
            type="text"
            value={ingredientName}
            onChange={(e) => setIngredientName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Tags:</label>
          <select
            multiple
            value={tags.map(tag => tag.id)} // Store and display tag ids in the select
            onChange={handleTagChange}
            required
          >
            {allTags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Ingredient'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Ingredients;
