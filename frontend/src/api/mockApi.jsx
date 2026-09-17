import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MOCK_CAREER_OPTIONS } from '../data/mockCareerData';

const mock = new MockAdapter(axios, { delayResponse: 500 });

// Intercept GET /api/career-options and return mock response
mock.onGet('/api/career-options').reply(200, {
  success: true,
  data: MOCK_CAREER_OPTIONS,
});