'use client'; // Use client-side rendering for fetching CSV

import { useState, useEffect } from 'react';
import { fetchCSVData } from '../utils/fetchCSV';
import { fetchRatingsCSVData } from '../utils/fetch_ratingsCSV';
const Home = () => {
  const [animeData, setAnimeData] = useState([]);
  const [ratingsData, setRatingsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCSVData();
      const ratings = await fetchRatingsCSVData();
      
      setAnimeData(data.slice(0, 10)); // Display only the first 10 rows for now
      setRatingsData(ratings.slice(0, 10));
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Anime Recommendations</h1>
      <table>
        <thead>
          <tr>
            {animeData[0] &&
              Object.keys(animeData[0]).map((header) => (
                <th key={header}>{header}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {animeData.map((anime, index) => (
            <tr key={index}>
              {Object.values(anime).map((value, idx) => (
                <td key={idx}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>


    <h2>Ratings Data</h2>
    <table>
    <thead>
        <tr>
        {ratingsData[0] &&
            Object.keys(ratingsData[0]).map((header) => (
            <th key={header}>{header}</th>
            ))}
        </tr>
    </thead>
    <tbody>
        {ratingsData.map((rating, index) => (
        <tr key={index}>
            {Object.values(rating).map((value, idx) => (
            <td key={idx}>{value}</td>
            ))}
        </tr>
        ))}
    </tbody>
    </table>
    </div>
  );
};

export default Home;
