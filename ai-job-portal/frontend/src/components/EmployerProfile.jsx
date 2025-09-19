import React, { useState, useEffect } from "react";
import API from "../api";
import JobCard from "./JobCard";
import JobPostForm from "./JobPostForm";
import "../styles/EmployerProfile.css";
import { useNavigate } from "react-router-dom";

function EmployerProfile({ user }) {

  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false); // boolean only

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const res = await API.get("/jobs");
        const myJobs = res.data.filter((job) => job.postedBy._id === user._id);
        setJobs(myJobs);
      } catch (err) {
        console.error("My jobs fetch error:", err);
      }
    };
    fetchMyJobs();
  }, [user._id]);

const handleDelete = async (jobId) => {
  if (!window.confirm("Are you sure to delete this job?")) return;

  try {
    const res = await API.delete(`/jobs/${jobId}/job`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });

    if (res.data?.msg === "Job deleted") {
      setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
      alert("Job deleted ✅");
    }
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.msg || "You cannot delete this job ❌");
  }
};



  const handleJobPosted = (newJob) => {
    setJobs([newJob, ...jobs]);
    setShowForm(false);
  };

  return (
    <div className="profile-container">
      {/* Profile Card */}
      <div className="profile-card">
        <img
          src="https://www.w3schools.com/howto/img_avatar.png"
          alt="Avatar"
          className="profile-avatar"
        />
        <h3>{user.name}</h3>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Role:</b> {user.role}</p>
        <p><b>Skills:</b> {user.skills?.join(", ")}</p>
      </div>

      {/* Employer Job Section */}
      <div className="job-section">
        <button
          onClick={() => setShowForm(true)}
          className="post-btn"
        >
          Post a Job ➕
        </button>

        <h3>My Jobs</h3>
        {jobs.length === 0 ? (
          <p>No jobs posted yet.</p>
        ) : (
          <div className="employer-jobs-grid">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                 user={user} 
                 role="employer"
                onDelete={() => handleDelete(job._id)}
                onView={() => navigate(`/job/${job._id}`)} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Popup only for posting new job */}
      {showForm && (
        <div className="modal-overlay">
          <JobPostForm
            onClose={() => setShowForm(false)}
             onJobPosted={(newJob) => setJobs([...jobs, newJob])} 
            
/>
        
        </div>
      )}
    </div>
  );
}

export default EmployerProfile;
