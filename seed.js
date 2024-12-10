const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://whqsvvxwxqdwlaskfdtd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndocXN2dnh3eHFkd2xhc2tmZHRkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzc2MDQ1MCwiZXhwIjoyMDQ5MzM2NDUwfQ.KblmO5ajJ31rTy1aTGBCyiwiRt8lQNiSV5lkEwBl4t4"
);

const seedData = async () => {
  console.log('Starting database seeding process...');

  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await clearOldData();

    // Insert Ingredients
    const ingredients = ['Flour', 'Sugar', 'Eggs', 'Butter'];
    const ingredientData = await insertData('ingredients', ingredients.map(name => ({ name })), 'ingredients');
    if (!ingredientData || ingredientData.length === 0) {
      throw new Error('No ingredients were inserted into the database.');
    }
    console.log('Ingredients inserted:', ingredientData);

    // Insert Cooking Methods
    const methods = ['Bake', 'Fry', 'Boil'];
    const methodData = await insertData('cooking_methods', methods.map(method_name => ({ method_name })), 'methods');
    if (!methodData || methodData.length === 0) {
      throw new Error('No cooking methods were inserted into the database.');
    }
    console.log('Methods inserted:', methodData);

    // Insert Tags
    const tags = ['Dessert', 'Vegan', 'Quick', 'Healthy'];
    const tagData = await insertData('tags', tags.map(name => ({ name })), 'tags');
    if (!tagData || tagData.length === 0) {
      throw new Error('No tags were inserted into the database.');
    }
    console.log('Tags inserted:', tagData);

    // Insert Recipes
    const recipes = [
      { name: 'Vegan Pancakes', image_url: 'https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fill,g_auto,w_728,h_546/k%2FPhoto%2FRecipes%2F2024-06-seo-pancakes%2Fseo-pancakes-232' },
      { name: 'Chocolate Cake', image_url: 'https://scientificallysweet.com/wp-content/uploads/2023/06/IMG_4087-er-new1-720x910.jpg' }
    ];
    const recipeData = await insertData('recipes', recipes, 'recipes');
    if (!recipeData || recipeData.length === 0) {
      throw new Error('No recipes were inserted into the database.');
    }
    console.log('Recipes inserted:', recipeData);

    // Insert Cooking Steps for each recipe
    for (let recipe of recipeData) {
      await insertCookingSteps(recipe.id, ingredientData, methodData);
    }

    // Link Recipes and Tags
    for (let recipe of recipeData) {
      await insertRecipeTags(recipe.id, tagData);
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
};

const clearOldData = async () => {
  const tables = ['recipes', 'tags', 'ingredients', 'cooking_methods', 'cooking_steps', 'recipe_tags'];

  for (const table of tables) {
    try {
      console.log(`Clearing data from ${table}...`);
      await supabase.from(table).delete();
      console.log(`Successfully cleared data from ${table}`);
    } catch (error) {
      console.error(`Error clearing data from ${table}:`, error.message);
    }
  }
};

const insertData = async (tableName, data, dataType) => {
  try {
    console.log(`Inserting ${dataType} data into ${tableName}...`);
    const { data: insertedData, error } = await supabase
      .from(tableName)
      .insert(data);

    if (error) {
      throw new Error(`Error inserting ${dataType} data into ${tableName}: ${error.message}`);
    }

    if (!insertedData || insertedData.length === 0) {
      throw new Error(`No data returned after inserting ${dataType} into ${tableName}.`);
    }

    console.log(`${dataType.charAt(0).toUpperCase() + dataType.slice(1)} inserted successfully into ${tableName}`);
    console.log(`Inserted Data:`, insertedData); // Log the actual data returned
    return insertedData;
  } catch (error) {
    console.error(`Failed to insert ${dataType} into ${tableName}:`, error.message);
    throw error; // Re-throw to stop further execution
  }
};

const insertCookingSteps = async (recipeId, ingredients, methods) => {
  try {
    const cookingSteps = ingredients.map((ingredient, index) => ({
      recipe_id: recipeId,
      step_number: index + 1,
      instruction: `${methods[index % methods.length].method_name} ${ingredient.name}`,
      ingredient_id: ingredient.id,
      method_id: methods[index % methods.length].id,
    }));

    console.log("Inserting cooking steps: ", cookingSteps);
    const { data: insertedSteps, error: stepsError } = await supabase
      .from('cooking_steps')
      .insert(cookingSteps);

    if (stepsError) {
      throw new Error(`Error inserting cooking steps: ${stepsError.message}`);
    }

    if (!insertedSteps || insertedSteps.length === 0) {
      throw new Error('No cooking steps inserted.');
    }

    console.log('Cooking steps inserted:', insertedSteps);
    return insertedSteps;
  } catch (error) {
    console.error('Failed to insert cooking steps:', error.message);
    throw error;
  }
};

const insertRecipeTags = async (recipeId, tags) => {
  try {
    const recipeTags = tags.map(tag => ({
      recipe_id: recipeId,
      tag_id: tag.id,
    }));

    console.log("Inserting recipe tags: ", recipeTags);
    const { data: insertedTags, error: tagsError } = await supabase
      .from('recipe_tags')
      .insert(recipeTags);

    if (tagsError) {
      throw new Error(`Error inserting recipe tags: ${tagsError.message}`);
    }

    if (!insertedTags || insertedTags.length === 0) {
      throw new Error('No recipe tags inserted.');
    }

    console.log('Recipe tags inserted:', insertedTags);
    return insertedTags;
  } catch (error) {
    console.error('Failed to insert recipe tags:', error.message);
    throw error;
  }
};

// Run the seeding function
seedData();
