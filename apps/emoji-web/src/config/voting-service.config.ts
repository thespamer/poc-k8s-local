const votingServiceConfig = () => ({
  votingService: {
    baseUrl: process.env.VOTING_SERVICE_BASE_URL || 'http://localhost:3001',
  },
});

export default votingServiceConfig;