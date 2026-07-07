import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { UserRole } from '../models/User';

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    if (!roles.includes(req.user.role as UserRole)) {
      res.status(403).json({
        success: false,
        message: `Access denied. This action requires one of the following roles: ${roles.join(', ')}.`,
      });
      return;
    }

    next();
  };
};
