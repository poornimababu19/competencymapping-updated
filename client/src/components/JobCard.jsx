const JobCard = ({ job, onEdit, onDelete, onApply }) => {
  return (
    <div className="border p-4 mb-4 bg-white rounded shadow">
      <h3 className="text-lg font-bold">{job.title}</h3>
      <p className="mb-2">{job.description}</p>

      <div className="text-sm space-y-1">
        <p><strong>Sector:</strong> {job.sector}</p>
        <p><strong>Responsibilities:</strong> {job.role_responsibilities}</p>
        <p><strong>Skills:</strong> {job.skills}</p>
        <p><strong>Education:</strong> {job.education_requirements}</p>
        <p><strong>Type:</strong> {job.job_type}</p>
        <p><strong>Vacancies:</strong> {job.vacancies}</p>
        <p><strong>Salary:</strong> ${job.salary}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Deadline:</strong> {job.application_deadline}</p>
      </div>

      <div className="mt-4 flex gap-3">
        {onEdit && <button className="text-blue-500" onClick={onEdit}>Edit</button>}
        {onDelete && <button className="text-red-500" onClick={onDelete}>Delete</button>}
        {onApply && <button className="text-green-600" onClick={() => onApply(job.id)}>Apply</button>}
      </div>
    </div>
  );
};

export default JobCard;
