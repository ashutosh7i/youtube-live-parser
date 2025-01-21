async function getStreamForChannel(config, apiKey) {
  const baseUrl = 'https://www.googleapis.com/youtube/v3/search';

  const fetchVideos = async (channelId, eventType, results = 1) => {
    const url = `${baseUrl}?key=${apiKey}&channelId=${channelId}&type=video&eventType=${eventType}&maxResults=${results}&part=snippet&order=date`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data = await response.json();
    return data.items || [];
  };

}
