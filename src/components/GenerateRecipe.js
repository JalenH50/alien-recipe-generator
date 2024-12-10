import React, { useState, useEffect } from 'react';
import supabase from '../services/supabaseClient';

function GenerateRecipe() {
  const [numSteps, setNumSteps] = useState(3); // Default to 3 steps
  const [steps, setSteps] = useState([]); // Steps array for each step
  const [ingredients, setIngredients] = useState([]); // Store fetched ingredients
  const [methods, setMethods] = useState([]); // Store fetched cooking methods
  const [recipeName, setRecipeName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch ingredients and methods from the database when component mounts
  useEffect(() => {
    const fetchIngredientsAndMethods = async () => {
      const { data: ingredientData, error: ingredientError } = await supabase.from('ingredients').select('*');
      const { data: methodData, error: methodError } = await supabase.from('cooking_methods').select('*');
      
      if (ingredientError || methodError) {
        console.error('Error fetching ingredients or methods:', ingredientError || methodError);
      } else {
        setIngredients(ingredientData);
        setMethods(methodData);
      }
    };
    fetchIngredientsAndMethods();
  }, []);

  // Generate steps based on the number of steps selected
  const handleGenerateRecipe = () => {
    setLoading(true);
    
    let generatedSteps = [];
    for (let i = 0; i < numSteps; i++) {
      generatedSteps.push({
        step_number: i + 1,
        method_name: '',  // Initially empty
        ingredient_name: '',  // Initially empty
        additional_information: '',  // Initially empty
      });
    }

    setSteps(generatedSteps);
    setLoading(false);
  };

  // Handle changes in step inputs (method, ingredient, additional information)
  const handleStepChange = (stepIndex, field, value) => {
    const updatedSteps = [...steps];
    updatedSteps[stepIndex][field] = value;
    setSteps(updatedSteps);
  };

  // Handle the saving of the recipe
  const handleSaveRecipe = async () => {
    if (!recipeName || !imageUrl || steps.some(step => !step.method_name || !step.ingredient_name)) {
      alert('Please provide a recipe name, image, and ensure all steps are filled out.');
      return;
    }

    // Step 1: Collect combined step strings (method + ingredient + additional instructions)
    const combinedSteps = steps.map((step) => {
      const ingredient = ingredients.find(i => i.name === step.ingredient_name);
      const method = methods.find(m => m.method_name === step.method_name);
      
      // Format the step string as "method_name + ingredient + additional information"
      return `${method ? method.method_name : 'No method selected'} ${ingredient ? ingredient.name : 'No ingredient selected'} ${step.additional_information || ''}`.trim();
    });

    // Step 2: Collect tags from the selected ingredients
    const ingredientTags = [];
    for (let step of steps) {
      const ingredient = ingredients.find(i => i.name === step.ingredient_name);
      if (ingredient && ingredient.tags) {
        ingredientTags.push(...ingredient.tags); // Add tags to the array
      }
    }

    // Remove duplicates from the tags
    const uniqueTags = Array.from(new Set(ingredientTags.map(tag => JSON.stringify(tag)))).map(tag => JSON.parse(tag));

    // Step 3: Insert the new recipe into the recipes table
    const { data: recipeData, error: recipeError } = await supabase.from('recipes').insert([{
      name: recipeName,
      image_url: imageUrl,
      tags: uniqueTags.length > 0 ? uniqueTags : null, // Ensure tags are not empty
      steps: combinedSteps // Add combined steps as an array of strings
    }]).select(); // Ensure to select the inserted data

    if (recipeError) {
      console.error('Error saving recipe:', recipeError);
      return;
    }

    // Step 4: Ensure recipeData is populated before accessing it
    if (!recipeData || recipeData.length === 0) {
      console.error('No recipe data returned after insert');
      return;
    }

    const recipeId = recipeData[0].id; // Now we are sure recipeData is valid

    // Step 5: Insert the steps for the generated recipe
    const stepInserts = steps.map((step) => {
      const ingredient = ingredients.find(i => i.name === step.ingredient_name);
      const method = methods.find(m => m.method_name === step.method_name);

      return {
        recipe_id: recipeId,
        step_number: step.step_number,
        method_name: step.method_name,
        ingredient_name: step.ingredient_name, // Store ingredient name
        tags: ingredient ? ingredient.tags : [], // Store tags for each ingredient
        instruction: `${method ? method.method_name : 'No method selected'} ${ingredient ? ingredient.name : 'No ingredient selected'} ${step.additional_information || ''}` // Combined instruction
      };
    });

    // Insert the steps into the cooking_steps table
    const { error: stepError } = await supabase.from('cooking_steps').insert(stepInserts);

    if (stepError) {
      console.error('Error saving steps:', stepError);
    } else {
      console.log('Recipe and steps saved successfully!');
    }
  };

  return (
    <div>
      <h2>Generate Recipe</h2>

      {/* Number of Steps */}
      <div>
        <h3>Number of Steps</h3>
        <input
          type="number"
          value={numSteps}
          min="1"
          max="10"
          onChange={(e) => setNumSteps(Number(e.target.value))}
        />
      </div>

      {/* Generate Recipe Button */}
      <div>
        <button onClick={handleGenerateRecipe} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Recipe'}
        </button>
      </div>

      {/* Display Recipe Steps */}
      <div>
        <h3>Generated Steps</h3>
        {steps.length > 0 ? (
          <div>
            {steps.map((step, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <h4>Step {step.step_number}</h4>

                {/* Method Dropdown */}
                <div>
                  <label>Method</label>
                  <select
                    value={step.method_name}
                    onChange={(e) => handleStepChange(index, 'method_name', e.target.value)}
                  >
                    <option value="">Select Method</option>
                    {methods.map((method) => (
                      <option key={method.id} value={method.method_name}>
                        {method.method_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ingredient Dropdown */}
                <div>
                  <label>Ingredient</label>
                  <select
                    value={step.ingredient_name}
                    onChange={(e) => handleStepChange(index, 'ingredient_name', e.target.value)}
                  >
                    <option value="">Select Ingredient</option>
                    {ingredients.map((ingredient) => (
                      <option key={ingredient.id} value={ingredient.name}>
                        {ingredient.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Additional Information */}
                <div>
                  <label>Additional Information</label>
                  <input
                    type="text"
                    value={step.additional_information}
                    onChange={(e) => handleStepChange(index, 'additional_information', e.target.value)}
                    placeholder="Enter any additional instructions"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No steps generated yet.</p>
        )}
      </div>

      {/* Recipe Name and Image */}
      <div>
        <h3>Recipe Name</h3>
        <input
          type="text"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          placeholder="Enter recipe name"
        />
        <h3>Recipe Image URL</h3>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Enter image URL"
        />
      </div>

      {/* Save Recipe Button */}
      <div>
        <button onClick={handleSaveRecipe} disabled={loading}>
          Save Recipe
        </button>
      </div>
    </div>
  );
}

export default GenerateRecipe;
