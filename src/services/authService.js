import { connectDB } from '../config/index.js';
import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { generateToken } from '../utils/index.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerUser = async (username, password) => {
  await connectDB();
  const user = new User({ username, password });
  await user.save();
  return { message: 'User registered successfully' };
};

export const loginUser = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('Invalid username or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid username or password');
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '24h', // Increased token expiration time to 24 hours
  });
  return { token };
};

export const verifyGoogleToken = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  const { email, given_name } = payload;

  let user = await User.findOne({ username: email });
  if (!user) {
    user = new User({ username: email, password: 'default_password' });
    await user.save();
  }

  const token = generateToken(user._id); // Replaced inline JWT generation with utility function
  return { token, email, name: given_name }; // Return token along with email and name
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
