import React from "react";
import { useNavigate } from "react-router-dom";
import "./JobCard.css";

function JobCard({ job, role, user, onApply, onWithdraw, onDelete, onView }) {
  const navigate = useNavigate();

  const isNew =
    job?.postedAt &&
    new Date(job.postedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="job-card">
      {isNew && <div className="badge">New</div>}

      <h3 className="job-title">{job?.title || "Untitled Job"}</h3>
      <p className="truncate">
        <b>Company:</b> {job?.company || "N/A"}
      </p>
      <p className="truncate">
        <b>Location:</b> {job?.location || "N/A"}
      </p>
      <p className="truncate">
        <b>Skills:</b> {job?.skills?.join(", ") || "N/A"}
      </p>
      <p className="truncate">
        <b>Salary:</b> {job?.salary || "N/A"}
      </p>
      <p className="truncate">
        <b>Type:</b> {job?.tags?.length > 0 ? job.tags.join(", ") : "N/A"}
      </p>
      <p className="truncate">
        <b>Description:</b> {job?.description || "N/A"}
      </p>

      <div className="job-actions">
        {/* JobSeeker buttons */}
        {role?.toLowerCase() === "jobseeker" && (
          <>
            {job?.applied ? (
              <button
                className="withdraw-btn"
                onClick={() => onWithdraw && onWithdraw(job._id)}
              >
                Withdraw
              </button>
            ) : (
              <button
                className="apply-btn"
                onClick={() => onApply && onApply(job._id)}
              >
                Apply
              </button>
            )}
            <button className="view-btn" onClick={() => onView && onView(job)}>
              View
            </button>
          </>
        )}

        {/* Employer view button */}
        {role?.toLowerCase() === "employer" && (
          <button className="view-btn" onClick={() => onView && onView(job)}>
            View
          </button>
        )}

        {/* Employer delete button */}
        {role?.toLowerCase() === "employer" && user?._id && (
          (() => {
            const postedById = String(job?.postedBy?._id || job?.postedBy);
            const userId = String(user._id);

            return postedById === userId ? (
              <button className="delete-btn" onClick={() => onDelete(job._id)}>
                ❌ Delete
              </button>
            ) : null;
          })()
        )}
      </div>
    </div>
  );
}

export default JobCard;
