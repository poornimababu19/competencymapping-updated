import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TanscheDashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalVacancies: 0,
    totalApplications: 0,
    totalCompanies: 0,
    jobStats: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/tansche/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading Dashboard...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Tansche Admin Dashboard</h1>

      {/* Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-100 rounded-2xl p-4 shadow">
          <h2 className="text-sm text-gray-600">Total Jobs</h2>
          <p className="text-xl font-bold">{stats.totalJobs}</p>
        </div>
        <div className="bg-green-100 rounded-2xl p-4 shadow">
          <h2 className="text-sm text-gray-600">Total Vacancies</h2>
          <p className="text-xl font-bold">{stats.totalVacancies}</p>
        </div>
        <div className="bg-yellow-100 rounded-2xl p-4 shadow">
          <h2 className="text-sm text-gray-600">Total students</h2>
          <p className="text-xl font-bold">{stats.totalApplications}</p>
        </div>
        <div className="bg-purple-100 rounded-2xl p-4 shadow">
          <h2 className="text-sm text-gray-600">Total Companies Registered</h2>
          <p className="text-xl font-bold">{stats.totalCompanies}</p>
        </div>
      </div>

      {/* Job Stats Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="px-4 py-3">Job Title</th>
              <th className="px-4 py-3">Vacancies</th>
              <th className="px-4 py-3">Students Applied</th>
            </tr>
          </thead>
          <tbody>
            {stats.jobStats?.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                  No job stats available.
                </td>
              </tr>
            ) : (
              stats.jobStats.map((job) => (
                <tr key={job.id} className="border-b">
                  <td className="px-4 py-3">{job.title}</td>
                  <td className="px-4 py-3">{job.vacancies ?? 0}</td>
                  <td className="px-4 py-3">{job.appliedCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TanscheDashboard;
