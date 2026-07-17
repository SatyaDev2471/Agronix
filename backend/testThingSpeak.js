const axios = require('axios');
require('dotenv').config();

const test = async () => {
  const channelId = process.env.THINGSPEAK_CHANNEL_ID;
  const apiKey = process.env.THINGSPEAK_READ_API_KEY;
  console.log("Channel:", channelId);
  console.log("Key:", apiKey);
  
  try {
    const url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${apiKey}&results=2`;
    console.log("Fetching URL:", url);
    const response = await axios.get(url);
    console.log("Response:", response.data);
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
};
test();
