import React, { useEffect, useState } from "react";
import JobCard from "./JobCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./JobList.css";

function JobList({ user }) {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const role = user?.role || "jobseeker";

  // Fetch all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  // Apply handler (JobSeeker only)
const handleApply = async (jobId) => {
  if (!user) { alert("Please login/register first 🚀"); navigate("/login"); return; }
  if (user.role !== "jobseeker") { alert("You are not a jobseeker ❌"); return; }

  await axios.post(`http://localhost:5000/api/jobs/${jobId}/apply`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  setJobs(prevJobs =>
    prevJobs.map(job => job._id === jobId ? { ...job, applied: true } : job)
  );
  alert("Applied successfully ✅");
};

  // Withdraw handler (JobSeeker only)
  const handleWithdraw = async (jobId) => {
    if (!user || role?.toLowerCase() !== "jobseeker") return;
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, applied: false } : job
        )
      );
      alert("Application withdrawn ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to withdraw ❌");
    }
  };

  // Delete handler (Employer only)
  const handleDelete = async (jobId) => {
    if (!user || role?.toLowerCase() !== "employer") return;
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      alert("Job deleted ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to delete ❌");
    }
  };

  // View handler
  const handleView = (job) => {
    navigate(`/job/${job._id}`);
  };

  return (
    <div className="job-list-container">
      <h2 className="job-list-title">Available Jobs</h2>
      <div className="job-grid">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              role={role}           // role determines which buttons appear
              user={user}           // pass logged in user
              onApply={handleApply} // applies for job
              onWithdraw={handleWithdraw} // withdraw application
              onDelete={handleDelete}     // delete job (employer)
              onView={handleView}         
            />
          ))
        ) : (
          <p>No jobs found.</p>
        )}
      </div>
    </div>
  );
}

export default JobList;
