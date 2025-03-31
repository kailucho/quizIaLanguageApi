import express from 'express';
import mongoose from 'mongoose';
import { redisClient } from '../config/index.js';
import winston from 'winston';

const router = express.Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check the health of the application
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Application is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 database:
 *                   type: string
 *                   example: connected
 *                 redis:
 *                   type: string
 *                   example: connected
 *       500:
 *         description: Application is unhealthy
 */
router.get('/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    const redisStatus = redisClient.isOpen ? 'connected' : 'disconnected';

    winston.info('Health check status', {
      database: dbStatus,
      redis: redisStatus,
    });

    res.status(200).json({
      status: 'healthy',
      database: dbStatus,
      redis: redisStatus,
    });
  } catch (error) {
    winston.error('Health check failed', { error: error.message });

    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});

export default router;