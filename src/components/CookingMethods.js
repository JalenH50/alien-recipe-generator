import React, { useState, useEffect } from 'react';
import supabase from '../services/supabaseClient';  // Assuming you're using Supabase

function CookingMethods() {
  const [methodName, setMethodName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cookingMethods, setCookingMethods] = useState([]);  // State to store cooking methods

  // Function to fetch cooking methods from Supabase
  const fetchCookingMethods = async () => {
    setLoading(true);
    setError(null); // Reset errors before the fetch
    try {
      const { data, error } = await supabase.from('cooking_methods').select('*');
      if (error) {
        setError('Error fetching cooking methods: ' + error.message);
      } else {
        setCookingMethods(data); // Set fetched cooking methods
      }
    } catch (err) {
      setError('Unexpected error: ' + err.message);
    }
    setLoading(false);
  };

  // Fetch cooking methods when the component mounts
  useEffect(() => {
    fetchCookingMethods();
  }, []);

  // Handle the form submission to create a new cooking method
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!methodName.trim()) {
      alert('Please provide a cooking method name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('cooking_methods')  // Insert into the 'cooking_methods' table
        .insert([{ method_name: methodName }]);  // Change 'name' to 'method_name'

      if (error) {
        setError('Error adding cooking method: ' + error.message);
      } else {
        // After successfully inserting, refetch the cooking methods and reset the form
        fetchCookingMethods();
        setMethodName('');  // Clear the input field
        alert('Cooking method added successfully!');
      }
    } catch (err) {
      setError('Unexpected error: ' + err.message);
    }
    setLoading(false);
  };

  // Handle the deletion of a cooking method
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('cooking_methods')  // Delete from the 'cooking_methods' table
        .delete()
        .eq('id', id);

      if (error) {
        setError('Error deleting cooking method: ' + error.message);
      } else {
        // After deleting, refetch the cooking methods to update the list
        fetchCookingMethods();
      }
    } catch (err) {
      setError('Unexpected error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Cooking Methods</h2>

      {/* Display the list of cooking methods in a table */}
      <table>
        <thead>
          <tr>
            <th>Cooking Method</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cookingMethods.map((method) => (
            <tr key={method.id}>
              <td>{method.method_name}</td>  {/* Change 'name' to 'method_name' */}
              <td>
                <button onClick={() => handleDelete(method.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form to create a new cooking method */}
      <h3>Create New Cooking Method</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cooking Method Name:</label>
          <input
            type="text"
            value={methodName}
            onChange={(e) => setMethodName(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Cooking Method'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CookingMethods;
