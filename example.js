
// Example usage
const channels = [
    { channelId: "UCT-3fEwrrxlwMrWgMvoqt-w", title: "specific title segment" },
    { channelId: "UCxJ...Another", title: null } // Replace with actual IDs
  ];
  
  const apiKey = 'YOUR_API_KEY'; // Replace with your API key
  
  getStreamForChannel(channels, apiKey).then((streams) => {
    streams.forEach((stream, index) => {
      if (stream) {
        console.log(`Stream for channel ${channels[index].channelId}:`, stream);
      } else {
        console.log(`No streams found for channel ${channels[index].channelId}`);
      }
    });
  });