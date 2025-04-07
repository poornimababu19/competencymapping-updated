import { useState, useEffect } from "react";
import InputField from "./InputField";
import Button from "./Button";
import axios from "../services/api";

const CreateJobForm = ({ editingJob, onClose }) => {
  const defaultJob = {
    title: "",
    description: "",
    sector: "",
    role_responsibilities: "",
    vacancies: 1,
    skills: "",
    education_requirements: "",
    job_type: "Full-time",
    application_deadline: "",
    salary: "",
    location: "",
  };

  const [job, setJob] = useState(defaultJob);
  const [success, setSuccess] = useState(false);

  // Pre-fill form if editing
  useEffect(() => {
    if (editingJob) {
      setJob({
        ...editingJob,
        application_deadline: editingJob.application_deadline?.split("T")[0] || "",
      });
    } else {
      setJob(defaultJob);
    }
  }, [editingJob]);

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const formatted = {
        ...job,
        vacancies: Number(job.vacancies),
        salary: Number(job.salary),
        application_deadline: job.application_deadline?.split("T")[0],
      };

      if (editingJob) {
        // Update job
        await axios.put(`/jobs/${editingJob.id}`, formatted);
      } else {
        // Create job
        await axios.post("/jobs", formatted);
      }

      setSuccess(true);
      setJob(defaultJob);

      // Delay then close
      setTimeout(() => {
        setSuccess(false);
        onClose(); // Go back to job list
      }, 1000);
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{editingJob ? "Edit Job" : "Create Job"}</h2>

      <InputField label="Job Title" name="title" value={job.title} onChange={handleChange} />
      <InputField label="Description" name="description" value={job.description} onChange={handleChange} />
      <InputField label="Sector" name="sector" value={job.sector} onChange={handleChange} />
      <InputField label="Role & Responsibilities" name="role_responsibilities" value={job.role_responsibilities} onChange={handleChange} />
      <InputField label="Vacancies" type="number" name="vacancies" value={job.vacancies} onChange={handleChange} />
      <InputField label="Skills" name="skills" value={job.skills} onChange={handleChange} />
      <InputField label="Education Requirements" name="education_requirements" value={job.education_requirements} onChange={handleChange} />

      <label className="block text-gray-700 font-medium mb-1">Job Type</label>
      <select name="job_type" value={job.job_type} onChange={handleChange} className="w-full p-2 border rounded mb-4">
        <option value="Full-time">Full-time</option>
        <option value="Part-time">Part-time</option>
        <option value="Internship">Internship</option>
        <option value="Remote">Remote</option>
      </select>

      <InputField label="Application Deadline" type="date" name="application_deadline" value={job.application_deadline} onChange={handleChange} />
      <InputField label="Salary" type="number" name="salary" value={job.salary} onChange={handleChange} />
      <InputField label="Location" name="location" value={job.location} onChange={handleChange} />

      <div className="flex gap-4">
        <Button label={editingJob ? "Update Job" : "Create Job"} onClick={handleSubmit} />
        <Button label="Cancel" onClick={onClose} />
      </div>

      {success && <p className="text-green-600 mt-4">{editingJob ? "Job updated" : "Job created"} successfully!</p>}
    </div>
  );
};

export default CreateJobForm;
