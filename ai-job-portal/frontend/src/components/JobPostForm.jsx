import React, { useState } from "react";
import API from "../api";
import "../components/JobPostForm.css"

function JobPostForm({ onClose, onJobPosted }) {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    skills: "",
    salary: "",
    tags: [],       // ✅ array for multiple selection
    description: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ handle checkbox for multiple tags
  const handleTagChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, value] }));
    } else {
      setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jobData = {
        ...form,
        skills: form.skills.split(",").map(s => s.trim()),
        tags: form.tags
      };
      const res = await API.post("/jobs", jobData);
      alert("Job Posted ✅");
      onJobPosted(res.data); 
      setForm({ title:"", company:"", location:"", skills:"", salary:"", tags:[], description:"" });
    } catch (err) {
      console.error("Job post error:", err);
      alert("Failed to post job ❌");
    }
  };

  return (
    <div className="modal-box">
      <button className="modal-close" onClick={onClose}>❌</button>
      <h2>Post a Job</h2>
      <form onSubmit={handleSubmit} className="job-form">
        <input type="text" name="title" placeholder="Job Title" value={form.title} onChange={handleChange} required />
        <input type="text" name="company" placeholder="Company" value={form.company} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location (e.g. Remote, Delhi)" value={form.location} onChange={handleChange} required />
        <input type="number" name="salary" placeholder="Salary (e.g. ₹6 LPA, $50k/year)" value={form.salary} onChange={handleChange} min="0" />
        <input type="text" name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} required />
        
        <div className="tags-group">
          <label>
            <input type="checkbox" value="Full-time" checked={form.tags.includes("Full-time")} onChange={handleTagChange} />
            Full-time
          </label>
          <label>
            <input type="checkbox" value="Part-time" checked={form.tags.includes("Part-time")} onChange={handleTagChange} />
            Part-time
          </label>
          <label>
            <input type="checkbox" value="Internship" checked={form.tags.includes("Internship")} onChange={handleTagChange} />
            Internship
          </label>
          <label>
            <input type="checkbox" value="Remote" checked={form.tags.includes("Remote")} onChange={handleTagChange} />
            Remote
          </label>
        </div>

        <textarea name="description" placeholder="Job Description" value={form.description} onChange={handleChange} required />
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}

export default JobPostForm;
