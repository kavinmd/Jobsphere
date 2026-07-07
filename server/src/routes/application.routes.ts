import { Router } from 'express';
import {
  applyToJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus,
  getStudentStats,
} from '../controllers/application.controller';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/role';

const router = Router();

router.post('/', protect, authorize('student'), applyToJob);
router.get('/my', protect, authorize('student'), getMyApplications);
router.get('/stats', protect, authorize('student'), getStudentStats);
router.get('/job/:jobId', protect, authorize('hiring_manager'), getJobApplicants);
router.put('/:id/status', protect, authorize('hiring_manager'), updateApplicationStatus);

export default router;
