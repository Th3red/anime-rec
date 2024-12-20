from flask import Flask, request, jsonify
import pandas as pd
from fuzzywuzzy import process

ratings = pd.read_csv('rating.csv')
print(ratings.head())
app = Flask(__name__)

@app.route('/users/anime', methods=['POST'])
def get_recommendations():
    user_top_anime = request.json  # Retrieve the JSON data from React
    print('User Top Anime:', user_top_anime)

    # Convert user anime names to IDs using the fuzzy matching function
    user_anime_ids = set()
    for anime in user_top_anime:
        anime_id = get_anime_id_by_name_fuzzy(anime['name'])  # Fuzzy match to find anime_id
        if anime_id:
            user_anime_ids.add(anime_id)

    print('Converted Anime IDs:', user_anime_ids)

    # Match ratings for user's anime list
    matched_ratings = ratings[ratings['anime_id'].isin(user_anime_ids)]

    # Find users with similar anime lists
    user_match_counts = matched_ratings.groupby('user_id')['anime_id'].count()
    similar_users = user_match_counts[user_match_counts >= 5]
    similar_users_data = ratings[ratings['user_id'].isin(similar_users.index)]

    # Find anime rated highly by similar users
    anime_from_similar = similar_users_data[similar_users_data['rating'] >= 8]

    # Exclude anime already watched by the user
    recommended_anime = anime_from_similar[~anime_from_similar['anime_id'].isin(user_anime_ids)]

    # Aggregate recommendations
    recommended_summary = recommended_anime.groupby('anime_id').agg(
        count=('rating', 'size'),
        avg_rating=('rating', 'mean')
    ).sort_values(by=['count', 'avg_rating'], ascending=False)
    print(recommended_summary)

    # Select top recommendations
    top_recommendation = recommended_summary.head(20).reset_index()

    print('Top Recommendations:', top_recommendation)

    # Format the recommendations with anime names
    recommendations = []
    for _, row in top_recommendation.iterrows():
        anime_id = row['anime_id']
        anime_name = get_anime_name_by_id(anime_id)  # Fetch anime name by ID
        recommendations.append({
            'anime_id': anime_id,
            'anime_name': anime_name,
            'count': row['count'],
            'avg_rating': row['avg_rating']
        })
    print(recommendations)

    return jsonify(recommendations)

def get_anime_name_by_id(anime_id):
    match = anime_data[anime_data['anime_id'] == anime_id]
    if not match.empty:
        return match.iloc[0]['name']
    return 'Unkown Anime'
          


def get_anime_id_by_name_fuzzy(name):
    choices = anime_data['name'].tolist()
    match, score = process.extractOne(name, choices)
    if score > 70:  # Set a threshold for match confidence
        matched_row = anime_data[anime_data['name'] == match]
        return int(matched_row.iloc[0]['anime_id'])
    return None               
def generate_recommendations(user_top_anime):
    # Placeholder for recommendation logic
    
    return ["Anime1", "Anime2", "Anime3"]

anime_data = pd.read_csv('anime.csv')

@app.route('/api/anime-suggestions', methods=['GET'])
def anime_suggestions():
    query = request.args.get('query', '').lower()
    if not query:
        return jsonify([])

    # Filter anime names that include the query
    matches = anime_data[anime_data['name'].str.contains(query, case=False)]
    return jsonify(matches['name'].head(10).tolist())

if __name__ == '__main__':
    app.run(debug=True)
