import React, { useState, useEffect } from "react";
import API from "../api";
import "../styles/JobSeekerProfile.css";

function JobSeekerProfile({ user }) {
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await API.get("/jobs/applied");
        setAppliedJobs(res.data);
      } catch (err) {
        console.error("Applied jobs fetch error:", err);
      }
    };
    fetchAppliedJobs();
  }, []);

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
        <p>
          <b>Email:</b> {user.email}
        </p>
        <p>
          <b>Role:</b> {user.role}
        </p>
        <p>
          <b>Skills:</b> {user.skills?.join(", ")}
        </p>
      </div>

      {/* Applied Jobs */}
      <div className="applied-section">
        <h3>Applied Jobs</h3>
        {appliedJobs.length === 0 ? (
          <p>You haven't applied to any jobs yet.</p>
        ) : (
          <div className="applied-jobs-grid">
            {appliedJobs.map((app) => (
              <div key={app._id} className="applied-job-card">
                <h4>{app.jobId?.title}</h4>
                <p>
                  <b>Company:</b> {app.jobId?.company}
                </p>
                <p>
                  <b>Status:</b> {app.status}
                </p>
                <p>
                  <b>Applied At:</b>{" "}
                  {new Date(app.appliedAt).toLocaleDateString()}
                </p>

                <button
                  className="withdraw-btn"
                  onClick={async () => {
                    if (window.confirm("Withdraw this application?")) {
                      try {
                        if (!app?.jobId?._id) {
                          alert("Invalid job. Cannot withdraw ❌");
                          return;
                        }

                        await API.delete(`/applications/${app.jobId._id}`);

                        setAppliedJobs(
                          appliedJobs.filter(
                            (a) =>
                              a?.jobId?._id && a.jobId._id !== app.jobId._id
                          )
                        );

                        alert("Application withdrawn ✅");
                      } catch (err) {
                        console.error(err);
                        alert("Failed to withdraw ❌");
                      }
                    }
                  }}
                >
                  Withdraw ❌
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobSeekerProfile;
