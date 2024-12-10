import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import GenerateRecipe from './GenerateRecipe';
import RecipeList from './RecipeList';
import SearchRecipes from './SearchRecipes';
import RecipeDetail from './RecipeDetail';
import Ingredient from './Ingredient';  
import Tags from './Tags';  // Import CreateTag page
import CookingMethods from './CookingMethods';  // Import CookingMethods page
import '../styles/App.css';

function App() {
  return (
    <Router>
      <div>
        {/* Banner Section */}
        <div className="banner">
          <h1>Alien Recipe Generator</h1>
          <div className="nav-links">
            <Link to="/generate">Generate Recipe</Link>
            <Link to="/recipes">Search Recipes</Link>
            <Link to="/search">Search Recipes</Link>
            <Link to="/ingredients">Ingredients</Link>
            <Link to="/tags">Tags</Link> {/* Link to Tags */}
            <Link to="/cooking-methods">Cooking Methods</Link> {/* New Link for Cooking Methods */}
          </div>
        </div>

        {/* Main Content */}
        <div className="container">
          <Routes>
            <Route path="/generate" element={<GenerateRecipe />} />
            <Route path="/recipes" element={<RecipeList />} />
            <Route path="/search" element={<SearchRecipes />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/ingredients" element={<Ingredient />} />
            <Route path="/tags" element={<Tags />} /> {/* Route for Tags */}
            <Route path="/cooking-methods" element={<CookingMethods />} /> {/* New Route for Cooking Methods */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
