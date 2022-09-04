const emojiServiceConfig = () => ({
  emojiService: {
    baseUrl: process.env.EMOJI_SERVICE_BASE_URL || 'http://localhost:3000',
  },
});

export default emojiServiceConfig;