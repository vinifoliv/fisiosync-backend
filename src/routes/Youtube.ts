import { Router } from 'express';
import { getYouTubeVideos } from '../repository/YoutubeApi';

export const youtube = Router();

youtube.get('/search-videos/:query', async (req, res, next) => {
    try {
        await getYouTubeVideos(req, res, next);
    } catch (error) {
        next(error);
    }
});

