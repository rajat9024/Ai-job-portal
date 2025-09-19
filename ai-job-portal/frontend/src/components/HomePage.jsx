import React from "react";
import "./HomePage.css";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/banner-right.png";
import Footer from "../components/Footer"
import FAQ from "../components/FAQ"
import {FaRegistered, FaUpload,FaPaperPlane} from "react-icons/fa";
const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="main-container">
    <div className="homepage">
      <div className="hero-section">
        {/* Left Side Content */}
        <div className="hero-content">
          <h1>
            Discover Your <span className="highlight">Dream Career</span>
          </h1>
          <p>
            <b>Browse thousands of job postings and apply easily</b> 
          <p><b>Job-Care</b> bridges the gap between job seekers and companies.</p> 
          </p>
          <div className="hero-buttons">
            <button className="btn primary" onClick={() => navigate("/joblist")}>Get Dream Job</button>
            {/* <button className="btn secondary" onClick={() => navigate("/employerprofile")}>Post FREE Job Now</button> */}
          </div>
        </div>

        {/* Right Side Hero Image */}
        <div className="hero-image">
        <img src={heroImg} alt="hero" />
        </div>
      </div>
      <div className="Easy-step">
        <h2>Easy Steps to get your dream job</h2>
        <div className="step">
       
         <a href="/Register"><FaRegistered/><h3>Register</h3></a>
         
         <a href="/Resume"><FaUpload/><h3>Upload Your Resume</h3></a>
         <a href="/joblist"><FaPaperPlane/><h3>Apply for Job</h3></a>
         
        
        </div>
      </div>
      <FAQ/>
      </div>
    <Footer/>
    
    </div>
  );
};

export default HomePage;
