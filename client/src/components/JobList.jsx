import { useEffect, useState } from "react";
import axios from "../services/api";
import JobCard from "./JobCard";

const JobList = ({ onEdit }) => {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("/jobs/company");
      setJobs(res.data.jobs);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Job Profiles</h2>
      {jobs.length === 0 ? (
        <p>No job profiles yet.</p>
      ) : (
        jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onDelete={() => handleDelete(job.id)}
            onEdit={() => onEdit(job)} // ✅ trigger edit in parent
          />
        ))
      )}
    </div>
  );
};

export default JobList;
