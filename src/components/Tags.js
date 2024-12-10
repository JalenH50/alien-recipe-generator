import React, { useState, useEffect } from 'react';
import supabase from '../services/supabaseClient';  // Assuming you're using Supabase

function Tags() {
  const [tagName, setTagName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);  // State to store the tags

  // Function to fetch tags from Supabase
  const fetchTags = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tags')  // Assuming you're using Supabase and the 'tags' table
        .select('*');
      
      if (error) {
        setError('Error fetching tags: ' + error.message);
      } else {
        setTags(data);  // Update the tags state
      }
    } catch (err) {
      setError('Unexpected error: ' + err.message);
    }
    setLoading(false);
  };

  // Fetch tags when the component mounts
  useEffect(() => {
    fetchTags();
  }, []);

  // Handle the form submission to create a new tag
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tagName.trim()) {
      alert('Please provide a tag name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('tags')  // Insert into the 'tags' table
        .insert([{ name: tagName }]);

      if (error) {
        setError('Error adding tag: ' + error.message);
      } else {
        // After successfully inserting, refetch the tags and reset the form
        fetchTags();
        setTagName('');  // Clear the input field
        alert('Tag added successfully!');
      }
    } catch (err) {
      setError('Unexpected error: ' + err.message);
    }
    setLoading(false);
  };

  // Handle the deletion of a tag
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('tags')  // Delete from the 'tags' table
        .delete()
        .eq('id', id);

      if (error) {
        setError('Error deleting tag: ' + error.message);
      } else {
        // After deleting, refetch the tags to update the list
        fetchTags();
      }
    } catch (err) {
      setError('Unexpected error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Tags</h2>

      {/* Display the list of tags in a table */}
      <table>
        <thead>
          <tr>
            <th>Tag Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag.id}>
              <td>{tag.name}</td>
              <td>
                <button onClick={() => handleDelete(tag.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form to create a new tag */}
      <h3>Create New Tag</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tag Name:</label>
          <input
            type="text"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Tag'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Tags;
