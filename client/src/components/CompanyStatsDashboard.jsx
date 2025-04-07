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

  const fetchStats = async () => {
    try {
      const res = await axios.get("/jobs/company/stats");
      setStats(res.data);
      console.log("Stats response:", res.data); // Debugging
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
      <table className="w-full border border-gray-300">
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
    </div>
  );
};

export default CompanyStatsDashboard;
