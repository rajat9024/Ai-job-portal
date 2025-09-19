import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/JobDetails.css";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    // API call se job details laao
    const fetchJob = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/jobs/${id}`);
        setJob(res.data);
      } catch (err) {
        console.error("Error fetching job:", err);
      }
    };
    fetchJob();
  }, [id]);

  if (!job) {
    return <div className="job-details-container">Loading...</div>;
  }

  return (
    <div className="job-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

      <div className="job-details-card">
        <h2>Title : {job.title}</h2>
        <dl>
          <dt>Company:</dt>
          <dd>{job.company || "N/A"}</dd>
        </dl>
        <dl>
          <dt>Location:</dt>
          <dd>{job.location || "N/A"}</dd>
        </dl>
        <dl>
          <dt>Skills:</dt>
          <dd>{job.skills?.join(", ")}</dd>
        </dl>
        <dl>
          <dt>Tags:</dt>
          <dd>{job.tags?.join(", ") || "N/A"}</dd>
        </dl>
        <dl><dt>Posted At : </dt> <dd>{new Date(job.postedAt).toLocaleDateString()}</dd></dl>
        <dl>
          <dt>Description:</dt>
          <dd>{job.description || "N/A"}</dd>
        </dl>
      </div>
    </div>
  );
}

export default JobDetails;
