'use client';

import { useState } from 'react';
import { useAnime } from '../../../context/AnimeContext';
import DebugContext from '../../../context/debugComponent'; // Import your debug component

import AnimeSuggestions from '../../components/AnimeSuggestions';
import RecommendationsList from '../../components/RecommendationsList'; // Import the component


const Home = () => {
  const { topAnime, setTopAnime } = useAnime();
  const [submitted, setSubmitted] = useState(false);
  const [recommendations, setRecommendations] = useState([]); // State to store recommendations

  const handleInputChange = (index, value) => {
    const newTopAnime = [...topAnime];
    newTopAnime[index].name = value;
    setTopAnime(newTopAnime);
  };

  const addAnime = () => {
    if (topAnime.length < 10) {
      setTopAnime([...topAnime, { name: '', rank: topAnime.length + 1 }]);
    }
  };

// Submit the data to the Python API
const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (topAnime.length === 10 && topAnime.every((anime) => anime.name.trim())) {
      try {
        const response = await fetch('http://localhost:5000/users/anime', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(topAnime),
        });

        const result = await response.json();
        console.log('Recommendations from API:', result);

        setRecommendations(result);
        setSubmitted(true);
      } catch (error) {
        console.error('Error submitting data:', error);
      }
    } else {
      alert('Please complete your top 10 anime list before submitting!');
    }
  };

  return (
    <div>
      <h1>Your Top 10 Anime</h1>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          {topAnime.map((anime, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <label>
                Rank {anime.rank}:
                <AnimeSuggestions
                index={index}
                value={anime.name}
                onChange={(value) => handleInputChange(index, value)}
                />
              </label>
            </div>
          ))}

          {topAnime.length < 10 && (
            <button type="button" onClick={addAnime} style={{ marginTop: '10px' }}>
              Add Anime
            </button>
          )}

          <br />
          <button type="submit" style={{ marginTop: '20px' }}>
            Submit
          </button>
        </form>
      ) : (
        <div>
          <h2>Thank you for submitting your top 10 anime!</h2>
          <ul>
            {topAnime.map((anime, index) => (
              <li key={index}>
                Rank {anime.rank}: {anime.name}
              </li>
            ))}
          </ul>
          <RecommendationsList recommendations={recommendations} />
        </div>
      )}
      {/* Debugging Component */}
      <DebugContext />
    </div>
  );
};

export default Home;
