const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://whqsvvxwxqdwlaskfdtd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndocXN2dnh3eHFkd2xhc2tmZHRkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzc2MDQ1MCwiZXhwIjoyMDQ5MzM2NDUwfQ.KblmO5ajJ31rTy1aTGBCyiwiRt8lQNiSV5lkEwBl4t4"
);

// Function to seed the database
async function seedDatabase() {
  try {
    // Start by clearing data from the tables
    const { error: deleteTagsError } = await supabase.from('tags').delete();
    const { error: deleteIngredientsError } = await supabase.from('ingredients').delete();
    const { error: deleteMethodsError } = await supabase.from('cooking_methods').delete();
    const { error: deleteRecipesError } = await supabase.from('recipes').delete();

    if (deleteTagsError || deleteIngredientsError || deleteMethodsError || deleteRecipesError) {
      console.error('Error clearing tables:', deleteTagsError || deleteIngredientsError || deleteMethodsError || deleteRecipesError);
      return;
    }

    // Insert data into 'tags' table
    const { error: insertTagsError } = await supabase.from('tags').insert([
      { id: 1, name: 'wet' },
      { id: 2, name: 'dry' },
      { id: 3, name: 'crunchy' },
      { id: 4, name: 'hard' },
      { id: 5, name: 'soft' },
      { id: 6, name: 'salty' },
      { id: 7, name: 'powdery' }
    ]);

    if (insertTagsError) {
      console.error('Error inserting tags:', insertTagsError);
      return;
    }

    // Insert data into 'ingredients' table
    const { error: insertIngredientsError } = await supabase.from('ingredients').insert([
      { id: 1, name: 'Milk', tags: [1] },
      { id: 2, name: 'Water', tags: [1] },
      { id: 3, name: 'Flour', tags: [7] },
      { id: 4, name: 'Peanuts', tags: [3] },
      { id: 5, name: 'Sugar', tags: [7] },
      { id: 6, name: 'Salt', tags: [6] }
    ]);

    if (insertIngredientsError) {
      console.error('Error inserting ingredients:', insertIngredientsError);
      return;
    }

    // Insert data into 'cooking_methods' table
    const { error: insertMethodsError } = await supabase.from('cooking_methods').insert([
      { id: 1, method_name: 'Bake' },
      { id: 2, method_name: 'Fry' },
      { id: 3, method_name: 'Boil' }
    ]);

    if (insertMethodsError) {
      console.error('Error inserting cooking methods:', insertMethodsError);
      return;
    }

    // Insert data into 'recipes' table
    const { error: insertRecipesError } = await supabase.from('recipes').insert([
      {
        id: 1,
        name: 'Vegan Pancakes',
        image_url: 'https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fill,g_auto,w_728,h_546/k%2FPhoto%2FRecipes%2F2024-06-seo-pancakes%2Fseo-pancakes-232',
        likes: 2,
        tags: [2, 3, 4],
        steps: ['Burn Batter for 30 minutes', 'Eat the pancakes']
      },
      {
        id: 2,
        name: 'Chocolate Cake',
        image_url: 'https://scientificallysweet.com/wp-content/uploads/2023/06/IMG_4087-er-new1-720x910.jpg',
        likes: 5,
        tags: [1, 5, 7],
        steps: ['Mix Flour, milk, and eggs', 'Cook for a long time']
      },
      {
        id: 3,
        name: 'A ruined Kitchen',
        image_url: 'https://i.fbcd.co/products/resized/resized-750-500/c-1000-designbundle-kitchen-messy-dirt03-17-08-98b7c35505bdf3a400092df94558c73f8809f1b4f922bf931fc2b2f8fda88b02.webp',
        likes: 2,
        tags: [3, 1],
        steps: ['Bake Peanuts Until Burnt', 'Boil Water Until Overflow', 'Fry Milk Until stinky']
      }
    ]);

    if (insertRecipesError) {
      console.error('Error inserting recipes:', insertRecipesError);
      return;
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  }
}

// Call the seed function
seedDatabase();
