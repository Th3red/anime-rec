import { useState, useEffect } from 'react';

const AnimeSuggestions = ({ index, value, onChange }) => {
  const [query, setQuery] = useState(value); // Keep track of user input
  const [suggestions, setSuggestions] = useState([]); // Suggestions from API

  useEffect(() => {
    setQuery(value); // Sync with parent value
  }, [value]);

  // Fetch suggestions from the backend API
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim() === '') {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/anime-suggestions?query=${query}`);
        const data = await response.json();
        setSuggestions(data.slice(0, 10)); // Limit to 10 suggestions
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    fetchSuggestions();
  }, [query]);

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          const newValue = e.target.value;
          setQuery(newValue);
          onChange(newValue); // Notify parent of the change
        }}
        placeholder={`Anime ${index + 1}`}
        style={{ marginBottom: '10px', padding: '5px', width: '200px' }}
      />
      {suggestions.length > 0 && (
        <ul style={{ border: '1px solid #ccc', position: 'absolute', zIndex: 1000, background: 'white', padding: '10px', width: '200px' }}>
          {suggestions.map((anime, i) => (
            <li
              key={i}
              style={{ cursor: 'pointer', padding: '5px', listStyle: 'none' }}
              onClick={() => {
                setQuery(anime); // Update input value
                onChange(anime); // Notify parent of the selected suggestion
                setSuggestions([]); // Clear suggestions
              }}
            >
              {anime}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AnimeSuggestions;
