import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }
    res.status(200).json({ success: true, data: { user } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, phone, location, bio, resumeUrl, company, avatar } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;
    if (resumeUrl !== undefined) updateData.resumeUrl = resumeUrl;
    if (company !== undefined && req.user!.role === 'hiring_manager') updateData.company = company;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user!._id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(200).json({ success: true, message: 'Profile updated successfully.', data: { user } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Please provide current and new password.' });
      return;
    }

    const user = await User.findById(req.user!._id).select('+password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
