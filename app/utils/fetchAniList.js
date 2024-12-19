import { GraphQLClient } from 'graphql-request';

const endpoint = 'https://graphql.anilist.co';

export const fetchAnimeData = async (id) => {
    const client = new GraphQLClient(endpoint);
    const query = `
        query ($id: Int) {
        Media(id: $id, type: ANIME) {
            id
            title {
            romaji
            english
            }
            genres
            averageScore
            popularity
            reviews {
            nodes {
                score
                summary
            }
        }
        }
        }
        `;
    const variables = {id};
    
    try {
        const data = await client.request(query, variables);
        return data.Media;
    } catch (error) {
        console.error('Error fetching data from AniList:'. error);
        return null;
    }
};