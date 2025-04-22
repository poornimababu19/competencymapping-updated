import { useEffect, useState } from "react";
import axios from "../services/api";

const CompanyStatsDashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalVacancies: 0,
    totalApplications: 0,
    jobStats: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await axios.get("/jobs/company/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(stats.jobStats.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = stats.jobStats.slice(startIndex, startIndex + jobsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Company Dashboard</h2>

      {/* Summary Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-xl font-bold">{stats.totalJobs}</p>
          <p>Total Jobs Posted</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="text-xl font-bold">{stats.totalVacancies}</p>
          <p>Total Vacancies</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <p className="text-xl font-bold">{stats.totalApplications}</p>
          <p>Total Students Applied</p>
        </div>
      </div>

      {/* Job Table */}
      <h3 className="text-xl font-semibold mb-2">Job Statistics</h3>
      <table className="w-full border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Job Title</th>
            <th className="p-2 border">Vacancies</th>
            <th className="p-2 border">Students Applied</th>
          </tr>
        </thead>
        <tbody>
          {currentJobs.map((job) => (
            <tr key={job.id}>
              <td className="p-2 border">{job.title}</td>
              <td className="p-2 border">{job.vacancies}</td>
              <td className="p-2 border">{job.appliedCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          Previous
        </button>
        <span className="text-gray-700 self-center">Page {currentPage} of {totalPages}</span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-4 py-2 rounded ${currentPage === totalPages || totalPages === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CompanyStatsDashboard;
