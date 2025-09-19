import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
 
  const [interest, setInterest] = useState('');
  const [role, setRole] = useState('jobseeker');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', { 
        name, 
        email, 
        password, 
        mobile, 
       
        interest, 
        role 
      });
      localStorage.setItem('token', res.data.token);
      navigate('/jobs');
      

    setName('');
    setEmail('');
    setPassword('');
    setMobile('');
    setInterest('');
    setRole('jobseeker');
    navigate('/profile');

  
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={e=>setName(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Mobile Number" 
          value={mobile} 
          onChange={e=>setMobile(e.target.value)} 
          required 
        />
       
        <input 
          type="text" 
          placeholder="Interest" 
          value={interest} 
          onChange={e=>setInterest(e.target.value)} 
          required 
        />
     <div style={{ display: "flex", gap: "20px", margin: "10px 0" }}>
      <label style={{ fontSize: "1rem", color: "#0b0a0aff", cursor: "pointer" }}>
    <input
      type="radio"
      value="employer"
      checked={role === "employer"}
      onChange={(e) => setRole(e.target.value)}
      style={{ marginRight: "6px" }}
    />
    Employer
  </label>
  <label style={{ fontSize: "1rem", color: "#0a0a0aff", cursor: "pointer" }}>
    <input
      type="radio"
      value="jobseeker"
      checked={role === "jobseeker"}
      onChange={(e) => setRole(e.target.value)}
      style={{ marginRight: "6px" }}
    />
    Job Seeker
  </label>

</div>

        <button type="submit" >Register</button>
      </form>
    </div>
  );
}

export default Register;
