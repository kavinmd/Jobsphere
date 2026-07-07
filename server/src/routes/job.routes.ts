import { Router } from 'express';
import {
  getAllJobs,
  getJobById,
  getMyJobs,
  createJob,
  updateJob,
  deleteJob,
  getManagerStats,
} from '../controllers/job.controller';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/role';

const router = Router();

// Public/Student routes
router.get('/', protect, getAllJobs);
router.get('/my', protect, authorize('hiring_manager'), getMyJobs);
router.get('/stats', protect, authorize('hiring_manager'), getManagerStats);
router.get('/:id', protect, getJobById);

// Manager-only routes
router.post('/', protect, authorize('hiring_manager'), createJob);
router.put('/:id', protect, authorize('hiring_manager'), updateJob);
router.delete('/:id', protect, authorize('hiring_manager'), deleteJob);

export default router;
