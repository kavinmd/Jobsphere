import { Response } from 'express';
import Application from '../models/Application';
import Job from '../models/Job';
import { AuthRequest } from '../middleware/auth';

// @desc    Apply to a job (internal or external)
// @route   POST /api/applications
// @access  Private (student)
export const applyToJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jobId, jobSource, externalJobData, coverLetter } = req.body;
    const studentId = req.user!._id;

    if (!jobSource) {
      res.status(400).json({ success: false, message: 'jobSource is required.' });
      return;
    }

    if (jobSource === 'internal') {
      if (!jobId) {
        res.status(400).json({ success: false, message: 'jobId is required for internal jobs.' });
        return;
      }

      const job = await Job.findById(jobId);
      if (!job || job.status === 'closed') {
        res.status(404).json({ success: false, message: 'Job not found or is closed.' });
        return;
      }

      const existingApp = await Application.findOne({ studentId, jobId });
      if (existingApp) {
        res.status(400).json({ success: false, message: 'You have already applied to this job.' });
        return;
      }

      const application = await Application.create({
        studentId,
        jobId,
        jobSource: 'internal',
        coverLetter,
        status: 'pending',
      });

      await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

      const populated = await Application.findById(application._id).populate(
        'jobId',
        'title company location type'
      );

      res.status(201).json({ success: true, message: 'Application submitted successfully.', data: { application: populated } });
    } else {
      // External job application
      if (!externalJobData) {
        res.status(400).json({ success: false, message: 'externalJobData is required for external jobs.' });
        return;
      }

      // Check for duplicate by external URL
      const existingApp = await Application.findOne({
        studentId,
        'externalJobData.applyUrl': externalJobData.applyUrl,
      });

      if (existingApp) {
        res.status(400).json({ success: false, message: 'You have already applied to this job.' });
        return;
      }

      const application = await Application.create({
        studentId,
        jobSource,
        externalJobData,
        coverLetter,
        status: 'pending',
      });

      res.status(201).json({ success: true, message: 'Application recorded successfully.', data: { application } });
    }
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'You have already applied to this job.' });
      return;
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student's application history
// @route   GET /api/applications/my
// @access  Private (student)
export const getMyApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const applications = await Application.find({ studentId: req.user!._id })
      .populate('jobId', 'title company location type status')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { applications } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get applicants for a specific job (manager)
// @route   GET /api/applications/job/:jobId
// @access  Private (hiring_manager)
export const getJobApplicants = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found.' });
      return;
    }

    if (job.postedBy.toString() !== req.user!._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized to view this job\'s applicants.' });
      return;
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('studentId', 'name email phone location bio resumeUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { applications, job } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status (manager)
// @route   PUT /api/applications/:id/status
// @access  Private (hiring_manager)
export const updateApplicationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, notes } = req.body;

    if (!['pending', 'reviewed', 'shortlisted', 'rejected'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status.' });
      return;
    }

    const application = await Application.findById(req.params.id).populate('jobId');
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    const job = await Job.findById(application.jobId);
    if (!job || job.postedBy.toString() !== req.user!._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized.' });
      return;
    }

    application.status = status;
    if (notes) application.notes = notes;
    await application.save();

    res.status(200).json({ success: true, message: 'Application status updated.', data: { application } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Student dashboard stats
// @route   GET /api/applications/stats
// @access  Private (student)
export const getStudentStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user!._id;
    const total = await Application.countDocuments({ studentId });
    const pending = await Application.countDocuments({ studentId, status: 'pending' });
    const shortlisted = await Application.countDocuments({ studentId, status: 'shortlisted' });
    const rejected = await Application.countDocuments({ studentId, status: 'rejected' });

    res.status(200).json({ success: true, data: { total, pending, shortlisted, rejected } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
