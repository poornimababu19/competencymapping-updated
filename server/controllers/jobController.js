import {
  createJob,
  getPaginatedJobs,
  getJobsByCompany,
  getJobById,
  updateJob,
  deleteJob,
  getCompanyDashboardStats,
  getTanscheDashboardStats,
  getPaginatedJobsForTansche,
  getPaginatedJobsByCompany
} from '../models/jobModel.js';

// Create Job
export const createJobProfile = (req, res) => {
  const company_id = req.user.id;
  const {
    title, sector, role_responsibilities, vacancies, skills,
    education_requirements, job_type, location, description,
    application_deadline, salary
  } = req.body;

  if (!title || !sector || !role_responsibilities || !vacancies || !skills ||
      !education_requirements || !job_type || !location || !description ||
      !application_deadline || !salary) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const job = {
    company_id, title, sector, role_responsibilities, vacancies, skills,
    education_requirements, job_type, location, description,
    application_deadline, salary
  };

  createJob(job, (err, result) => {
    if (err) {
      console.error("Error creating job:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.status(201).json({ message: "Job created successfully!", jobId: result.insertId });
  });
};

// Get All Jobs with Pagination and Sorting
export const getJobs = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const orderBy = req.query.sort || "newest";

  getPaginatedJobs(limit, offset, orderBy, (err, jobs, total) => {
    if (err) {
      console.error("Error fetching jobs:", err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json({
      jobs: jobs || [],
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: page,
    });
  });
};

// Get Jobs by Logged-In Company
export const getCompanyJobs = (req, res) => {
  const company_id = req.user.id;

  getJobsByCompany(company_id, (err, results) => {
    if (err) {
      console.error("Error fetching company jobs:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json({ jobs: results });
  });
};

// Get Single Job by ID
export const getJobByIdController = (req, res) => {
  const jobId = req.params.id;

  getJobById(jobId, (err, job) => {
    if (err) {
      console.error("Error fetching job:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  });
};

// Update Job by ID (Company Authenticated)
export const updateJobProfile = (req, res) => {
  const jobId = req.params.id;
  const company_id = req.user.id;

  const {
    title, sector, role_responsibilities, vacancies, skills,
    education_requirements, job_type, location, description,
    application_deadline, salary
  } = req.body;

  const job = {
    job_id: jobId,
    company_id,
    title,
    sector,
    role_responsibilities,
    vacancies,
    skills,
    education_requirements,
    job_type,
    location,
    description,
    application_deadline,
    salary
  };

  updateJob(job, (err, result) => {
    if (err) {
      console.error("Error updating job:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Job not found or unauthorized to update." });
    }

    res.json({ message: "Job updated successfully!" });
  });
};

// Delete Job by ID
export const deleteJobProfile = (req, res) => {
  const jobId = req.params.id;

  deleteJob(jobId, (err, result) => {
    if (err) {
      console.error("Error deleting job:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Job not found or already deleted." });
    }

    res.json({ message: "Job deleted successfully!" });
  });
};

// Get Company Dashboard Stats + Paginated Jobs
export const getCompanyStats = (req, res) => {
  const companyId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  getCompanyDashboardStats(companyId, (err, stats) => {
    if (err) {
      console.error("Error fetching company stats:", err);
      return res.status(500).json({ message: "Failed to fetch company stats", error: err });
    }

    getPaginatedJobsByCompany(companyId, limit, offset, (err, jobs, totalJobs) => {
      if (err) {
        console.error("Error fetching paginated jobs for company:", err);
        return res.status(500).json({ message: "Failed to fetch paginated jobs", error: err });
      }

      res.json({
        totalJobs: stats.totalJobs,
        totalVacancies: stats.totalVacancies,
        totalApplications: stats.totalApplications,
        jobStats: jobs,
        totalCount: totalJobs
      });
    });
  });
};

// Get Tansche Dashboard Stats + Paginated Jobs
export const getTanscheStats = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  getTanscheDashboardStats((err, stats) => {
    if (err) {
      console.error("Error fetching Tansche dashboard stats:", err);
      return res.status(500).json({ message: "Error fetching Tansche dashboard stats", error: err });
    }

    getPaginatedJobsForTansche(limit, offset, (err, jobs, totalCount) => {
      if (err) {
        console.error("Error fetching paginated jobs for Tansche:", err);
        return res.status(500).json({ message: "Error fetching paginated jobs", error: err });
      }

      res.json({
        ...stats,
        jobStats: jobs,
        totalCount
      });
    });
  });
};

// Controller: Paginated Jobs by Company for Dashboard
export const getPaginatedCompanyJobs = (req, res) => {
  const companyId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  getPaginatedJobsByCompany(companyId, limit, offset, (err, jobs, total) => {
    if (err) {
      console.error('Error fetching paginated company jobs:', err);
      return res.status(500).json({ message: 'Server Error', error: err });
    }

    res.status(200).json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalJobs: total
    });
  });
};

// GET /notifications/my
export const getMyNotifications = async (req, res) => {
  try {
    // Example: Fetch notifications from DB
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// POST /notifications/mark-read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;
    await Notification.updateOne(
      { _id: notificationId, user: req.user.id },
      { $set: { is_read: true } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
};