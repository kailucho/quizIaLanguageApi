import { registerUser, loginUser, verifyGoogleToken } from '../services/authService.js';
import { body, validationResult } from 'express-validator';
import User from '../models/UserModel.js';
import { generateToken } from '../utils/index.js';

export const validateRegister = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await registerUser(username, password);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await loginUser(username, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const googleAuth = async (req, res) => {
  const { id_token } = req.body;

  if (!id_token) {
    return res.status(400).json({ error: 'Missing id_token in request body' });
  }

  try {
    // Verify the Google token
    const { token, email, name } = await verifyGoogleToken(id_token);

    res.json({ token, email, name }); // Return only the token
  } catch (error) {
    console.error('Error in Google authentication:', error);

    if (error.code === 11000) {
      // Handle duplicate key error
      return res.status(400).json({ error: 'A user with this email already exists.' });
    }

    res.status(400).json({ error: error.message });
  }
};

export const validateLogin = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];