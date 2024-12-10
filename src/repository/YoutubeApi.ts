import { Request, Response, NextFunction } from 'express';
import { searchVideos } from '../services/YoutubeApi';

export const getYouTubeVideos = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const query = req.params.query;
        if (!query) {
            return res.status(400).json({ message: 'Parâmetro "query" é obrigatório.' });
        }

        const videos = await searchVideos(query);
        return res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
};
