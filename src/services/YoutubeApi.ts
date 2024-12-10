import axios from 'axios';

const youtubeApi = axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3',
    timeout: 5000,
});

interface YouTubeVideo {
    id: {
        videoId: string;
    };
    snippet: {
        title: string;
        description: string;
        thumbnails: {
            [key: string]: {
                url: string;
                width: number;
                height: number;
            };
        };
    };
}

export const searchVideos = async (query: string) => {
    try {
        const { data } = await youtubeApi.get('/search', {
            params: {
                part: 'snippet',
                q: query,
                maxResults: 10,
                key: process.env.YOUTUBE_API_KEY,
            },
        });

        const videos = data.items.map((item: YouTubeVideo) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnails: item.snippet.thumbnails,
        }));

        return videos;
    } catch (error) {
        console.error(error);
        throw new Error('Erro ao buscar vídeos do YouTube.');
    }
};
