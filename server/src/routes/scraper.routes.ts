import { Router } from 'express';
import { searchJobs } from '../controllers/scraper.controller';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/role';

const router = Router();

router.get('/search', protect, authorize('student'), searchJobs);

export default router;
