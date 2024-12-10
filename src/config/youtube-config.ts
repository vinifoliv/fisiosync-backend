const axios = require('axios');

const youtubeApi = axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3',
    timeout: 5000,
});

module.exports = youtubeApi;
