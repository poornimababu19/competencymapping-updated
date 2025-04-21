import {
  createJob,
  getPaginatedJobs,
  getJobsByCompany,
  getJobById,
  updateJob,
  deleteJob,
  getCompanyDashboardStats,
  getTanscheDashboardStats
} from '../models/jobModel.js'; // Assuming the necessary functions are present in the model

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

// Get All Jobs
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

// Get Jobs by Company
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

// Update Job
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

// Delete Job
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

// Get Company Dashboard Stats
export const getCompanyStats = (req, res) => {
  const companyId = req.user.id;
  getCompanyDashboardStats(companyId, (err, stats) => {
    if (err) return res.status(500).json({ error: "Failed to fetch stats" });
    res.json(stats);
  });
};

// Get Tansche Dashboard Stats
export const getTanscheStats = (req, res) => {
  getTanscheDashboardStats((err, stats) => {
    if (err) {
      console.error("Error fetching Tansche dashboard stats:", err);
      return res.status(500).json({ message: "Error fetching Tansche dashboard stats" });
    }

    console.log("Tansche Stats:", stats);  // Log to check data before sending response
    res.json(stats);
  });
};
