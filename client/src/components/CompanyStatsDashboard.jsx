import { useEffect, useState } from "react";
import axios from "../services/api";

const CompanyStatsDashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalVacancies: 0,
    totalApplications: 0,
    jobStats: [],
  });
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1); // 🔥 Track page number
  const [totalJobsCount, setTotalJobsCount] = useState(0); // 🔥 To manage page limits
  const pageSize = 5; // Show 5 per page

  const fetchStats = async (page = 1) => {
    try {
      const res = await axios.get(`/jobs/company/stats?page=${page}&limit=${pageSize}`);
      setStats(res.data);
      setTotalJobsCount(res.data.totalJobs); // Update total jobs count
      console.log("Stats response:", res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalJobsCount / pageSize);
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
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

      {/* Table */}
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
          {(stats.jobStats || []).map((job) => (
            <tr key={job.id}>
              <td className="p-2 border">{job.title}</td>
              <td className="p-2 border">{job.vacancies}</td>
              <td className="p-2 border">{job.appliedCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage >= Math.ceil(totalJobsCount / pageSize)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CompanyStatsDashboard;
