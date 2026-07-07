import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, company } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ success: false, message: 'Please provide all required fields.' });
      return;
    }

    if (!['student', 'hiring_manager'].includes(role)) {
      res.status(400).json({ success: false, message: 'Invalid role. Must be student or hiring_manager.' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'User with this email already exists.' });
      return;
    }

    if (role === 'hiring_manager' && !company) {
      res.status(400).json({ success: false, message: 'Company name is required for hiring managers.' });
      return;
    }

    const user = await User.create({ name, email, password, role, company });

    const token = generateToken(user._id.toString(), user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          company: user.company,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error during registration.' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password.' });
      return;
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials.' });
      return;
    }

    const token = generateToken(user._id.toString(), user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          company: user.company,
          location: user.location,
          bio: user.bio,
          phone: user.phone,
          resumeUrl: user.resumeUrl,
          avatar: user.avatar,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error during login.' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    res.status(200).json({ success: true, data: { user } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error.' });
  }
};
