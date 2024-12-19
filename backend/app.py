from flask import Flask, request, jsonify
import pandas as pd

ratings = pd.read_csv('rating.csv')
print(ratings.head())
app = Flask(__name__)

@app.route('/users/anime', methods=['POST'])
def get_recommendations():
    user_top_anime = request.json  # Retrieve the JSON data from React
    print('User Top Anime:', user_top_anime)

    user_anime = {int(anime['name']) for anime in user_top_anime}
    print(user_anime)
    matched_ratings = ratings[ratings['anime_id'].isin(user_anime)]
    # Find users that have similar anime lists to user input
    user_match_counts = matched_ratings.groupby('user_id')['anime_id'].count()
    #print(user_match_counts)
    similar_users = user_match_counts[user_match_counts >= 5]
    #print(similar_users)
    similar_users_data = ratings[ratings['user_id'].isin(similar_users.index)]
    #print("User Data: ")
   # print(similar_users_data)
    # Anime with ratings >= n
    anime_from_similar = similar_users_data[similar_users_data['rating'] >= 8]
    #print(anime_from_similar)
    # Anime excluded from the temp list created by user
    recommended_anime = anime_from_similar[~anime_from_similar['anime_id'].isin(user_anime)]
    
    recommended_summary = recommended_anime.groupby('anime_id').agg(
        count=('rating', 'size'),
        avg_rating=('rating', 'mean')
    ).sort_values(by=['count', 'avg_rating'], ascending=False)
    top_recommendation = recommended_summary.head(20)
    print(top_recommendation)

    # Recommendation logic
    recommendations = generate_recommendations(user_top_anime)
    return jsonify(recommendations)

            
                
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
