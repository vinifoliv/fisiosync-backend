export type recommendMusicProps = {
  scale: number;
  musicalGenders: (string | undefined)[];
  range: number[] | undefined;
  max_results: number;
};

export const UserRole = {
  RecommendMusics: ({ ...props }: recommendMusicProps) => {
    const { max_results, musicalGenders, scale, range } = props;
    if (!max_results || !musicalGenders || !scale || !range) return "";

    return `
      You will receive some data regarding a user with parkinson's disease. 
  
      You will need to provide YouTube music (not playlists) recommendations based on the following user criteria:
  
      Music categories , beats per minute (BPM) between one number and another number and the Hoehn and Yahr scale,
  
      The answer should only be provided in the JSON format below, without explanations or any other type of text:
  
          {
              “musics": [
                  {
                  “title": Title of song - Author',
                  “link_youtube": URL of the song on YouTube (2024)',
                  “thumbnail": URL of the video thumbnail',
                  “bpm": 'BPM of the song'
                  }
              ]
          }
  
      Next, I'll send you an example simulating how you'll receive this data, here it goes:
  
      Please provide 10 YouTube music recommendations based on the following criteria:
  
      Music categories: rock, pop, eletronic
      Beats per minute (BPM): Between 100 and 120 BPM.
      Hoehn and Yahr Scale: Stage 1 Parkinson's disease.
  
      Now, I'll send you the real data of a user with Parkinson's disease and you will need to provide recommendations based on the following user criteria, here it goes:
  
      Please provide ${max_results} YouTube music (not playlists) recommendations based on the following criteria:
  
      Music categories: ${musicalGenders.join(", ")}
      Beats per minute (BPM): Between ${range[0]} and ${range[1]} BPM.
      Hoehn and Yahr Scale: Stage ${scale} Parkinson's disease.
  
      The answer should only be provided in the JSON format below, without explanations or any other type of text`;
  },
  GetMusicBPM: (music: string) => `
  I'll send you a song from YouTube. Your task will be to analyze the video, calculate the BPM (Beats Per Minute) of the song, and return only a JSON object as a response. Don't include explanations, comments or any additional text outside the JSON.
  Expected JSON format:

  {
    "music": {
        "title": "Title of song - Author",
        "bpm": "BPM of the song"
    }
  }

  Important rules:

  1. Replace “Song title - Artist” with the exact title and author of the song.
  2. Replace “BPM of the song” with the numerical value of the calculated BPM.
  3. Just return the JSON structured exactly as shown.

  The song to be analyzed is: ${music}
  `,
};
