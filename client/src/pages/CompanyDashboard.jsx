import { useState } from "react";
import CreateJobForm from "../components/CreateJobForm";
import JobList from "../components/JobList";
import CompanyStatsDashboard from "../components/CompanyStatsDashboard";

const CompanyDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [editingJob, setEditingJob] = useState(null); // ✅

  const handleEdit = (job) => {
    setEditingJob(job);
    setActiveSection("create");
  };

  const handleFormClose = () => {
    setEditingJob(null);
    setActiveSection("view"); // Go back to job list
  };

  const renderSection = () => {
    switch (activeSection) {
      case "create":
        return <CreateJobForm editingJob={editingJob} onClose={handleFormClose} />;
      case "view":
        return <JobList onEdit={handleEdit} />;
      case "dashboard":
      default:
        return <CompanyStatsDashboard />;
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Welcome to Company Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeSection === "create" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          onClick={() => {
            setEditingJob(null); // Clear editing state
            setActiveSection("create");
          }}
        >
          Create Job
        </button>
        <button
          className={`px-4 py-2 rounded ${activeSection === "view" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          onClick={() => setActiveSection("view")}
        >
          View Jobs
        </button>
        <button
          className={`px-4 py-2 rounded ${activeSection === "dashboard" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          onClick={() => setActiveSection("dashboard")}
        >
          View Dashboard
        </button>
      </div>

      <div>{renderSection()}</div>
    </div>
  );
};

export default CompanyDashboard;
