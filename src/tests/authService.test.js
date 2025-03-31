import { jest } from '@jest/globals';

jest.mock('../config/index.js', () => ({
  redisClient: {
    connect: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    quit: jest.fn(),
  },
}));

import * as authService from '../services/authService.js';
import jwt from 'jsonwebtoken';

describe('authService', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret';
  });

  describe('verifyToken', () => {
    it('should verify a valid token and return the decoded payload', () => {
      const user = { id: '123', email: 'test@example.com' };
      const token = jwt.sign(user, process.env.JWT_SECRET);

      const decoded = authService.verifyToken(token);
      expect(decoded.id).toBe(user.id);
      expect(decoded.email).toBe(user.email);
    });

    it('should throw an error for an invalid token', () => {
      expect(() => authService.verifyToken('invalid-token')).toThrow(
        'Invalid token'
      );
    });
  });
});
