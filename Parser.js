async function getStreamForChannel(config, apiKey) {
  const baseUrl = 'https://www.googleapis.com/youtube/v3/search';
  const maxResults = 5; // Fetch multiple results if filtering by title

  const fetchVideos = async (channelId, eventType, results = 1) => {
    const url = `${baseUrl}?key=${apiKey}&channelId=${channelId}&type=video&eventType=${eventType}&maxResults=${results}&part=snippet&order=date`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data = await response.json();
    return data.items || [];
  };

  const matchTitle = (videos, titleSegment) => {
    const regex = new RegExp(titleSegment, 'i');
    return videos.find((video) => regex.test(video.snippet.title));
  };

  const processChannel = async (channel) => {
    const { channelId, title } = channel;

    try {
      if (title) {
        // Fetch more results to filter by title
        let videos = await fetchVideos(channelId, 'live', maxResults);
        let matchedVideo = matchTitle(videos, title);

        if (!matchedVideo) {
          // No matching live stream, try completed streams
          videos = await fetchVideos(channelId, 'completed', maxResults);
          matchedVideo = matchTitle(videos, title);
        }

        return matchedVideo || null;
      } else {
        // Fetch the latest live or completed video
        let videos = await fetchVideos(channelId, 'live', 1);
        if (videos.length > 0) return videos[0];

        // If no live video, fallback to completed
        videos = await fetchVideos(channelId, 'completed', 1);
        return videos.length > 0 ? videos[0] : null;
      }
    } catch (error) {
      console.error(`Error fetching streams for channel ${channelId}:`, error);
      return null;
    }
  };

  const results = await Promise.all(config.map((channel) => processChannel(channel)));
  return results;
}
