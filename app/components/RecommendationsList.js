const RecommendationsList = ({ recommendations }) => {
    if (!recommendations || recommendations.length === 0) {
      return <p>No recommendations available yet.</p>;
    }
  
    return (
      <div>
        <h2>Recommended Anime</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {recommendations.map((anime) => (
            <li
              key={anime.anime_id}
              style={{
                marginBottom: '10px',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
              }}
            >
              <h3>{anime.anime_name}</h3>
              <p>Average Rating: {anime.avg_rating.toFixed(2)}</p>
              <p>Rated by {anime.count} users</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default RecommendationsList;
  