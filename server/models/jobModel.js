import db from '../config/db.js';

// Create a new job
export const createJob = (job, callback) => {
  const query = `INSERT INTO jobs SET ?`;
  db.query(query, job, callback);
};

// Get all jobs with pagination
export const getPaginatedJobs = (limit, offset, orderBy, callback) => {
  let order = 'ORDER BY created_at DESC';
  if (orderBy === 'oldest') order = 'ORDER BY created_at ASC';

  const countQuery = `SELECT COUNT(*) AS total FROM jobs`;
  const jobsQuery = `SELECT * FROM jobs ${order} LIMIT ? OFFSET ?`;

  db.query(countQuery, (err, countResult) => {
    if (err) return callback(err);

    db.query(jobsQuery, [limit, offset], (err, jobs) => {
      if (err) return callback(err);

      const total = countResult[0].total || 0;
      callback(null, jobs, total);
    });
  });
};

// Get jobs by company
export const getJobsByCompany = (companyId, callback) => {
  const query = `SELECT * FROM jobs WHERE company_id = ? ORDER BY created_at DESC`;
  db.query(query, [companyId], callback);
};

// Get single job by ID
export const getJobById = (jobId, callback) => {
  const query = `SELECT * FROM jobs WHERE id = ?`;
  db.query(query, [jobId], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]); // return single job
  });
};

// Update a job
export const updateJob = (job, callback) => {
  const {
    job_id, company_id, title, sector, role_responsibilities, vacancies,
    skills, education_requirements, job_type, location, description,
    application_deadline, salary
  } = job;

  const query = `
    UPDATE jobs SET
      title = ?, sector = ?, role_responsibilities = ?, vacancies = ?,
      skills = ?, education_requirements = ?, job_type = ?, location = ?,
      description = ?, application_deadline = ?, salary = ?
    WHERE id = ? AND company_id = ?`;

  db.query(query, [
    title, sector, role_responsibilities, vacancies, skills,
    education_requirements, job_type, location, description,
    application_deadline, salary, job_id, company_id
  ], callback);
};

// Delete a job
export const deleteJob = (jobId, callback) => {
  const query = `DELETE FROM jobs WHERE id = ?`;
  db.query(query, [jobId], callback);
};

// Dashboard Stats
export const getCompanyDashboardStats = (company_id, callback) => {
  const statsQuery = `
    SELECT COUNT(*) AS total_jobs, SUM(vacancies) AS total_vacancies
    FROM jobs WHERE company_id = ?`;

  const appliedCountQuery = `
    SELECT COUNT(*) AS total_applicants
    FROM applications WHERE job_id IN (SELECT id FROM jobs WHERE company_id = ?)`;

  const jobStatsQuery = `
    SELECT j.id, j.title, j.vacancies, COUNT(a.id) AS appliedCount
    FROM jobs j
    LEFT JOIN applications a ON j.id = a.job_id
    WHERE j.company_id = ?
    GROUP BY j.id`;

  db.query(statsQuery, [company_id], (err, statsResult) => {
    if (err) return callback(err);

    db.query(appliedCountQuery, [company_id], (err, appliedResult) => {
      if (err) return callback(err);

      db.query(jobStatsQuery, [company_id], (err, jobStatsResult) => {
        if (err) return callback(err);

        callback(null, {
          totalJobs: statsResult[0].total_jobs || 0,
          totalVacancies: statsResult[0].total_vacancies || 0,
          totalApplications: appliedResult[0].total_applicants || 0,
          jobStats: jobStatsResult || [],
        });
      });
    });
  });
};
