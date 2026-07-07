import { Response } from 'express';
import mongoose from 'mongoose';
import Job from '../models/Job';
import Application from '../models/Application';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all open jobs (student/public view)
// @route   GET /api/jobs
// @access  Private (student)
export const getAllJobs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { keyword, location, type, page = 1, limit = 20 } = req.query;
    const query: any = { status: 'open' };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('postedBy', 'name company')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: { jobs, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Private
export const getJobById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name company email');
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found.' });
      return;
    }
    res.status(200).json({ success: true, data: { job } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get manager's own jobs
// @route   GET /api/jobs/my
// @access  Private (hiring_manager)
export const getMyJobs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const jobs = await Job.find({ postedBy: req.user!._id }).sort({ createdAt: -1 });

    // Get application counts for each job
    const jobIds = jobs.map((j) => j._id);
    const counts = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: '$jobId', count: { $sum: 1 } } },
    ]);

    const countMap: Record<string, number> = {};
    counts.forEach((c) => (countMap[c._id.toString()] = c.count));

    const jobsWithCounts = jobs.map((job) => ({
      ...job.toObject(),
      applicationCount: countMap[job._id.toString()] || 0,
    }));

    res.status(200).json({ success: true, data: { jobs: jobsWithCounts } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a job posting
// @route   POST /api/jobs
// @access  Private (hiring_manager)
export const createJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, company, location, description, requirements, salary, type } = req.body;

    if (!title || !company || !location || !description || !type) {
      res.status(400).json({ success: false, message: 'Please provide all required fields.' });
      return;
    }

    const reqArray = Array.isArray(requirements)
      ? requirements
      : typeof requirements === 'string'
      ? requirements.split('\n').filter(Boolean)
      : [];

    const job = await Job.create({
      title,
      company,
      location,
      description,
      requirements: reqArray,
      salary,
      type,
      postedBy: req.user!._id,
      source: 'internal',
    });

    res.status(201).json({ success: true, message: 'Job posted successfully.', data: { job } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (hiring_manager, own job)
export const updateJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found.' });
      return;
    }

    if (job.postedBy.toString() !== req.user!._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized to update this job.' });
      return;
    }

    const { title, company, location, description, requirements, salary, type, status } = req.body;

    if (requirements) {
      req.body.requirements = Array.isArray(requirements)
        ? requirements
        : requirements.split('\n').filter(Boolean);
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { title, company, location, description, requirements: req.body.requirements, salary, type, status },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: 'Job updated successfully.', data: { job: updatedJob } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (hiring_manager, own job)
export const deleteJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found.' });
      return;
    }

    if (job.postedBy.toString() !== req.user!._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized to delete this job.' });
      return;
    }

    await Job.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ jobId: req.params.id });

    res.status(200).json({ success: true, message: 'Job deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get manager dashboard stats
// @route   GET /api/jobs/stats
// @access  Private (hiring_manager)
export const getManagerStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const managerId = req.user!._id;
    const totalJobs = await Job.countDocuments({ postedBy: managerId });
    const openJobs = await Job.countDocuments({ postedBy: managerId, status: 'open' });

    const myJobIds = await Job.find({ postedBy: managerId }).distinct('_id');
    const totalApplicants = await Application.countDocuments({ jobId: { $in: myJobIds } });
    const pendingApplicants = await Application.countDocuments({
      jobId: { $in: myJobIds },
      status: 'pending',
    });

    res.status(200).json({
      success: true,
      data: { totalJobs, openJobs, totalApplicants, pendingApplicants },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
