import React, { useState, useEffect } from 'react';
import API from '../api';

function ResumeBuilder() {
  const [resumeFile, setResumeFile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await API.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!resumeFile) return alert("Select a file first");
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      const res = await API.post('/auth/resume', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(res.data.msg);
      setUser({ ...user, resume: res.data.resume });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Upload failed");
    }
  };

  return (
    <div className="resume-builder">
      <h2>Resume Builder</h2>

      {user?.resume ? (
        <p>Current Resume: <a href={user.resume.url} target="_blank">{user.resume.filename}</a></p>
      ) : (
        <p>No resume uploaded</p>
      )}

      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Resume</button>
    </div>
  );
}

export default ResumeBuilder;
